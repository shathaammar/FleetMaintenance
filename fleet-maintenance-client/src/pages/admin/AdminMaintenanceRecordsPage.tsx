import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Gauge,
  RefreshCw,
  Search,
  Wrench,
  Edit3,
  Plus,
  CheckCircle2,
  Ban,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { MaintenanceStatusBadge } from "../../components/dashboard/MaintenanceStatusBadge";
import { MaintenanceRecordFormModal } from "../../components/dashboard/MaintenanceRecordFormModal";
import { maintenanceRecordService } from "../../services/maintenanceRecordService";
import { maintenanceTypeService } from "../../services/maintenanceTypeService";
import { vehicleService } from "../../services/vehicleService";
import { CompleteMaintenanceModal } from "../../components/dashboard/CompleteMaintenanceModal";
import { MaintenanceRecordActionModal } from "../../components/dashboard/MaintenanceRecordActionModal";
import { MaintenanceRecordDetailsModal } from "../../components/dashboard/MaintenanceRecordDetailsModal";

import type {
  MaintenanceRecord,
  MaintenanceRecordFilters,
  MaintenanceStatus,
} from "../../types/maintenanceRecord";

import type { MaintenanceType, } from "../../types/maintenanceType";
import type { Vehicle, } from "../../types/vehicle";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const PAGE_SIZE = 10;

type RecordAction =
  | "cancel"
  | "delete";

const initialFilters: MaintenanceRecordFilters = {
  search: "",
  vehicleId: null,
  maintenanceTypeId: null,
  status: "",
  fromDate: "",
  toDate: "",
  pageNumber: 1,
  pageSize: PAGE_SIZE,
};

const dateFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const currencyFormatter =
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return dateFormatter.format(date);
}

function formatCurrency(
  value: number | null,
) {
  if (value === null) {
    return "—";
  }

  return currencyFormatter.format(value);
}

export function AdminMaintenanceRecordsPage() {
  const [
    records,
    setRecords,
  ] = useState<MaintenanceRecord[]>([]);

  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);

  const [
    maintenanceTypes,
    setMaintenanceTypes,
  ] = useState<MaintenanceType[]>([]);

  const [
    filters,
    setFilters,
  ] = useState<MaintenanceRecordFilters>(
    initialFilters,
  );

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [pageInput, setPageInput] =
    useState("1");

  const [
    totalCount,
    setTotalCount,
  ] = useState(0);

  const [
    totalPages,
    setTotalPages,
  ] = useState(0);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isOptionsLoading,
    setIsOptionsLoading,
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
    isCompleteOpen,
    setIsCompleteOpen,
  ] = useState(false);

  const [
    isActionOpen,
    setIsActionOpen,
  ] = useState(false);

  const [
    isDetailsOpen,
    setIsDetailsOpen,
  ] = useState(false);

  const [
    openActionsId,
    setOpenActionsId,
  ] = useState<number | null>(null);

  const [
    recordAction,
    setRecordAction,
  ] = useState<RecordAction>(
    "cancel",
  );

const [
  formMode,
  setFormMode,
] = useState<"create" | "edit">(
  "create",
);

const [
  selectedRecord,
  setSelectedRecord,
] = useState<MaintenanceRecord | null>(
  null,
);

  const loadFilterOptions =
    useCallback(async () => {
      try {
        setIsOptionsLoading(true);

        const [
          vehiclesResult,
          typesResult,
        ] = await Promise.all([
          vehicleService.getVehicles({
            search: "",
            status: undefined,
            pageNumber: 1,
            pageSize: 100,
          }),

          maintenanceTypeService.getAll(),
        ]);

        setVehicles(vehiclesResult.items);
        setMaintenanceTypes(typesResult);
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsOptionsLoading(false);
      }
    }, []);

  const loadRecords =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result =
          await maintenanceRecordService
            .getRecords(filters);

        setRecords(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      } catch (error) {
        setRecords([]);
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    }, [filters]);

  useEffect(() => {
    void loadFilterOptions();
  }, [loadFilterOptions]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    setPageInput(String(filters.pageNumber));
  }, [filters.pageNumber]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        setFilters((current) => ({
          ...current,
          search: searchInput.trim(),
          pageNumber: 1,
        }));
      },
      400,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const updateFilter = <
    Key extends keyof MaintenanceRecordFilters,
  >(
    key: Key,
    value: MaintenanceRecordFilters[Key],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      pageNumber: 1,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters(initialFilters);
  };

  const selectedVehicle =
    selectedRecord
      ? vehicles.find(
          (vehicle) =>
            vehicle.id ===
            selectedRecord.vehicleId,
        ) ?? null
      : null;

  const openCreateModal = () => {
  setSelectedRecord(null);
  setFormMode("create");
  setIsFormOpen(true);
};

