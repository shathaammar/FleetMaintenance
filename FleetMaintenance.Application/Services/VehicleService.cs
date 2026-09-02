using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.Services;

public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IGenericRepository<Vehicle> _genericRepository;

    public VehicleService(IVehicleRepository vehicleRepository,
        IUnitOfWork unitOfWork,
        IGenericRepository<Vehicle> genericRepository)
    {
        _vehicleRepository = vehicleRepository;
        _unitOfWork = unitOfWork;
        _genericRepository = genericRepository;
    }

    public async Task<List<VehicleDto>> GetAllAsync()
    {
        var vehicles = await _genericRepository.GetAllAsync();

        return vehicles
            .Select(MapToDto)
            .ToList();
    }
    public async Task<PagedResult<VehicleDto>> GetPagedAsync(VehicleFilterDto filter)
    {
        var result =
            await _vehicleRepository.GetPagedAsync(filter);

        return new PagedResult<VehicleDto>
        {
            Items = result.Items
                .Select(MapToDto)
                .ToList(),

            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount
        };
    }

    public async Task<VehicleDto> GetByIdAsync(int id)
    {
        var vehicle = await _genericRepository.GetByIdAsync(id);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {id} was not found.");
        }

        return MapToDto(vehicle);
    }

    public async Task<VehicleDto> CreateAsync(CreateVehicleDto dto)
    {
        string plateNumber = dto.PlateNumber.Trim().ToUpperInvariant();

        bool plateNumberExists =
            await _vehicleRepository.PlateNumberExistsAsync(plateNumber);

        if (plateNumberExists)
        {
            throw new ConflictException(
                $"A vehicle with plate number '{plateNumber}' already exists.");
        }

        var vehicle = new Vehicle
        {
            PlateNumber = plateNumber,
            Make = dto.Make.Trim(),
            Model = dto.Model.Trim(),
            Year = dto.Year,
            CurrentMileage = dto.CurrentMileage,
            Status = VehicleStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        await _genericRepository.AddAsync(vehicle);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(vehicle);
    }

    public async Task<VehicleDto> UpdateAsync(int id, UpdateVehicleDto dto)
    {
        var vehicle = await _genericRepository.GetByIdAsync(id);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {id} was not found.");
        }

        if (dto.PlateNumber is not null)
        {
            string plateNumber =
                dto.PlateNumber.Trim().ToUpperInvariant();

            bool plateNumberExists =
                await _vehicleRepository.PlateNumberExistsAsync(
                    plateNumber,
                    id);

            if (plateNumberExists)
            {
                throw new ConflictException(
                    $"A vehicle with plate number '{plateNumber}' already exists.");
            }

            vehicle.PlateNumber = plateNumber;
        }

        if (dto.Make is not null)
        {
            vehicle.Make = dto.Make.Trim();
        }

        if (dto.Model is not null)
        {
            vehicle.Model = dto.Model.Trim();
        }

        if (dto.Year.HasValue)
        {
            vehicle.Year = dto.Year.Value;
        }

        if (dto.CurrentMileage.HasValue)
        {
            vehicle.CurrentMileage = dto.CurrentMileage.Value;
        }

        if (dto.Status.HasValue)
        {
            vehicle.Status = dto.Status.Value;
        }

        await _genericRepository.UpdateAsync(vehicle);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(vehicle);
    }

    public async Task DeleteAsync(int id)
    {
        var vehicle =
            await _genericRepository.GetByIdAsync(id);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {id} was not found.");
        }

        bool isUsed =
            await _vehicleRepository.IsUsedAsync(id);

        if (isUsed)
        {
            throw new ConflictException(
                $"Vehicle '{vehicle.PlateNumber}' cannot be deleted because it is linked to maintenance records or requests.");
        }

        await _genericRepository.DeleteAsync(vehicle);

        await _unitOfWork.SaveChangesAsync();
    }

    private static VehicleDto MapToDto(Vehicle vehicle)
    {
        return new VehicleDto
        {
            Id = vehicle.Id,
            PlateNumber = vehicle.PlateNumber,
            Make = vehicle.Make,
            Model = vehicle.Model,
            Year = vehicle.Year,
            CurrentMileage = vehicle.CurrentMileage,
            Status = vehicle.Status,
            CreatedAt = vehicle.CreatedAt
        };
    }
}