using FleetMaintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FleetMaintenance.Infrastructure.Configurations;

public class MaintenanceRecordConfiguration
    : IEntityTypeConfiguration<MaintenanceRecord>
{
    public void Configure(EntityTypeBuilder<MaintenanceRecord> builder)
    {
        builder.ToTable("MaintenanceRecords");

        builder.HasKey(record => record.Id);

        builder.Property(record => record.ScheduledDate)
            .IsRequired();

        builder.Property(record => record.Cost)
            .HasColumnType("decimal(18,2)");

        builder.Property(record => record.Notes)
            .HasMaxLength(1000);

        builder.Property(record => record.Status)
            .IsRequired();

        builder.Property(record => record.CreatedAt)
            .IsRequired();

        builder.HasOne(record => record.Vehicle)
            .WithMany(vehicle => vehicle.MaintenanceRecords)
            .HasForeignKey(record => record.VehicleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(record => record.MaintenanceType)
            .WithMany(type => type.MaintenanceRecords)
            .HasForeignKey(record => record.MaintenanceTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}