const openEditModal = (
  record: MaintenanceRecord,
) => {
  if (record.status !== "Scheduled") {
    return;
  }

  setSelectedRecord(record);
  setFormMode("edit");
  setIsFormOpen(true);
};

const openCompleteModal = (
  record: MaintenanceRecord,
) => {
  if (record.status !== "Scheduled") {
    return;
  }

  setSelectedRecord(record);
  setIsCompleteOpen(true);
};

const closeCompleteModal = () => {
  setIsCompleteOpen(false);
  setSelectedRecord(null);
};

const handleRecordCompleted = () => {
  void loadRecords();
  void loadFilterOptions();
};

const openActionModal = (
  record: MaintenanceRecord,
  action: RecordAction,
) => {
  setSelectedRecord(record);
  setRecordAction(action);
  setIsActionOpen(true);
};

const openDetailsModal = (
  record: MaintenanceRecord,
) => {
  setOpenActionsId(null);
  setSelectedRecord(record);
  setIsDetailsOpen(true);
};

const closeDetailsModal = () => {
  setIsDetailsOpen(false);
  setSelectedRecord(null);
};

const closeActionModal = () => {
  setIsActionOpen(false);
  setSelectedRecord(null);
};

const handleActionSuccess = () => {
  const deletedLastItemOnPage =
    recordAction === "delete" &&
    records.length === 1 &&
    filters.pageNumber > 1;

  if (deletedLastItemOnPage) {
    setFilters((current) => ({
      ...current,
      pageNumber:
        current.pageNumber - 1,
    }));

    return;
  }

  void loadRecords();
};

const closeFormModal = () => {
  setIsFormOpen(false);
  setSelectedRecord(null);
};

