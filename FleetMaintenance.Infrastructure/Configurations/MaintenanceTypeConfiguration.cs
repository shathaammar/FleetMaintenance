using FleetMaintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FleetMaintenance.Infrastructure.Configurations;

public class MaintenanceTypeConfiguration
    : IEntityTypeConfiguration<MaintenanceType>
{
    public void Configure(EntityTypeBuilder<MaintenanceType> builder)
    {
        builder.ToTable("MaintenanceTypes");

        builder.HasKey(type => type.Id);

        builder.Property(type => type.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(type => type.Name)
            .IsUnique();

        builder.Property(type => type.Description)
            .HasMaxLength(500);
    }
}