using FleetMaintenance.Domain.Enums;

namespace FleetMaintenance.Application.DTOs.MaintenanceRecords
{
    public class MaintenanceRecordFilterDto
    {
        public string? Search { get; set; }

        public int? VehicleId { get; set; }

        public int? MaintenanceTypeId { get; set; }

        public MaintenanceStatus? Status { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 10;
    }
}