const handleRecordSaved = () => {
  void loadRecords();
};

  const goToPage = () => {
    const requestedPage = Number(pageInput);
    const lastPage = Math.max(totalPages, 1);
    const nextPage =
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= lastPage
        ? requestedPage
        : 1;

    setFilters((current) => ({
      ...current,
      pageNumber: nextPage,
    }));
    setPageInput(String(nextPage));
  };

  const hasActiveFilters =
    Boolean(searchInput) ||
    filters.vehicleId !== null ||
    filters.maintenanceTypeId !== null ||
    Boolean(filters.status) ||
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate);

  const firstVisibleRecord =
    totalCount === 0
      ? 0
      : (filters.pageNumber - 1) *
          filters.pageSize +
        1;

  const lastVisibleRecord = Math.min(
    filters.pageNumber *
      filters.pageSize,
    totalCount,
  );

  return (
  <>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Service Operations
            </p>

            <h2 className="font-display text-2xl font-extrabold text-text-main">
              Maintenance Records
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Schedule, track, and manage
              maintenance activity across
              the entire fleet.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
  <button
    type="button"
    onClick={openCreateModal}
    disabled={
      isOptionsLoading ||
      vehicles.length === 0 ||
      maintenanceTypes.length === 0
    }
    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_10px_30px_rgba(245,166,35,0.18)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Plus size={18} />
    Schedule Maintenance
  </button>
</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
        <div className="border-b border-border-dark p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                type="search"
                maxLength={100}
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search plate or service..."
                className="h-11 w-full rounded-xl border border-border-dark bg-background/60 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              />
            </div>

            <select
              value={
                filters.vehicleId ?? ""
              }
              onChange={(event) =>
                updateFilter(
                  "vehicleId",
                  event.target.value
                    ? Number(
                        event.target.value,
                      )
                    : null,
                )
              }
              disabled={isOptionsLoading}
              className="h-11 min-w-0 rounded-xl border border-border-dark bg-background/60 px-3 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5 disabled:opacity-50"
            >
              <option value="">
                All vehicles
              </option>

              {vehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                >
                  {vehicle.plateNumber} —{" "}
                  {vehicle.make}{" "}
                  {vehicle.model}
                </option>
              ))}
            </select>

            <select
              value={
                filters.maintenanceTypeId ??
                ""
              }
              onChange={(event) =>
                updateFilter(
                  "maintenanceTypeId",
                  event.target.value
                    ? Number(
                        event.target.value,
                      )
                    : null,
                )
              }
              disabled={isOptionsLoading}
              className="h-11 min-w-0 rounded-xl border border-border-dark bg-background/60 px-3 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5 disabled:opacity-50"
            >
              <option value="">
                All service types
              </option>

              {maintenanceTypes.map(
                (type) => (
                  <option
                    key={type.id}
                    value={type.id}
                  >
                    {type.name}
                  </option>
                ),
              )}
            </select>

            <select
              value={filters.status}
              onChange={(event) =>
                updateFilter(
                  "status",
                  event.target.value as
                    | MaintenanceStatus
                    | "",
                )
              }
              className="h-11 min-w-0 rounded-xl border border-border-dark bg-background/60 px-3 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
            >
              <option value="">
                All statuses
              </option>

              <option value="Scheduled">
                Scheduled
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                void loadRecords();
              }}
              disabled={isLoading}
              className="grid size-11 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
              aria-label="Refresh records"
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

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                From date
              </span>

              <input
                type="date"
                value={filters.fromDate}
                onChange={(event) =>
                  updateFilter(
                    "fromDate",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-border-dark bg-background/60 px-3 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                To date
              </span>

              <input
                type="date"
                min={
                  filters.fromDate ||
                  undefined
                }
                value={filters.toDate}
                onChange={(event) =>
                  updateFilter(
                    "toDate",
                    event.target.value,
                  )
                }
                className="h-11 w-full rounded-xl border border-border-dark bg-background/60 px-3 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              />
            </label>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-border-dark px-3 text-xs font-bold text-text-muted transition hover:border-primary/30 hover:text-primary"
            >
              <FilterX size={15} />
              Clear all filters
            </button>
          )}
        </div>

        {isLoading ? (
          <RecordsLoadingState />
        ) : errorMessage ? (
          <RecordsErrorState
            message={errorMessage}
            onRetry={() => {
              void loadRecords();
            }}
          />
        ) : records.length === 0 ? (
          <RecordsEmptyState
            hasFilters={
              hasActiveFilters
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1220px] text-left">
                <thead>
                  <tr className="border-b border-border-dark bg-background/25">
                    {[
                      "Vehicle",
                      "Service",
                      "Scheduled",
                      "Due mileage",
                      "Status",
                      "Completed",
                      "Cost",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-text-muted"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {records.map((record, index) => (
                    <tr
                      key={record.id}
                      className="border-b border-border-dark/70 transition last:border-b-0 hover:bg-background/25"
                    >
                      <td className="px-5 py-4">
                        <p className="font-display text-sm font-extrabold text-text-main">
                          {
                            record.vehiclePlateNumber
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-text-muted">
                          Vehicle #
                          {record.vehicleId}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-44 truncate text-sm font-bold text-text-main">
                          {
                            record.maintenanceTypeName
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-text-muted">
                          Record #{record.id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {formatDate(
                          record.scheduledDate,
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {record.dueMileage !==
                        null
                          ? `${record.dueMileage.toLocaleString()} km`
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <MaintenanceStatusBadge
                          status={record.status}
                          isOverdue={
                            record.isOverdue
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-xs text-text-muted">
                        {formatDate(
                          record.completedDate,
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs font-bold text-text-main">
                        {formatCurrency(
                          record.cost,
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openDetailsModal(record)
                            }
                            className="grid size-9 shrink-0 place-items-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400 transition hover:bg-sky-500 hover:text-slate-950"
                            aria-label={`View details for maintenance record ${record.id}`}
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>

                          {record.status === "Scheduled" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  openCompleteModal(record)
                                }
                                className="grid size-9 shrink-0 place-items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
                                aria-label={`Complete maintenance record ${record.id}`}
                                title="Complete maintenance"
                              >
                                <CheckCircle2 size={15} />
                              </button>

                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenActionsId(
                                      (current) =>
                                        current === record.id
                                          ? null
                                          : record.id,
                                    )
                                  }
                                  className="grid size-9 shrink-0 place-items-center rounded-xl border border-border-dark bg-background/40 text-text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                                  aria-label={`More actions for maintenance record ${record.id}`}
                                  aria-expanded={
                                    openActionsId === record.id
                                  }
                                  title="More actions"
                                >
                                  <MoreVertical size={16} />
                                </button>

                                {openActionsId === record.id && (
                                  <>
                                    <button
                                      type="button"
                                      className="fixed inset-0 z-20 cursor-default"
                                      onClick={() =>
                                        setOpenActionsId(null)
                                      }
                                      aria-label="Close actions menu"
                                    />

                                    <div
                                      className={`absolute right-0 z-30 w-48 overflow-hidden rounded-xl border border-border-dark bg-surface p-1.5 shadow-2xl ${
                                        index < 2
                                          ? "top-full mt-2"
                                          : "bottom-full mb-2"
                                      }`}
                                    >
                                      <RecordActionsMenu
                                        onEdit={() => {
                                          setOpenActionsId(null);
                                          openEditModal(record);
                                        }}
                                        onCancel={() => {
                                          setOpenActionsId(null);
                                          openActionModal(
                                            record,
                                            "cancel",
                                          );
                                        }}
                                        onDelete={() => {
                                          setOpenActionsId(null);
                                          openActionModal(
                                            record,
                                            "delete",
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {records.map((record) => (
                <article
                  key={record.id}
                  className="rounded-2xl border border-border-dark bg-background/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base font-extrabold text-text-main">
                        {
                          record.vehiclePlateNumber
                        }
                      </p>

                      <p className="mt-1 text-xs font-bold text-primary">
                        {
                          record.maintenanceTypeName
                        }
                      </p>
                    </div>

                    <MaintenanceStatusBadge
                      status={record.status}
                      isOverdue={
                        record.isOverdue
                      }
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-dark pt-4">
                    <RecordDetail
                      icon={CalendarDays}
                      label="Scheduled"
                      value={formatDate(
                        record.scheduledDate,
                      )}
                    />

                    <RecordDetail
                      icon={Gauge}
                      label="Due mileage"
                      value={
                        record.dueMileage !==
                        null
                          ? `${record.dueMileage.toLocaleString()} km`
                          : "Not specified"
                      }
                    />

                    <RecordDetail
                      icon={CalendarDays}
                      label="Completed"
                      value={formatDate(
                        record.completedDate,
                      )}
                    />

                    <RecordDetail
                      icon={Wrench}
                      label="Cost"
                      value={formatCurrency(
                        record.cost,
                      )}
                    />
                  </div>

                  {record.notes && (
                    <p className="mt-4 border-t border-border-dark pt-3 text-xs leading-5 text-text-muted">
                      {record.notes}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2 border-t border-border-dark pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        openDetailsModal(record)
                      }
                      className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 text-xs font-extrabold text-sky-400 transition hover:bg-sky-500 hover:text-slate-950"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {record.status === "Scheduled" && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            openCompleteModal(record)
                          }
                          className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-extrabold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
                        >
                          <CheckCircle2 size={16} />
                          Complete
                        </button>

                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenActionsId(
                                (current) =>
                                  current === record.id
                                    ? null
                                    : record.id,
                              )
                            }
                            className="grid size-11 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                            aria-label={`More actions for maintenance record ${record.id}`}
                            aria-expanded={
                              openActionsId === record.id
                            }
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openActionsId === record.id && (
                            <>
                              <button
                                type="button"
                                className="fixed inset-0 z-20 cursor-default"
                                onClick={() =>
                                  setOpenActionsId(null)
                                }
                                aria-label="Close actions menu"
                              />

                              <div className="absolute bottom-full right-0 z-30 mb-2 w-48 overflow-hidden rounded-xl border border-border-dark bg-surface p-1.5 shadow-2xl">
                                <RecordActionsMenu
                                  onEdit={() => {
                                    setOpenActionsId(null);
                                    openEditModal(record);
                                  }}
                                  onCancel={() => {
                                    setOpenActionsId(null);
                                    openActionModal(
                                      record,
                                      "cancel",
                                    );
                                  }}
                                  onDelete={() => {
                                    setOpenActionsId(null);
                                    openActionModal(
                                      record,
                                      "delete",
                                    );
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-border-dark p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-center text-xs text-text-muted sm:text-left">
                Showing{" "}
                <span className="font-bold text-text-main">
                  {firstVisibleRecord}
                </span>
                {" – "}
                <span className="font-bold text-text-main">
                  {lastVisibleRecord}
                </span>{" "}
                of{" "}
                <span className="font-bold text-text-main">
                  {totalCount}
                </span>{" "}
                records
              </p>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={
                    filters.pageNumber <= 1
                  }
                  onClick={() =>
                    setFilters(
                      (current) => ({
                        ...current,
                        pageNumber:
                          current.pageNumber -
                          1,
                      }),
                    )
                  }
                  className="grid size-8 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Previous page"
                >
                  <ChevronLeft
                    size={10}
                  />
                </button>

                <input
                  type="number"
                  min={1}
                  max={Math.max(totalPages, 1)}
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
                  className="size-10 appearance-none rounded-xl border border-primary/35 bg-primary/10 text-center text-sm font-extrabold text-text-main outline-none transition hover:border-primary/60 focus:border-primary focus:bg-primary/15 focus:ring-4 focus:ring-primary/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Current page"
                />

                <button
                  type="button"
                  disabled={
                    totalPages === 0 ||
                    filters.pageNumber >=
                      totalPages
                  }
                  onClick={() =>
                    setFilters(
                      (current) => ({
                        ...current,
                        pageNumber:
                          current.pageNumber +
                          1,
                      }),
                    )
                  }
                  className="grid size-8 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Next page"
                >
                  <ChevronRight
                    size={10}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>

    <MaintenanceRecordFormModal
      isOpen={isFormOpen}
      mode={formMode}
      record={selectedRecord}
      vehicles={vehicles}
      maintenanceTypes={
        maintenanceTypes
      }
      onClose={closeFormModal}
      onSaved={handleRecordSaved}
    />

    <CompleteMaintenanceModal
        isOpen={isCompleteOpen}
        record={selectedRecord}
        vehicle={selectedVehicle}
        onClose={closeCompleteModal}
        onCompleted={
            handleRecordCompleted
        }
        />

        <MaintenanceRecordActionModal
  isOpen={isActionOpen}
  action={recordAction}
  record={selectedRecord}
  onClose={closeActionModal}
  onSuccess={handleActionSuccess}
/>

    <MaintenanceRecordDetailsModal
      isOpen={isDetailsOpen}
      record={selectedRecord}
      onClose={closeDetailsModal}
    />
  </>
  
  );
}

interface RecordActionsMenuProps {
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

function RecordActionsMenu({
  onEdit,
  onCancel,
  onDelete,
}: RecordActionsMenuProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-text-muted transition hover:bg-primary/10 hover:text-primary"
      >
        <Edit3 size={15} />
        Edit record
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-text-muted transition hover:bg-danger/10 hover:text-danger"
      >
        <Ban size={15} />
        Cancel maintenance
      </button>

      <div className="my-1 border-t border-border-dark" />

      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-danger transition hover:bg-danger/10"
      >
        <Trash2 size={15} />
        Delete record
      </button>
    </div>
  );
}

interface RecordDetailProps {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}

function RecordDetail({
  icon: Icon,
  label,
  value,
}: RecordDetailProps) {
  return (
    <div className="flex gap-2">
      <Icon
        size={15}
        className="mt-0.5 shrink-0 text-primary"
      />

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-bold text-text-main">
          {value}
        </p>
      </div>
    </div>
  );
}

function RecordsLoadingState() {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-xl bg-background/55"
        />
      ))}
    </div>
  );
}

interface RecordsErrorStateProps {
  message: string;
  onRetry: () => void;
}

function RecordsErrorState({
  message,
  onRetry,
}: RecordsErrorStateProps) {
  return (
    <div className="grid min-h-80 place-items-center p-6 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
          <AlertTriangle size={27} />
        </div>

        <h3 className="mt-4 font-display text-lg font-extrabold text-text-main">
          Unable to load records
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </div>
  );
}

interface RecordsEmptyStateProps {
  hasFilters: boolean;
}

function RecordsEmptyState({
  hasFilters,
}: RecordsEmptyStateProps) {
  return (
    <div className="grid min-h-80 place-items-center p-6 text-center">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Wrench size={30} />
        </div>

        <h3 className="mt-4 font-display text-xl font-extrabold text-text-main">
          {hasFilters
            ? "No matching records"
            : "No maintenance records"}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
          {hasFilters
            ? "Try changing or clearing the selected filters."
            : "Scheduled maintenance records will appear here."}
        </p>
      </div>
    </div>
  );
}