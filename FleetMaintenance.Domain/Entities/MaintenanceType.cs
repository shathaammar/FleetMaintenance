namespace FleetMaintenance.Domain.Entities
{
    public class MaintenanceType
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; }
            = new List<MaintenanceRecord>();
    }
}
