import {
  LoaderCircle,
  Search,
} from "lucide-react";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { vehicleService } from "../../services/vehicleService";
import type { Vehicle } from "../../types/vehicle";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

interface ActiveVehicleSearchSelectProps {
  value: Vehicle | null;
  onChange: (
    vehicle: Vehicle | null,
  ) => void;
  hasError?: boolean;
  disabled?: boolean;
}

function getVehicleLabel(
  vehicle: Vehicle,
) {
  return `${vehicle.plateNumber} — ${vehicle.make} ${vehicle.model}`;
}

export function ActiveVehicleSearchSelect({
  value,
  onChange,
  hasError = false,
  disabled = false,
}: ActiveVehicleSearchSelectProps) {
  const listboxId = useId();
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [
    searchInput,
    setSearchInput,
  ] = useState(
    value ? getVehicleLabel(value) : "",
  );

  const [
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(
      value ? getVehicleLabel(value) : "",
    );
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isCurrentRequest = true;

    const timeoutId = window.setTimeout(
      async () => {
        try {
          setIsLoading(true);
          setErrorMessage(null);

          const result =
            await vehicleService
              .getAvailableVehicles({
                search:
                  value &&
                  searchInput ===
                    getVehicleLabel(value)
                    ? ""
                    : searchInput.trim(),

                pageNumber: 1,
                pageSize: 20,
              });

          if (isCurrentRequest) {
            setVehicles(result.items);
          }
        } catch (error) {
          if (isCurrentRequest) {
            setVehicles([]);

            setErrorMessage(
              getApiErrorMessage(error),
            );
          }
        } finally {
          if (isCurrentRequest) {
            setIsLoading(false);
          }
        }
      },
      350,
    );

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timeoutId);
    };
  }, [
    isOpen,
    searchInput,
    value,
  ]);

  useEffect(() => {
    const closeDropdown = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeDropdown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeDropdown,
      );
    };
  }, []);

  const handleInputChange = (
    nextValue: string,
  ) => {
    setSearchInput(nextValue);
    setIsOpen(true);

    if (value) {
      onChange(null);
    }
  };

  const selectVehicle = (
    vehicle: Vehicle,
  ) => {
    onChange(vehicle);
    setSearchInput(
      getVehicleLabel(vehicle),
    );
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-text-muted"
      />

      <input
        type="search"
        value={searchInput}
        disabled={disabled}
        placeholder="Search plate, make, or model..."
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        onFocus={() => setIsOpen(true)}
        onChange={(event) =>
          handleInputChange(
            event.target.value,
          )
        }
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className={`h-11 w-full rounded-xl border bg-background/60 pl-10 pr-10 text-sm text-text-main outline-none transition placeholder:text-text-muted/50 disabled:cursor-not-allowed disabled:opacity-50 ${
          hasError
            ? "border-danger/60 focus:ring-4 focus:ring-danger/10"
            : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
        }`}
      />

      {isLoading && (
        <LoaderCircle
          size={17}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-primary"
        />
      )}

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute inset-x-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-border-dark bg-surface p-1.5 shadow-2xl shadow-black/40"
        >
          {isLoading &&
          vehicles.length === 0 ? (
            <div className="flex min-h-20 items-center justify-center gap-2 px-4 text-xs text-text-muted">
              <LoaderCircle
                size={16}
                className="animate-spin text-primary"
              />

              Loading vehicles...
            </div>
          ) : errorMessage ? (
            <div className="px-4 py-4 text-xs leading-5 text-danger">
              {errorMessage}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <p className="text-xs font-bold text-text-main">
                No active vehicles found
              </p>

              <p className="mt-1 text-[11px] leading-5 text-text-muted">
                Try another plate number,
                make, or model.
              </p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                role="option"
                aria-selected={
                  value?.id === vehicle.id
                }
                onClick={() =>
                  selectVehicle(vehicle)
                }
                className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-3 text-left transition ${
                  value?.id === vehicle.id
                    ? "bg-primary/15"
                    : "hover:bg-background/60"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-text-main">
                    {vehicle.plateNumber}
                  </p>

                  <p className="mt-1 truncate text-xs text-text-muted">
                    {vehicle.make}{" "}
                    {vehicle.model} ·{" "}
                    {vehicle.year}
                  </p>
                </div>

                <span className="shrink-0 text-[11px] font-bold text-primary">
                  {vehicle.currentMileage.toLocaleString()}{" "}
                  km
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}