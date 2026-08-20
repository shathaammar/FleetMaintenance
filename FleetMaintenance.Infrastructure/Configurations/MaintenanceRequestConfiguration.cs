using FleetMaintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FleetMaintenance.Infrastructure.Data.Configurations;

public class MaintenanceRequestConfiguration
    : IEntityTypeConfiguration<MaintenanceRequest>
{
    public void Configure(
        EntityTypeBuilder<MaintenanceRequest> builder)
    {
        builder.ToTable("MaintenanceRequests");

        builder.HasKey(request => request.Id);

        builder.Property(request => request.RequestedByUserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.Property(request => request.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(request => request.Status)
            .HasConversion<string>()
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(request => request.ReviewedByUserId)
            .HasMaxLength(450);

        builder.Property(request => request.RejectionReason)
            .HasMaxLength(500);

        builder.HasIndex(request => request.RequestedByUserId);

        builder.HasIndex(request => request.Status);

        builder.HasIndex(request => request.RequestedAt);

        builder.HasOne(request => request.Vehicle)
            .WithMany(vehicle => vehicle.MaintenanceRequests)
            .HasForeignKey(request => request.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(request => request.MaintenanceType)
            .WithMany(type => type.MaintenanceRequests)
            .HasForeignKey(request => request.MaintenanceTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(request => request.MaintenanceRecord)
            .WithOne()
            .HasForeignKey<MaintenanceRequest>(
                request => request.MaintenanceRecordId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}