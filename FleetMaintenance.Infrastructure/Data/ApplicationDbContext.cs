using FleetMaintenance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FleetMaintenance.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Vehicle> Vehicles { get; set; }

        public DbSet<MaintenanceType> MaintenanceTypes { get; set; }

        public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }
    }
}
