import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Mail,
  RefreshCw,
  Search,
  UserRound,
  Wrench,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { MaintenanceRequestStatusBadge } from "../../components/dashboard/MaintenanceRequestStatusBadge";

import { maintenanceRequestService } from "../../services/maintenanceRequestService";

import type {
  MaintenanceRequest,
  MaintenanceRequestFilters,
  MaintenanceRequestStatus,
} from "../../types/maintenanceRequest";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { MaintenanceRequestDetailsModal } from "../../components/dashboard/MaintenanceRequestDetailsModal";
import { ApproveMaintenanceRequestModal } from "../../components/dashboard/ApproveMaintenanceRequestModal";
import { RejectMaintenanceRequestModal } from "../../components/dashboard/RejectMaintenanceRequestModal";

const PAGE_SIZE = 10;

const initialFilters:
  MaintenanceRequestFilters = {
    search: "",
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

const dateTimeFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return dateFormatter.format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateTimeFormatter.format(date);
}

export function AdminMaintenanceRequestsPage() {
  const [
    requests,
    setRequests,
  ] = useState<MaintenanceRequest[]>([]);

  const [
    filters,
    setFilters,
  ] = useState<MaintenanceRequestFilters>(
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
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
  selectedRequest,
  setSelectedRequest,
] = useState<MaintenanceRequest | null>(
  null,
);

const [
  isDetailsOpen,
  setIsDetailsOpen,
] = useState(false);

const [
  isApproveOpen,
  setIsApproveOpen,
] = useState(false);

const [
  isRejectOpen,
  setIsRejectOpen,
] = useState(false);

  const loadRequests =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result =
          await maintenanceRequestService
            .getAll(filters);

        setRequests(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      } catch (error) {
        setRequests([]);
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    }, [filters]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

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
    Key extends keyof MaintenanceRequestFilters,
  >(
    key: Key,
    value: MaintenanceRequestFilters[Key],
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

  const openDetailsModal = (
  request: MaintenanceRequest,
) => {
  setSelectedRequest(request);
  setIsDetailsOpen(true);
};

const closeDetailsModal = () => {
  setIsDetailsOpen(false);
  setSelectedRequest(null);
};

const openApproveModal = (
  request: MaintenanceRequest,
) => {
  if (request.status !== "Pending") {
    return;
  }

  setSelectedRequest(request);
  setIsApproveOpen(true);
};

const closeApproveModal = () => {
  setIsApproveOpen(false);
  setSelectedRequest(null);
};

const handleRequestApproved = () => {
  void loadRequests();
};

const openRejectModal = (
  request: MaintenanceRequest,
) => {
  if (request.status !== "Pending") {
    return;
  }

  setSelectedRequest(request);
  setIsRejectOpen(true);
};

const closeRejectModal = () => {
  setIsRejectOpen(false);
  setSelectedRequest(null);
};

const handleRequestRejected = () => {
  void loadRequests();
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
    Boolean(filters.status) ||
    Boolean(filters.fromDate) ||
    Boolean(filters.toDate);

  const firstVisibleRequest =
    totalCount === 0
      ? 0
      : (filters.pageNumber - 1) *
          filters.pageSize +
        1;

  const lastVisibleRequest = Math.min(
    filters.pageNumber *
      filters.pageSize,
    totalCount,
  );

  return (
  <>
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Request Operations
            </p>

            <h2 className="font-display text-2xl font-extrabold text-text-main">
              Maintenance Requests
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Review incoming requests,
              approve necessary services,
              and keep the fleet moving.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
        <div className="border-b border-border-dark p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
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
                placeholder="Search by name, email, vehicle or service"
                className="h-11 w-full rounded-xl border border-border-dark bg-background/60 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              />
            </div>

            <select
              value={filters.status}
              onChange={(event) =>
                updateFilter(
                  "status",
                  event.target.value as
                    | MaintenanceRequestStatus
                    | "",
                )
              }
              className="h-11 min-w-0 rounded-xl border border-border-dark bg-background/60 px-3 text-sm text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
            >
              <option value="">
                All statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Rejected">
                Rejected
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>

            <button
              type="button"
              onClick={() => {
                void loadRequests();
              }}
              disabled={isLoading}
              className="grid size-11 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
              aria-label="Refresh requests"
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
                Requested from
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
                Requested to
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

          {hasActiveFilters && requests.length > 0 && (
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
          <RequestsLoadingState />
        ) : errorMessage ? (
          <RequestsErrorState
            message={errorMessage}
            onRetry={() => {
              void loadRequests();
            }}
          />
        ) : requests.length === 0 ? (
          <RequestsEmptyState
            hasFilters={
              hasActiveFilters
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1360px] text-left">
                <thead>
                  <tr className="border-b border-border-dark bg-background/25">
                    {[
                      "Requester",
                      "Vehicle",
                      "Service",
                      "Preferred",
                      "Requested",
                      "Status",
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
                  {requests.map(
                    (request) => (
                      <tr
                        key={request.id}
                        className={`border-b border-border-dark/70 transition last:border-b-0 hover:bg-background/25 ${
                          request.status ===
                          "Pending"
                            ? "bg-primary/[0.025]"
                            : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                              <UserRound
                                size={16}
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-44 truncate text-sm font-extrabold text-text-main">
                                {
                                  request.requestedByFullName
                                }
                              </p>

                              <p className="mt-1 max-w-44 truncate text-[10px] text-text-muted">
                                {
                                  request.requestedByEmail
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-extrabold text-text-main">
                            {
                              request.vehiclePlateNumber
                            }
                          </p>

                          <p className="mt-1 text-[10px] text-text-muted">
                            Vehicle #
                            {request.vehicleId}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-44 truncate text-sm font-bold text-text-main">
                            {
                              request.maintenanceTypeName
                            }
                          </p>

                          <p className="mt-1 text-[10px] text-text-muted">
                            Request #
                            {request.id}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-xs text-text-muted">
                          {formatDate(
                            request.preferredDate,
                          )}
                        </td>

                        <td className="px-5 py-4 text-xs text-text-muted">
                          {formatDateTime(
                            request.requestedAt,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <MaintenanceRequestStatusBadge
                            status={
                              request.status
                            }
                          />
                        </td>
                        <td className="px-5 py-4">
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() =>
        openDetailsModal(request)
      }
      className="inline-flex h-9 items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 text-xs font-extrabold text-blue-400 transition hover:bg-blue-500 hover:text-white"
      aria-label={`View maintenance request ${request.id}`}
    >
      <Eye size={15} />
      View
    </button>

    {request.status === "Pending" && (
  <>
    <button
      type="button"
      onClick={() =>
        openApproveModal(request)
      }
      className="inline-flex h-9 items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-extrabold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
      aria-label={`Approve maintenance request ${request.id}`}
    >
      <CheckCircle2 size={15} />
      Approve
    </button>

    <button
      type="button"
      onClick={() =>
        openRejectModal(request)
      }
      className="inline-flex h-9 items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-3 text-xs font-extrabold text-danger transition hover:bg-danger hover:text-white"
      aria-label={`Reject maintenance request ${request.id}`}
    >
      <XCircle size={15} />
      Reject
    </button>
  </>
)}
  </div>
</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {requests.map(
                (request) => (
                  <article
                    key={request.id}
                    className={`rounded-2xl border p-4 ${
                      request.status ===
                      "Pending"
                        ? "border-primary/25 bg-primary/[0.035]"
                        : "border-border-dark bg-background/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-base font-extrabold text-text-main">
                          {
                            request.vehiclePlateNumber
                          }
                        </p>

                        <p className="mt-1 truncate text-xs font-bold text-primary">
                          {
                            request.maintenanceTypeName
                          }
                        </p>
                      </div>

                      <MaintenanceRequestStatusBadge
                        status={request.status}
                      />
                    </div>

                    <div className="mt-4 rounded-xl border border-border-dark bg-background/40 p-3">
                      <div className="flex items-center gap-2">
                        <UserRound
                          size={15}
                          className="shrink-0 text-blue-400"
                        />

                        <p className="truncate text-xs font-extrabold text-text-main">
                          {
                            request.requestedByFullName
                          }
                        </p>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <Mail
                          size={14}
                          className="shrink-0 text-text-muted"
                        />

                        <p className="truncate text-[11px] text-text-muted">
                          {
                            request.requestedByEmail
                          }
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 text-xs leading-5 text-text-muted">
                      {request.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border-dark pt-4">
                      <RequestDetail
                        label="Preferred"
                        value={formatDate(
                          request.preferredDate,
                        )}
                      />

                      <RequestDetail
                        label="Requested"
                        value={formatDate(
                          request.requestedAt,
                        )}
                      />
                    </div>

                    {request.maintenanceRecordId && (
                      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                        Maintenance Record #
                        {
                          request.maintenanceRecordId
                        }
                      </div>
                    )}

                    {request.rejectionReason && (
                      <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2 text-xs leading-5 text-danger">
                        {
                          request.rejectionReason
                        }
                      </div>
                    )}
                    <button
                        type="button"
                        onClick={() =>
                            openDetailsModal(request)
                        }
                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 text-xs font-extrabold text-blue-400 transition hover:bg-blue-500 hover:text-white"
                        >
                        <Eye size={15} />
                        View Full Details
                    </button>

                    {request.status === "Pending" && (
  <div className="mt-2 grid grid-cols-2 gap-2">
    <button
      type="button"
      onClick={() =>
        openApproveModal(request)
      }
      className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-2 text-xs font-extrabold text-emerald-400 transition hover:bg-emerald-500 hover:text-slate-950"
    >
      <CheckCircle2 size={15} />
      Approve
    </button>

    <button
      type="button"
      onClick={() =>
        openRejectModal(request)
      }
      className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-2 text-xs font-extrabold text-danger transition hover:bg-danger hover:text-white"
    >
      <XCircle size={15} />
      Reject
    </button>
  </div>
)}
                  </article>
                ),
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-border-dark p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-center text-xs text-text-muted sm:text-left">
                Showing{" "}
                <span className="font-bold text-text-main">
                  {firstVisibleRequest}
                </span>
                {" – "}
                <span className="font-bold text-text-main">
                  {lastVisibleRequest}
                </span>{" "}
                of{" "}
                <span className="font-bold text-text-main">
                  {totalCount}
                </span>{" "}
                requests
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
                    setPageInput(event.target.value)
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

    <MaintenanceRequestDetailsModal
      isOpen={isDetailsOpen}
      request={selectedRequest}
      onClose={closeDetailsModal}
    />

    <ApproveMaintenanceRequestModal
        isOpen={isApproveOpen}
        request={selectedRequest}
        onClose={closeApproveModal}
        onApproved={
            handleRequestApproved
        }
        />

        <RejectMaintenanceRequestModal
            isOpen={isRejectOpen}
            request={selectedRequest}
            onClose={closeRejectModal}
            onRejected={
                handleRequestRejected
            }
            />
  </>
  );
}

interface RequestDetailProps {
  label: string;
  value: string;
}

function RequestDetail({
  label,
  value,
}: RequestDetailProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-text-muted">
        <CalendarDays size={13} />

        <p className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="mt-1 text-xs font-bold text-text-main">
        {value}
      </p>
    </div>
  );
}

function RequestsLoadingState() {
  return (
    <div className="space-y-3 p-4 sm:p-5">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="h-18 animate-pulse rounded-xl bg-background/55"
        />
      ))}
    </div>
  );
}

interface RequestsErrorStateProps {
  message: string;
  onRetry: () => void;
}

function RequestsErrorState({
  message,
  onRetry,
}: RequestsErrorStateProps) {
  return (
    <div className="grid min-h-80 place-items-center p-6 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
          <AlertTriangle size={27} />
        </div>

        <h3 className="mt-4 font-display text-lg font-extrabold text-text-main">
          Unable to load requests
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

interface RequestsEmptyStateProps {
  hasFilters: boolean;
}

function RequestsEmptyState({
  hasFilters,
}: RequestsEmptyStateProps) {
  return (
    <div className="grid min-h-80 place-items-center p-6 text-center">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Wrench size={30} />
        </div>

        <h3 className="mt-4 font-display text-xl font-extrabold text-text-main">
          {hasFilters
            ? "No matching requests"
            : "No maintenance requests"}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
          {hasFilters
            ? "Try changing or clearing the selected filters."
            : "New maintenance requests will appear here for review."}
        </p>

      </div>
    </div>
  );
}