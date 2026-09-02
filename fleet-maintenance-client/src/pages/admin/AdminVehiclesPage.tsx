import {
  AlertTriangle,
  CarFront,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { DeleteVehicleModal } from "../../components/dashboard/DeleteVehicleModal";
import { VehicleFormModal } from "../../components/dashboard/VehicleFormModal";
import { VehicleStatusBadge } from "../../components/dashboard/VehicleStatusBadge";
import { VEHICLE_STATUS_OPTIONS, } from "../../constants/vehicleStatus";
import { vehicleService } from "../../services/vehicleService";
import type { PagedResult, } from "../../types/api";
import type {
  Vehicle,
  VehicleStatus,
} from "../../types/vehicle";

import { formatDate } from "../../utils/formatDate";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const initialResult:
  PagedResult<Vehicle> = {
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  };

export function AdminVehiclesPage() {
  const [
    result,
    setResult,
  ] = useState<PagedResult<Vehicle>>(
    initialResult,
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState<VehicleStatus | "">("");

  const [
    pageNumber,
    setPageNumber,
  ] = useState(1);

  const [pageInput, setPageInput] =
    useState("1");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    formMode,
    setFormMode,
  ] = useState<"create" | "edit">(
    "create",
  );

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState<Vehicle | null>(null);

  const [
    isDeleteOpen,
    setIsDeleteOpen,
  ] = useState(false);

  const pageSize = 10;

  const loadVehicles = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data =
          await vehicleService.getVehicles({
            search:
              search.trim() || undefined,

            status:
              status || undefined,

            pageNumber,
            pageSize,
          });

        setResult(data);
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      search,
      status,
      pageNumber,
    ],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        void loadVehicles();
      },
      350,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadVehicles]);

  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  const goToPage = () => {
    const requestedPage = Number(pageInput);
    const totalPages = Math.max(
      result.totalPages,
      1,
    );
    const nextPage =
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= totalPages
        ? requestedPage
        : 1;

    setPageNumber(nextPage);
    setPageInput(String(nextPage));
  };

  const openCreateModal = () => {
    setSelectedVehicle(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (
    vehicle: Vehicle,
  ) => {
    setSelectedVehicle(vehicle);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const openDeleteModal = (
    vehicle: Vehicle,
  ) => {
    setSelectedVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  const handleDeleted = () => {
    if (
      result.items.length === 1 &&
      pageNumber > 1
    ) {
      setPageNumber(
        (currentPage) =>
          currentPage - 1,
      );

      return;
    }

    void loadVehicles();
  };

  const startItem =
    result.totalCount === 0
      ? 0
      : (result.pageNumber - 1) *
          result.pageSize +
        1;

  const endItem = Math.min(
    result.pageNumber * result.pageSize,
    result.totalCount,
  );

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Fleet Management
            </div>

            <h2 className="font-display text-2xl font-extrabold text-text-main">
              Vehicle Inventory
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              Manage every registered vehicle and
              monitor its operational status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_10px_30px_rgba(245,166,35,0.18)] transition hover:bg-primary-light"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-border-dark p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  maxLength={100}
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value,
                    );

                    setPageNumber(1);
                  }}
                  placeholder="Search plate, make or model"
                  className="h-11 w-full rounded-xl border border-border-dark bg-background/60 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                />
              </div>

              <select
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target
                      .value as
                      | VehicleStatus
                      | "",
                  );

                  setPageNumber(1);
                }}
                className="h-11 rounded-xl border border-border-dark bg-background/60 px-4 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              >
                <option value="">
                  All statuses
                </option>

                {VEHICLE_STATUS_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                void loadVehicles();
              }}
              disabled={isLoading}
              className="grid h-11 w-full shrink-0 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50 sm:size-11"
              aria-label="Refresh vehicles"
            >
              <RefreshCw
                size={18}
                className={
                  isLoading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-background/60"
                />
              ))}
            </div>
          ) : errorMessage ? (
            <div className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
                  <AlertTriangle
                    size={27}
                  />
                </div>

                <h3 className="mt-4 font-display text-lg font-extrabold text-text-main">
                  Unable to load vehicles
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
                  {errorMessage}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void loadVehicles();
                  }}
                  className="mx-auto mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>
              </div>
            </div>
          ) : result.items.length === 0 ? (
            <div className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <CarFront size={30} />
                </div>

                <h3 className="mt-4 font-display text-xl font-extrabold text-text-main">
                  {search || status
                    ? "No matching vehicles"
                    : "No vehicles registered"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
                  {search || status
                    ? "Try changing the search term or selected status."
                    : "Add your first vehicle to start managing the fleet."}
                </p>

                {!search && !status && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mx-auto mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
                  >
                    <Plus size={15} />
                    Add First Vehicle
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-full overflow-x-auto overscroll-x-contain">
                <table className="w-full min-w-[920px] text-left">
                  <thead>
                    <tr className="border-b border-border-dark text-[10px] uppercase tracking-wider text-text-muted">
                      <th className="px-6 py-4 font-bold">
                        Vehicle
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Plate Number
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Year
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Mileage
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Status
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Added
                      </th>

                      <th className="px-6 py-4 text-right font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.items.map(
                      (vehicle) => (
                        <tr
                          key={vehicle.id}
                          className="border-b border-border-dark/70 transition last:border-0 hover:bg-surface-light/40"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-sm font-bold text-text-main">
                                  {
                                    vehicle.make
                                  }{" "}
                                  {
                                    vehicle.model
                                  }
                                </p>

                                <p className="mt-1 text-[11px] text-text-muted">
                                  Vehicle #
                                  {vehicle.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs font-bold text-primary">
                            {
                              vehicle.plateNumber
                            }
                          </td>

                          <td className="px-4 py-4 text-xs text-text-muted">
                            {vehicle.year}
                          </td>

                          <td className="px-4 py-4 text-xs text-text-main">
                            {vehicle.currentMileage.toLocaleString()}{" "}
                            <span className="text-text-muted">
                              km
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <VehicleStatusBadge
                              status={
                                vehicle.status
                              }
                            />
                          </td>

                          <td className="px-4 py-4 text-xs text-text-muted">
                            {formatDate(
                              vehicle.createdAt,
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    vehicle,
                                  )
                                }
                                className="grid size-9 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                                aria-label={`Edit ${vehicle.plateNumber}`}
                              >
                                <Edit3
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openDeleteModal(
                                    vehicle,
                                  )
                                }
                                className="grid size-9 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
                                aria-label={`Delete ${vehicle.plateNumber}`}
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              <footer className="flex flex-col items-center gap-3 border-t border-border-dark p-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
                <p className="text-xs text-text-muted">
                  Showing{" "}
                  <span className="font-bold text-text-main">
                    {startItem}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-text-main">
                    {endItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-text-main">
                    {result.totalCount}
                  </span>{" "}
                  vehicles
                </p>

                <div className="flex max-w-full items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={
                      pageNumber <= 1
                    }
                    onClick={() =>
                      setPageNumber(
                        (current) =>
                          current - 1,
                      )
                    }
                    className="grid size-7 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Previous page"
                  >
                    <ChevronLeft
                      size={10}
                    />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={Math.max(
                      result.totalPages,
                      1,
                    )}
                    value={pageInput}
                    onChange={(event) =>
                      setPageInput(
                        event.target.value,
                      )
                    }
                    onBlur={goToPage}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        goToPage();
                      }
                    }}
                    className="size-9 appearance-none rounded-xl border border-primary/35 bg-primary/10 text-center text-sm font-extrabold text-text-main outline-none transition hover:border-primary/60 focus:border-primary focus:bg-primary/15 focus:ring-4 focus:ring-primary/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-label="Current page"
                  />

                  <button
                    type="button"
                    disabled={
                      pageNumber >=
                      result.totalPages
                    }
                    onClick={() =>
                      setPageNumber(
                        (current) =>
                          current + 1,
                      )
                    }
                    className="grid size-7 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Next page"
                  >
                    <ChevronRight
                      size={10}
                    />
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>

      <VehicleFormModal
        isOpen={isFormOpen}
        mode={formMode}
        vehicle={selectedVehicle}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedVehicle(null);
        }}
        onSaved={() => {
          void loadVehicles();
        }}
      />

      <DeleteVehicleModal
        isOpen={isDeleteOpen}
        vehicle={selectedVehicle}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedVehicle(null);
        }}
        onDeleted={handleDeleted}
      />
    </>
  );
}