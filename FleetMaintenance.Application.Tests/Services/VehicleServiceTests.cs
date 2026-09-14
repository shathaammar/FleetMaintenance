using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Application.Services;
using FleetMaintenance.Domain.Entities;
using FleetMaintenance.Domain.Enums;
using Moq;
using Xunit;

namespace FleetMaintenance.Application.Tests.Services;

public class VehicleServiceTests
{
    private readonly Mock<IVehicleRepository> _vehicleRepositoryMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();

    private VehicleService CreateService()
    {
        return new VehicleService(
            _vehicleRepositoryMock.Object,
            _unitOfWorkMock.Object);
    }

    private static Vehicle CreateVehicle(int id, int currentMileage)
    {
        return new Vehicle
        {
            Id = id,
            PlateNumber = "ABC-123",
            Make = "Toyota",
            Model = "Corolla",
            Year = 2020,
            CurrentMileage = currentMileage,
            Status = VehicleStatus.Active,
            CreatedAt = DateTime.UtcNow
        };
    }

    [Fact]
    public async Task UpdateAsync_WhenLoweringMileageBelowCompletedServiceHistory_ThrowsConflictException()
    {
        Vehicle vehicle = CreateVehicle(id: 1, currentMileage: 50000);

        _vehicleRepositoryMock
            .Setup(repo => repo.GetByIdAsync(vehicle.Id))
            .ReturnsAsync(vehicle);

        _vehicleRepositoryMock
            .Setup(repo => repo.GetMaxCompletedMileageAsync(vehicle.Id))
            .ReturnsAsync(50000);

        VehicleService service = CreateService();

        var dto = new UpdateVehicleDto { CurrentMileage = 100 };

        await Assert.ThrowsAsync<ConflictException>(() =>
            service.UpdateAsync(vehicle.Id, dto));

        Assert.Equal(50000, vehicle.CurrentMileage);

        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_WhenNoCompletedServiceHistory_AllowsLoweringMileage()
    {
        Vehicle vehicle = CreateVehicle(id: 2, currentMileage: 5000);

        _vehicleRepositoryMock
            .Setup(repo => repo.GetByIdAsync(vehicle.Id))
            .ReturnsAsync(vehicle);

        _vehicleRepositoryMock
            .Setup(repo => repo.GetMaxCompletedMileageAsync(vehicle.Id))
            .ReturnsAsync((int?)null);

        VehicleService service = CreateService();

        var dto = new UpdateVehicleDto { CurrentMileage = 100 };

        var result = await service.UpdateAsync(vehicle.Id, dto);

        Assert.Equal(100, vehicle.CurrentMileage);
        Assert.Equal(100, result.CurrentMileage);

        _unitOfWorkMock.Verify(uow => uow.SaveChangesAsync(), Times.Once);
    }
}