using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FleetMaintenance.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRequesterDetailsToMaintenanceRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestedByEmail",
                table: "MaintenanceRequests",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RequestedByFullName",
                table: "MaintenanceRequests",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestedByEmail",
                table: "MaintenanceRequests");

            migrationBuilder.DropColumn(
                name: "RequestedByFullName",
                table: "MaintenanceRequests");
        }
    }
}
