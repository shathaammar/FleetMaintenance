using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.Common.Models;
using FleetMaintenance.Application.DTOs.MaintenanceRequests;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.Services;

public class MaintenanceRequestService: IMaintenanceRequestService
{
    private readonly IMaintenanceRequestRepository _maintenanceRequestRepository;
    private readonly IGenericRepository<Vehicle> _vehicleRepository;
    private readonly IGenericRepository<MaintenanceType> _maintenanceTypeRepository;
    private readonly IMaintenanceRecordRepository _maintenanceRecordRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public MaintenanceRequestService(
        IMaintenanceRequestRepository maintenanceRequestRepository,
        IGenericRepository<Vehicle> vehicleRepository,
        IGenericRepository<MaintenanceType> maintenanceTypeRepository,
        IMaintenanceRecordRepository maintenanceRecordRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _maintenanceRequestRepository = maintenanceRequestRepository;
        _vehicleRepository = vehicleRepository;
        _maintenanceTypeRepository = maintenanceTypeRepository;
        _maintenanceRecordRepository = maintenanceRecordRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<MaintenanceRequestDto> GetByIdAsync(int id)
    {
        var request = await _maintenanceRequestRepository.GetByIdWithDetailsAsync(id);

        if (request is null)
        {
            throw new NotFoundException(
                "Maintenance request was not found.");
        }

        return MapToDto(request);
    }

    public async Task<MaintenanceRequestDto>  GetMyRequestByIdAsync(int id)
    {
        string userId = _currentUserService.UserId;

        var request = await _maintenanceRequestRepository.GetByIdWithDetailsAsync(id);

        if (request is null || request.RequestedByUserId != userId)
        {
            throw new NotFoundException(
                "Maintenance request was not found.");
        }

        return MapToDto(request);
    }

    public async Task<PagedResult<MaintenanceRequestDto>> GetPagedAsync(MaintenanceRequestFilterDto filter)
    {
        PagedResult<MaintenanceRequest> result = await _maintenanceRequestRepository.GetPagedAsync(filter);

        return MapPagedResult(result);
    }

    public async Task<PagedResult<MaintenanceRequestDto>> GetMyRequestsPagedAsync(MaintenanceRequestFilterDto filter)
    {
        string userId = _currentUserService.UserId;

        PagedResult<MaintenanceRequest> result = await _maintenanceRequestRepository.GetPagedByUserIdAsync(filter, userId);

        return MapPagedResult(result);
    }

    public async Task<MaintenanceRequestDto> CreateAsync(CreateMaintenanceRequestDto dto)
    {
        string userId = _currentUserService.UserId;

        Vehicle? vehicle = await _vehicleRepository.GetByIdAsync(dto.VehicleId);

        if (vehicle is null)
        {
            throw new NotFoundException(
                "Vehicle was not found.");
        }

        MaintenanceType? maintenanceType = await _maintenanceTypeRepository.GetByIdAsync(dto.MaintenanceTypeId);

        if (maintenanceType is null)
        {
            throw new NotFoundException(
                "Maintenance type was not found.");
        }

        bool hasPendingRequest = await _maintenanceRequestRepository.HasPendingRequestAsync(userId, dto.VehicleId, dto.MaintenanceTypeId);

        if (hasPendingRequest)
        {
            throw new ConflictException(
                "You already have a pending request " +
                "for this vehicle and maintenance type.");
        }

        var request = new MaintenanceRequest
        {
            VehicleId = dto.VehicleId,
            MaintenanceTypeId = dto.MaintenanceTypeId,
            RequestedByUserId = userId,
            RequestedByFullName = _currentUserService.FullName,
            RequestedByEmail = _currentUserService.Email,
            Description = dto.Description.Trim(),
            PreferredDate = dto.PreferredDate?.Date,
            Status = MaintenanceRequestStatus.Pending,
            RequestedAt = DateTime.UtcNow
        };

        await _maintenanceRequestRepository.AddAsync(request);

        await _unitOfWork.SaveChangesAsync();

        return await GetMyRequestByIdAsync(request.Id);
    }

    public async Task<MaintenanceRequestDto> ApproveAsync(int id, ApproveMaintenanceRequestDto dto)
    {
        MaintenanceRequest? request = await _maintenanceRequestRepository.GetByIdAsync(id);

        if (request is null)
        {
            throw new NotFoundException(
                "Maintenance request was not found.");
        }

        if (request.Status != MaintenanceRequestStatus.Pending)
        {
            throw new ConflictException(
                $"Only pending maintenance requests can be approved. This request is currently {request.Status}.");
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(request.VehicleId);

        if (vehicle is null)
        {
            throw new NotFoundException(
                $"Vehicle with ID {request.VehicleId} was not found.");
        }

        if (dto.DueMileage.HasValue && dto.DueMileage.Value <vehicle.CurrentMileage)
        {
            throw new ConflictException(
                $"Due mileage cannot be less than the vehicle's current mileage of {vehicle.CurrentMileage}.");
        }

        bool duplicateExists = await _maintenanceRecordRepository
            .HasScheduledDuplicateAsync(
            request.VehicleId,
            request.MaintenanceTypeId,
            dto.ScheduledDate);

        if (duplicateExists)
        {
            throw new ConflictException(
                "A scheduled maintenance record already exists for this vehicle, maintenance type, and date.");
        }

        var maintenanceRecord = new MaintenanceRecord
            {
                VehicleId = request.VehicleId,
                MaintenanceTypeId = request.MaintenanceTypeId,
                ScheduledDate = dto.ScheduledDate.Date,
                DueMileage = dto.DueMileage,
                Notes = string.IsNullOrWhiteSpace(dto.Notes)
                        ? request.Description
                        : dto.Notes.Trim(),
                Status = MaintenanceStatus.Scheduled,
                CreatedAt = DateTime.UtcNow
            };

        request.Status = MaintenanceRequestStatus.Approved;

        request.ReviewedAt = DateTime.UtcNow;

        request.ReviewedByUserId = _currentUserService.UserId;

        request.RejectionReason = null;

        request.MaintenanceRecord = maintenanceRecord;

        await _maintenanceRecordRepository.AddAsync(maintenanceRecord);

        await _maintenanceRequestRepository.UpdateAsync(request);

        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(request.Id);
    }

    public async Task<MaintenanceRequestDto> RejectAsync(int id, RejectMaintenanceRequestDto dto)
    {
        MaintenanceRequest? request = await _maintenanceRequestRepository.GetByIdAsync(id);

        if (request is null)
        {
            throw new NotFoundException(
                "Maintenance request was not found.");
        }

        if (request.Status != MaintenanceRequestStatus.Pending)
        {
            throw new ConflictException(
                $"Only pending maintenance requests can be rejected. This request is currently {request.Status}.");
        }

        request.Status = MaintenanceRequestStatus.Rejected;

        request.ReviewedAt = DateTime.UtcNow;

        request.ReviewedByUserId = _currentUserService.UserId;

        request.RejectionReason = dto.Reason.Trim();

        await _maintenanceRequestRepository.UpdateAsync(request);

        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(request.Id);
    }

    public async Task<MaintenanceRequestDto> CancelMyRequestAsync(int id)
    {
        string userId = _currentUserService.UserId;

        MaintenanceRequest? request = await _maintenanceRequestRepository.GetByIdAsync(id);

        if (request is null || request.RequestedByUserId != userId)
        {
            throw new NotFoundException("Maintenance request was not found.");
        }

        if (request.Status != MaintenanceRequestStatus.Pending)
        {
            throw new ConflictException(
                $"Only pending maintenance requests can be cancelled. This request is currently {request.Status}.");
        }

        request.Status = MaintenanceRequestStatus.Cancelled;

        request.ReviewedAt = null;
        request.ReviewedByUserId = null;
        request.RejectionReason = null;
        request.MaintenanceRecordId = null;

        await _maintenanceRequestRepository.UpdateAsync(request);

        await _unitOfWork.SaveChangesAsync();

        return await GetMyRequestByIdAsync(request.Id);
    }


    // Helper Methods
    private static PagedResult<MaintenanceRequestDto> MapPagedResult(PagedResult<MaintenanceRequest> result)
    {
        return new PagedResult<MaintenanceRequestDto>
        {
            Items = result.Items
                .Select(MapToDto)
                .ToList(),

            PageNumber = result.PageNumber,

            PageSize = result.PageSize,

            TotalCount = result.TotalCount
        };
    }

    private static MaintenanceRequestDto MapToDto(MaintenanceRequest request)
    {
        return new MaintenanceRequestDto
        {
            Id = request.Id,
            VehicleId = request.VehicleId,
            VehiclePlateNumber = request.Vehicle.PlateNumber,
            MaintenanceTypeId = request.MaintenanceTypeId,
            MaintenanceTypeName = request.MaintenanceType.Name,
            RequestedByUserId = request.RequestedByUserId,
            RequestedByFullName = request.RequestedByFullName,
            RequestedByEmail = request.RequestedByEmail,
            Description = request.Description,
            PreferredDate = request.PreferredDate,
            Status = request.Status,
            RequestedAt = request.RequestedAt,
            ReviewedAt = request.ReviewedAt,
            ReviewedByUserId = request.ReviewedByUserId,
            RejectionReason = request.RejectionReason,
            MaintenanceRecordId = request.MaintenanceRecordId
        };
    }
}