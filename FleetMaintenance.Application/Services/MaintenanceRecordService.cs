using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRecords;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.Services;

public class MaintenanceRecordService
    : IMaintenanceRecordService
{
    private readonly IMaintenanceRecordRepository _recordRepository;
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IMaintenanceTypeRepository _typeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MaintenanceRecordService(
        IMaintenanceRecordRepository recordRepository,
        IVehicleRepository vehicleRepository,
        IMaintenanceTypeRepository typeRepository,
        IUnitOfWork unitOfWork)
    {
        _recordRepository = recordRepository;
        _vehicleRepository = vehicleRepository;
        _typeRepository = typeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<PagedResult<MaintenanceRecordDto>> GetPagedAsync(MaintenanceRecordFilterDto filter)
    {
        var result =
            await _recordRepository.GetPagedAsync(filter);

        return new PagedResult<MaintenanceRecordDto>
        {
            Items = result.Items
                .Select(MapToDto)
                .ToList(),

            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount
        };
    }

    public async Task<MaintenanceRecordDto> GetByIdAsync(int id)
    {
        var record = await _recordRepository.GetByIdWithDetailsAsync(id);

        if (record is null)
        {
            throw new NotFoundException(
                $"Maintenance record with ID {id} was not found.");
        }

        return MapToDto(record);
    }

    public async Task<List<MaintenanceRecordDto>> GetByVehicleIdAsync(int vehicleId)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {vehicleId} was not found.");
        }

        var records = await _recordRepository.GetByVehicleIdAsync(vehicleId);

        return records.Select(MapToDto).ToList();
    }

    public async Task<MaintenanceRecordDto> CreateAsync(CreateMaintenanceRecordDto dto)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(dto.VehicleId);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {dto.VehicleId} was not found.");
        }

        var maintenanceType = await _typeRepository.GetByIdAsync(dto.MaintenanceTypeId);

        if (maintenanceType is null)
        {
            throw new NotFoundException(
                $"Maintenance type with ID {dto.MaintenanceTypeId} was not found.");
        }

        if (dto.DueMileage.HasValue &&
            dto.DueMileage.Value <
                vehicle.CurrentMileage)
        {
            throw new ConflictException(
                $"Due mileage cannot be less than the vehicle's current mileage of {vehicle.CurrentMileage}.");
        }

        bool duplicateExists =
            await _recordRepository
                .HasScheduledDuplicateAsync(
                    dto.VehicleId,
                    dto.MaintenanceTypeId,
                    dto.ScheduledDate);

        if (duplicateExists)
        {
            throw new ConflictException(
                "A scheduled maintenance record already exists for this vehicle, maintenance type, and date.");
        }

        var record = new MaintenanceRecord
        {
            VehicleId = dto.VehicleId,
            MaintenanceTypeId = dto.MaintenanceTypeId,
            ScheduledDate = dto.ScheduledDate,
            DueMileage = dto.DueMileage,
            Notes = NormalizeNotes(dto.Notes),
            Status = MaintenanceStatus.Scheduled,
            CreatedAt = DateTime.UtcNow
        };

        await _recordRepository.AddAsync(record);

        await _unitOfWork.SaveChangesAsync();

        return await GetSavedRecordAsync(record.Id);
    }

    public async Task<MaintenanceRecordDto> UpdateAsync(int id, UpdateMaintenanceRecordDto dto)
    {
        var record = await GetEditableRecordAsync(id);

        int targetMaintenanceTypeId = dto.MaintenanceTypeId ?? record.MaintenanceTypeId;

        DateTime targetScheduledDate = dto.ScheduledDate ?? record.ScheduledDate;

        if (dto.MaintenanceTypeId.HasValue)
        {
            var maintenanceType = await _typeRepository.GetByIdAsync(targetMaintenanceTypeId);

            if (maintenanceType is null)
            {
                throw new NotFoundException(
                    $"Maintenance type with ID {targetMaintenanceTypeId} was not found.");
            }
        }

        if (dto.DueMileage.HasValue)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(record.VehicleId);

            if (vehicle is null)
            {
                throw new NotFoundException(
                    $"Vehicle with ID {record.VehicleId} was not found.");
            }

            if (dto.DueMileage.Value <
                vehicle.CurrentMileage)
            {
                throw new ConflictException(
                    $"Due mileage cannot be less than the vehicle's current mileage of {vehicle.CurrentMileage}.");
            }
        }

        bool duplicateExists =
            await _recordRepository.HasScheduledDuplicateAsync(
                record.VehicleId,
                targetMaintenanceTypeId,
                targetScheduledDate,
                excludedRecordId: id);

        if (duplicateExists)
        {
            throw new ConflictException(
                "A scheduled maintenance record already exists for this vehicle, maintenance type, and date.");
        }

        if (dto.MaintenanceTypeId.HasValue)
        {
            record.MaintenanceTypeId =  dto.MaintenanceTypeId.Value;
        }

        if (dto.ScheduledDate.HasValue)
        {
            record.ScheduledDate = dto.ScheduledDate.Value;
        }

        if (dto.DueMileage.HasValue)
        {
            record.DueMileage = dto.DueMileage.Value;
        }

        if (dto.Notes is not null)
        {
            record.Notes = NormalizeNotes(dto.Notes);
        }

        await _recordRepository.UpdateAsync(record);

        await _unitOfWork.SaveChangesAsync();

        return await GetSavedRecordAsync(record.Id);
    }

    public async Task<MaintenanceRecordDto> CompleteAsync(int id, CompleteMaintenanceRecordDto dto)
    {
        var record = await GetEditableRecordAsync(id);

        var vehicle = await _vehicleRepository.GetByIdAsync(record.VehicleId);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {record.VehicleId} was not found.");
        }

        if (dto.MileageAtService < vehicle.CurrentMileage)
        {
            throw new ConflictException(
                "Mileage at service cannot be less than " +
                "the vehicle's current mileage.");
        }

        record.CompletedDate = dto.CompletedDate;
        record.MileageAtService = dto.MileageAtService;
        record.Cost = dto.Cost;
        record.Status = MaintenanceStatus.Completed;

        if (dto.Notes is not null)
        {
            record.Notes = NormalizeNotes(dto.Notes);
        }

        vehicle.CurrentMileage = dto.MileageAtService;

        await _recordRepository.UpdateAsync(record);
        await _vehicleRepository.UpdateAsync(vehicle);

        await _unitOfWork.SaveChangesAsync();

        return await GetSavedRecordAsync(record.Id);
    }

    public async Task<MaintenanceRecordDto> CancelAsync(int id)
    {
        var record = await GetEditableRecordAsync(id);

        record.Status = MaintenanceStatus.Cancelled;

        await _recordRepository.UpdateAsync(record);
        await _unitOfWork.SaveChangesAsync();

        return await GetSavedRecordAsync(record.Id);
    }

    public async Task DeleteAsync(int id)
    {
        var record = await _recordRepository.GetByIdAsync(id);

        if (record is null)
        {
            throw new NotFoundException(
                $"Maintenance record with ID {id} was not found.");
        }

        if (record.Status == MaintenanceStatus.Completed)
        {
            throw new ConflictException(
                "Completed maintenance records cannot be deleted because they are part of the vehicle's service history.");
        }

        bool isLinkedToRequest = await _recordRepository.IsLinkedToRequestAsync(id);

        if (isLinkedToRequest)
        {
            throw new ConflictException(
                "This maintenance record cannot be deleted because it was created from an approved maintenance request. Cancel it instead.");
        }

        await _recordRepository.DeleteAsync(record);

        await _unitOfWork.SaveChangesAsync();
    }


    // Helper methods
    private async Task<MaintenanceRecord>
        GetEditableRecordAsync(int id)
    {
        var record = await _recordRepository.GetByIdAsync(id);

        if (record is null)
        {
            throw new NotFoundException(
                $"Maintenance record with ID {id} was not found.");
        }

        if (record.Status != MaintenanceStatus.Scheduled)
        {
            throw new ConflictException(
                "Only scheduled maintenance records can be modified.");
        }

        return record;
    }

    private async Task<MaintenanceRecordDto>
        GetSavedRecordAsync(int id)
    {
        var record =
            await _recordRepository.GetByIdWithDetailsAsync(id);

        if (record is null)
        {
            throw new NotFoundException(
                $"Maintenance record with ID {id} was not found.");
        }

        return MapToDto(record);
    }

    private static string? NormalizeNotes(string? notes)
    {
        return string.IsNullOrWhiteSpace(notes)
            ? null
            : notes.Trim();
    }

    private static MaintenanceRecordDto MapToDto(
        MaintenanceRecord record)
    {
        return new MaintenanceRecordDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehiclePlateNumber = record.Vehicle.PlateNumber,
            MaintenanceTypeId = record.MaintenanceTypeId,
            MaintenanceTypeName = record.MaintenanceType.Name,
            ScheduledDate = record.ScheduledDate,
            CompletedDate = record.CompletedDate,
            MileageAtService = record.MileageAtService,
            DueMileage = record.DueMileage,
            Cost = record.Cost,
            Notes = record.Notes,
            Status = record.Status,
            IsOverdue =
                record.Status == MaintenanceStatus.Scheduled &&
                record.ScheduledDate < DateTime.UtcNow,
            CreatedAt = record.CreatedAt
        };
    }
}