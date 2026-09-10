import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FilterX,
  Plus,
  RefreshCw,
  Search,
  Wrench,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link, } from "react-router-dom";

import { MaintenanceRequestDetailsModal } from "../../components/dashboard/MaintenanceRequestDetailsModal";
import { MaintenanceRequestStatusBadge } from "../../components/dashboard/MaintenanceRequestStatusBadge";
import CancelMaintenanceRequestModal from "../../components/maintenanceRequests/CancelMaintenanceRequestModal";

import { maintenanceRequestService } from "../../services/maintenanceRequestService";

import type {
  MaintenanceRequest,
  MaintenanceRequestFilters,
  MaintenanceRequestStatus,
} from "../../types/maintenanceRequest";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const PAGE_SIZE = 9;

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

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Flexible";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateFormatter.format(date);
}

export function UserMaintenanceRequestsPage() {
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
  requestToCancel,
  setRequestToCancel,
] = useState<MaintenanceRequest | null>(
  null,
);

const [
  isCancelOpen,
  setIsCancelOpen,
] = useState(false);

  const loadRequests =
  useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result =
        await maintenanceRequestService
          .getMyRequests(filters);

      const lastAvailablePage = Math.max(
        result.totalPages,
        1,
      );

      if (
        filters.pageNumber >
        lastAvailablePage
      ) {
        setFilters((current) => ({
          ...current,
          pageNumber: lastAvailablePage,
        }));

        return;
      }

      setRequests(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    } catch (error) {
      setRequests([]);
      setTotalCount(0);
      setTotalPages(0);

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

  const goToPage = () => {
  const requestedPage =
    Number.parseInt(pageInput, 10);

  const lastPage = Math.max(
    totalPages,
    1,
  );

  if (Number.isNaN(requestedPage)) {
    setPageInput(
      String(filters.pageNumber),
    );

    return;
  }

  const nextPage = Math.min(
    Math.max(requestedPage, 1),
    lastPage,
  );

  setFilters((current) => ({
    ...current,
    pageNumber: nextPage,
  }));

  setPageInput(String(nextPage));
};

  const openDetails = (
    request: MaintenanceRequest,
  ) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedRequest(null);
  };

  const openCancelModal = (
  request: MaintenanceRequest,
) => {
  if (request.status !== "Pending") {
    return;
  }

  setRequestToCancel(request);
  setIsCancelOpen(true);
};

const closeCancelModal = () => {
  setIsCancelOpen(false);
  setRequestToCancel(null);
};

const handleRequestCancelled = async () => {
  await loadRequests();
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
          <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                MAINTENANCE OVERVIEW
              </p>

              <h2 className="font-display text-2xl font-extrabold text-text-main">
                My Maintenance Requests
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Follow your submitted
                requests and track each
                decision from the fleet
                team.
              </p>
            </div>

            <Link
              to="/user/maintenance-requests/new"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_10px_30px_rgba(245,166,35,0.18)] transition hover:bg-primary-light"
            >
              <Plus size={18} />
              New Request
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
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
                  placeholder="Search vehicle, service, or description..."
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
            <LoadingState />
          ) : errorMessage ? (
            <ErrorState
              message={errorMessage}
              onRetry={() => {
                void loadRequests();
              }}
            />
          ) : requests.length === 0 ? (
            <EmptyState
              hasFilters={
                hasActiveFilters
              }
            />
          ) : (
            <>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
                {requests.map(
                  (request) => (
                    <article
                      key={request.id}
                      className={`group flex min-h-80 flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 ${
                        request.status ===
                        "Pending"
                          ? "border-primary/25 bg-primary/[0.035]"
                          : "border-border-dark bg-background/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <ClipboardList
                            size={20}
                          />
                        </div>

                        <MaintenanceRequestStatusBadge
                          status={
                            request.status
                          }
                        />
                      </div>

                      <div className="mt-5 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          Request #{request.id}
                        </p>

                        <h3 className="mt-2 font-display text-base font-extrabold text-text-main">
                          {
                            request.maintenanceTypeName
                          }
                        </h3>

                        <p className="mt-1 text-xs font-bold text-primary">
                          {
                            request.vehiclePlateNumber
                          }
                        </p>

                        <p className="mt-4 line-clamp-3 text-xs leading-5 text-text-muted">
                          {
                            request.description
                          }
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border-dark pt-4">
                        <RequestDate
                          label="Preferred"
                          value={formatDate(
                            request.preferredDate,
                          )}
                        />

                        <RequestDate
                          label="Submitted"
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
                        <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-danger">
                            Rejection reason
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-danger/85">
                            {
                              request.rejectionReason
                            }
                          </p>
                        </div>
                      )}

                      <div
  className={`mt-4 grid gap-2 ${
    request.status === "Pending"
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1"
  }`}
>
  <button
    type="button"
    onClick={() =>
      openDetails(request)
    }
    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 text-xs font-extrabold text-blue-400 transition hover:bg-blue-500 hover:text-white"
  >
    View Details
  </button>

  {request.status === "Pending" && (
    <button
      type="button"
      onClick={() =>
        openCancelModal(request)
      }
      className="flex h-10 min-w-0 w-full items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-red-500/20 bg-red-500/10 px-2 text-[11px] font-extrabold text-red-400 transition hover:bg-red-500 hover:text-white sm:px-3 sm:text-xs"
    >
      Cancel Request
    </button>
  )}
</div>
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
        onClose={closeDetails}
      />

      <CancelMaintenanceRequestModal
  isOpen={isCancelOpen}
  request={requestToCancel}
  onClose={closeCancelModal}
  onCancelled={handleRequestCancelled}
/>
    </>
  );
}

interface RequestDateProps {
  label: string;
  value: string;
}

function RequestDate({
  label,
  value,
}: RequestDateProps) {
  return (
    <div>
      <div className="text-text-muted">
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

function LoadingState() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-2xl bg-background/55"
        />
      ))}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
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

interface EmptyStateProps {
  hasFilters: boolean;
}

function EmptyState({
  hasFilters,
}: EmptyStateProps) {
  return (
    <div className="grid min-h-80 place-items-center p-6 text-center">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Wrench size={30} />
        </div>

        <h3 className="mt-4 font-display text-xl font-extrabold text-text-main">
          {hasFilters
            ? "No matching requests"
            : "No requests yet"}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
          {hasFilters
            ? "Try changing or clearing the selected filters."
            : "Submit a maintenance request when a fleet vehicle needs attention."}
        </p>

        {!hasFilters && (
          <Link
            to="/user/maintenance-requests/new"
            className="mx-auto mt-5 flex h-10 w-fit items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
          >
            Create Your First Request
          </Link>
        )}
      </div>
    </div>
  );
}