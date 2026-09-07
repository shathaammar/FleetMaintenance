import { motion } from "framer-motion";

import {
  AlertTriangle,
  ArrowRight,
  CarFront,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Gauge,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import { vehicleService } from "../../services/vehicleService";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import type {
  Vehicle,
  VehicleFilters,
} from "../../types/vehicle";

const PAGE_SIZE = 9;

const initialFilters: VehicleFilters = {
  search: "",
  status: "Active",
  pageNumber: 1,
  pageSize: PAGE_SIZE,
};

const numberFormatter =
  new Intl.NumberFormat("en-US");

export function UserVehiclesPage() {
  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);

  const [
    filters,
    setFilters,
  ] = useState<VehicleFilters>(
    initialFilters,
  );

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    pageInput,
    setPageInput,
  ] = useState("1");

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

  const loadVehicles =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result =
          await vehicleService
            .getAvailableVehicles(filters);

        setVehicles(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
      } catch (error) {
        setVehicles([]);
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
    void loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    setPageInput(
      String(filters.pageNumber),
    );
  }, [filters.pageNumber]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        setFilters((current) => ({
          ...current,
          search: searchInput.trim(),
          pageNumber: 1,
        }));
      }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const goToPage = () => {
    const requestedPage =
      Number(pageInput);

    const lastPage =
      Math.max(totalPages, 1);

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

  const firstVisibleVehicle =
    totalCount === 0
      ? 0
      : (filters.pageNumber - 1) *
          filters.pageSize +
        1;

  const lastVisibleVehicle =
    Math.min(
      filters.pageNumber *
        filters.pageSize,
      totalCount,
    );

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-7"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 right-1/3 size-40 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              ACTIVE FLEET
            </p>

            <h1 className="mt-2 font-display text-2xl font-black text-text-main sm:text-3xl">
              Find the vehicle that needs
              attention.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-text-muted">
              Browse active fleet vehicles
              and submit a maintenance request
              directly from the selected
              vehicle.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
        <div className="flex items-start gap-3 border-b border-border-dark p-4 sm:p-5">
          <div className="relative flex-1">
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
                placeholder="Search by plate number, make, or model"
                className="h-11 w-full rounded-xl border border-border-dark bg-background/60 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              />
            </div>

            {searchInput.trim() && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-border-dark px-3 text-xs font-bold text-text-muted transition hover:border-primary/30 hover:text-primary"
              >
                <FilterX size={15} />
                Clear all filters
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              void loadVehicles();
            }}
            disabled={isLoading}
            aria-label="Refresh vehicles"
            className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
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
          <LoadingState />
        ) : errorMessage ? (
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              void loadVehicles();
            }}
          />
        ) : vehicles.length === 0 ? (
          <EmptyState
            hasSearch={Boolean(
              searchInput.trim(),
            )}
          />
        ) : (
          <>
            <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
              {vehicles.map(
                (vehicle, index) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={index}
                  />
                ),
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-border-dark p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <p className="text-center text-xs text-text-muted sm:text-left">
                Showing{" "}
                <span className="font-bold text-text-main">
                  {firstVisibleVehicle}
                </span>
                {" – "}
                <span className="font-bold text-text-main">
                  {lastVisibleVehicle}
                </span>{" "}
                of{" "}
                <span className="font-bold text-text-main">
                  {totalCount}
                </span>{" "}
                vehicles
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
                  aria-label="Previous page"
                  className="grid size-9 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronLeft size={16} />
                </button>

                <input
                  type="number"
                  min={1}
                  max={Math.max(
                    totalPages,
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
                    if (
                      event.key === "Enter"
                    ) {
                      goToPage();
                    }
                  }}
                  aria-label="Current page"
                  className="size-10 appearance-none rounded-xl border border-primary/35 bg-primary/10 text-center text-sm font-extrabold text-text-main outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                  aria-label="Next page"
                  className="grid size-9 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

interface VehicleCardProps {
  vehicle: Vehicle;
  index: number;
}

function VehicleCard({
  vehicle,
  index,
}: VehicleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.3),
      }}
      className="group relative flex min-h-80 flex-col overflow-hidden rounded-2xl border border-border-dark bg-background/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-black/15"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="grid size-12 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <CarFront size={23} />
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Active
        </div>
      </div>

      <div className="relative mt-6 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Vehicle #{vehicle.id}
        </p>

        <h2 className="mt-2 font-display text-xl font-black text-text-main">
          {vehicle.make} {vehicle.model}
        </h2>

        <p className="mt-2 inline-flex rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-black tracking-wider text-primary">
          {vehicle.plateNumber}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <VehicleDetail
            label="Model year"
            value={String(vehicle.year)}
            icon={<CalendarDays size={15} />}
          />

          <VehicleDetail
            label="Mileage"
            value={`${numberFormatter.format(
              vehicle.currentMileage,
            )} km`}
            icon={<Gauge size={15} />}
          />
        </div>
      </div>

      <Link
        to={`/user/maintenance-requests/new?vehicleId=${vehicle.id}`}
        className="relative mt-6 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-extrabold text-background shadow-[0_10px_25px_rgba(245,166,35,0.14)] transition hover:bg-primary-light"
      >
        Request Maintenance
        <ArrowRight size={17} />
      </Link>
    </motion.article>
  );
}

interface VehicleDetailProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function VehicleDetail({
  label,
  value,
  icon,
}: VehicleDetailProps) {
  return (
    <div className="rounded-xl border border-border-dark bg-surface/50 p-3">
      <div className="flex items-center gap-1.5 text-text-muted">
        {icon}

        <p className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="mt-2 truncate text-xs font-extrabold text-text-main">
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-5">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl bg-background/55"
          />
        ),
      )}
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
    <div className="flex min-h-80 flex-col items-center justify-center p-6 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-red-500/10 text-red-400">
        <AlertTriangle size={26} />
      </div>

      <h2 className="mt-4 font-display text-lg font-black text-text-main">
        Unable to load vehicles
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-extrabold text-background"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}

interface EmptyStateProps {
  hasSearch: boolean;
}

function EmptyState({
  hasSearch,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center p-6 text-center">
      <div className="grid size-16 place-items-center rounded-3xl bg-primary/10 text-primary">
        <CarFront size={29} />
      </div>

      <h2 className="mt-4 font-display text-xl font-black text-text-main">
        {hasSearch
          ? "No matching vehicles"
          : "No active vehicles available"}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
        {hasSearch
          ? "Try searching with another plate number, make, or model."
          : "There are currently no active fleet vehicles available for maintenance requests."}
      </p>

    </div>
  );
}