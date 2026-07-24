using FleetMaintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FleetMaintenance.Infrastructure.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("Vehicles");

        builder.HasKey(vehicle => vehicle.Id);

        builder.Property(vehicle => vehicle.PlateNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.HasIndex(vehicle => vehicle.PlateNumber)
            .IsUnique();

        builder.Property(vehicle => vehicle.Make)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(vehicle => vehicle.Model)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(vehicle => vehicle.Year)
            .IsRequired();

        builder.Property(vehicle => vehicle.CurrentMileage)
            .IsRequired();

        builder.Property(vehicle => vehicle.Status)
            .IsRequired();

        builder.Property(vehicle => vehicle.CreatedAt)
            .IsRequired();
    }
}