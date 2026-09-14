using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Application.Services;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;
using Moq;

namespace FleetMaintenance.Application.Tests.Services;

public class MaintenanceRecordServiceTests
{
    private readonly Mock<IMaintenanceRecordRepository> _recordRepositoryMock = new();
    private readonly Mock<IVehicleRepository> _vehicleRepositoryMock = new();
    private readonly Mock<IMaintenanceTypeRepository> _typeRepositoryMock = new();
    private readonly Mock<IMaintenanceRequestRepository> _requestRepositoryMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();

    private MaintenanceRecordService CreateService()
    {
        return new MaintenanceRecordService(
            _recordRepositoryMock.Object,
            _vehicleRepositoryMock.Object,
            _typeRepositoryMock.Object,
            _requestRepositoryMock.Object,
            _unitOfWorkMock.Object);
    }

    private static MaintenanceRecord CreateScheduledRecord(int id = 42)
    {
        return new MaintenanceRecord
        {
            Id = id,
            VehicleId = 1,
            MaintenanceTypeId = 1,
            ScheduledDate = DateTime.UtcNow.AddDays(3),
            Status = MaintenanceStatus.Scheduled,
            CreatedAt = DateTime.UtcNow,
            Vehicle = new Vehicle { Id = 1, PlateNumber = "ABC-123" },
            MaintenanceType = new MaintenanceType { Id = 1, Name = "Oil Change" }
        };
    }

    [Fact]
    public async Task CancelAsync_WhenLinkedToApprovedRequest_CascadesRequestToCancelled()
    {
        MaintenanceRecord record = CreateScheduledRecord();

        var linkedRequest = new MaintenanceRequest
        {
            Id = 7,
            VehicleId = record.VehicleId,
            MaintenanceTypeId = record.MaintenanceTypeId,
            Status = MaintenanceRequestStatus.Approved,
            MaintenanceRecordId = record.Id
        };

        _recordRepositoryMock
            .Setup(repo => repo.GetByIdAsync(record.Id))
            .ReturnsAsync(record);

        _recordRepositoryMock
            .Setup(repo => repo.GetByIdWithDetailsAsync(record.Id))
            .ReturnsAsync(record);

        _requestRepositoryMock
            .Setup(repo => repo.GetByMaintenanceRecordIdAsync(record.Id))
            .ReturnsAsync(linkedRequest);

        MaintenanceRecordService service = CreateService();

        var result = await service.CancelAsync(record.Id);

        Assert.Equal(MaintenanceStatus.Cancelled, record.Status);
        Assert.Equal(MaintenanceStatus.Cancelled, result.Status);

        Assert.Equal(MaintenanceRequestStatus.Cancelled, linkedRequest.Status);

        _requestRepositoryMock.Verify(
            repo => repo.UpdateAsync(It.IsAny<MaintenanceRequest>()),
            Times.Never);

        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task CancelAsync_WhenNotLinkedToAnyRequest_DoesNotUpdateAnyRequest()
    {
        MaintenanceRecord record = CreateScheduledRecord();

        _recordRepositoryMock
            .Setup(repo => repo.GetByIdAsync(record.Id))
            .ReturnsAsync(record);

        _recordRepositoryMock
            .Setup(repo => repo.GetByIdWithDetailsAsync(record.Id))
            .ReturnsAsync(record);

        _requestRepositoryMock
            .Setup(repo => repo.GetByMaintenanceRecordIdAsync(record.Id))
            .ReturnsAsync((MaintenanceRequest?)null);

        MaintenanceRecordService service = CreateService();

        var result = await service.CancelAsync(record.Id);

        Assert.Equal(MaintenanceStatus.Cancelled, record.Status);
        Assert.Equal(MaintenanceStatus.Cancelled, result.Status);

        _requestRepositoryMock.Verify(
            repo => repo.UpdateAsync(It.IsAny<MaintenanceRequest>()),
            Times.Never);

        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }
}