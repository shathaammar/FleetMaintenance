using FleetMaintenance.Application.Common.Exceptions;
using FleetMaintenance.Application.DTOs.MaintenanceTypes;
using FleetMaintenance.Application.DTOs.Vehicles;
using FleetMaintenance.Application.Interfaces.Repositories;
using FleetMaintenance.Application.Interfaces.Services;
using FleetMaintenance.Application.Interfaces.UnitOfWork;
using FleetMaintenance.Domain.Entities;

namespace FleetMaintenance.Application.Services
{
    public class MaintenanceTypeService : IMaintenanceTypeService
    {
        private readonly IMaintenanceTypeRepository _maintenanceTypeRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenericRepository<MaintenanceType> _genericRepository;

        public MaintenanceTypeService(
            IMaintenanceTypeRepository maintenanceTypeRepository,
            IUnitOfWork unitOfWork,
            IGenericRepository<MaintenanceType> genericRepository)
        {
            _maintenanceTypeRepository = maintenanceTypeRepository;
            _unitOfWork = unitOfWork;
            _genericRepository = genericRepository;
        }

        public async Task<IEnumerable<MaintenanceTypeDto>> GetAllAsync()
        {
            var maintenanceTypes = await _maintenanceTypeRepository.GetAllAsync();

            return maintenanceTypes
                .Select(MapToDto)
                .ToList();
        }

        public async Task<MaintenanceTypeDto> GetByIdAsync(int id)
        {
            var maintenanceType = await _genericRepository.GetByIdAsync(id);

            if (maintenanceType is null)
            {
                throw new NotFoundException(
                    $"MaintenanceType with ID {id} was not found.");
            }

            return MapToDto(maintenanceType);
        }

        public async Task<MaintenanceTypeDto> CreateAsync(CreateMaintenanceTypeDto dto)
        {
            string name = dto.Name.Trim();

            bool nameExists =
                await _maintenanceTypeRepository.NameExistsAsync(name);

            if (nameExists)
            {
                throw new InvalidOperationException(
                    $"A maintenance type with name '{name}' already exists.");
            }

            var maintenanceType = new MaintenanceType
            {
                Name = name,
                Description = dto.Description?.Trim()
            };

            await _genericRepository.AddAsync(maintenanceType);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(maintenanceType);
        }

        public async Task<MaintenanceTypeDto> UpdateAsync(int id, UpdateMaintenanceTypeDto dto)
        {
            var maintenanceType = await _genericRepository.GetByIdAsync(id);

            if (maintenanceType is null)
            {
                throw new NotFoundException(
                $"Maintenance type with ID {id} was not found.");
            }

            if (dto.Name is not null)
            {
                string name = dto.Name.Trim();

                bool nameExists =
                    await _maintenanceTypeRepository.NameExistsAsync(name);
                
                if (nameExists)
                {
                    throw new InvalidOperationException(
                        $"A maintenance type with name '{name}' already exists.");
                }
                maintenanceType.Name = name;
            }

            if (dto.Description is not null)
            {
                maintenanceType.Description = dto.Description.Trim();
            }

            await _genericRepository.UpdateAsync(maintenanceType);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(maintenanceType);
        }

        public async Task DeleteAsync(int id)
        {
            var maintenanceType = await _genericRepository.GetByIdAsync(id);

            if (maintenanceType is null)
            {
                throw new NotFoundException(
                    $"Maintenance type with ID {id} was not found.");
            }

            await _genericRepository.DeleteAsync(maintenanceType);
            await _unitOfWork.SaveChangesAsync();
        }

        private static MaintenanceTypeDto MapToDto(MaintenanceType maintenanceType)
        {
            return new MaintenanceTypeDto
            {
                Id = maintenanceType.Id,
                Name = maintenanceType.Name,
                Description = maintenanceType.Description
            };
        }
    }
}