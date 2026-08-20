using FleetMaintenance.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace FleetMaintenance.Domain.Entities
{
    public class Vehicle
    {
        public int Id { get; set; }

        public string PlateNumber { get; set; } = string.Empty;

        public string Make { get; set; } = string.Empty;

        public string Model { get; set; } = string.Empty;

        public int Year { get; set; }

        public int CurrentMileage { get; set; }

        public VehicleStatus Status { get; set; } = VehicleStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
        public ICollection<MaintenanceRequest> MaintenanceRequests { get; set; } = new List<MaintenanceRequest>();
    }
}
