import {
  CalendarCheck2,
  CheckCircle2,
  Gauge,
  LoaderCircle,
  Wrench,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
  ReactNode,
} from "react";

import toast from "react-hot-toast";

import { maintenanceRequestService } from "../../services/maintenanceRequestService";
import { vehicleService } from "../../services/vehicleService";

import type {
  MaintenanceRequest,
} from "../../types/maintenanceRequest";

import type {
  Vehicle,
} from "../../types/vehicle";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

interface ApproveMaintenanceRequestModalProps {
  isOpen: boolean;
  request: MaintenanceRequest | null;
  onClose: () => void;
  onApproved: () => void;
}

interface ApprovalFormValues {
  scheduledDate: string;
  dueMileage: string;
  notes: string;
}

interface ApprovalFormErrors {
  scheduledDate?: string;
  dueMileage?: string;
  notes?: string;
}

function getTodayInputValue() {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    now.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateInputValue(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getUTCFullYear();

  const month = String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getUTCDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialScheduledDate(
  preferredDate: string | null,
) {
  const preferred =
    getDateInputValue(preferredDate);

  const today = getTodayInputValue();

  if (preferred && preferred >= today) {
    return preferred;
  }

  return today;
}

function toApiDate(value: string) {
  return `${value}T00:00:00.000Z`;
}

export function ApproveMaintenanceRequestModal({
  isOpen,
  request,
  onClose,
  onApproved,
}: ApproveMaintenanceRequestModalProps) {
  const [
    values,
    setValues,
  ] = useState<ApprovalFormValues>({
    scheduledDate: "",
    dueMileage: "",
    notes: "",
  });

  const [
    errors,
    setErrors,
  ] = useState<ApprovalFormErrors>({});

  const [
    vehicle,
    setVehicle,
  ] = useState<Vehicle | null>(null);

  const [
    isVehicleLoading,
    setIsVehicleLoading,
  ] = useState(false);

  const [
    vehicleError,
    setVehicleError,
  ] = useState<string | null>(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen || !request) {
      return;
    }

    setValues({
      scheduledDate:
        getInitialScheduledDate(
          request.preferredDate,
        ),

      dueMileage: "",

      notes: request.description,
    });

    setErrors({});
    setVehicle(null);
    setVehicleError(null);

    const loadVehicle = async () => {
      try {
        setIsVehicleLoading(true);

        const vehicleResult =
          await vehicleService
            .getVehicleById(
              request.vehicleId,
            );

        setVehicle(vehicleResult);
      } catch (error) {
        setVehicleError(
          getApiErrorMessage(error),
        );
      } finally {
        setIsVehicleLoading(false);
      }
    };

    void loadVehicle();
  }, [
    isOpen,
    request,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      closeOnEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        closeOnEscape,
      );
    };
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ]);

  if (!isOpen || !request) {
    return null;
  }

  const updateValue = (
    field: keyof ApprovalFormValues,
    value: string,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors:
      ApprovalFormErrors = {};

    if (!values.scheduledDate) {
      nextErrors.scheduledDate =
        "Scheduled date is required.";
    } else if (
      values.scheduledDate <
      getTodayInputValue()
    ) {
      nextErrors.scheduledDate =
        "Scheduled date cannot be in the past.";
    }

    if (values.dueMileage) {
      const mileage = Number(
        values.dueMileage,
      );

      if (
        !Number.isInteger(mileage) ||
        mileage <= 0
      ) {
        nextErrors.dueMileage =
          "Due mileage must be a positive whole number.";
      } else if (
        vehicle &&
        mileage <
          vehicle.currentMileage
      ) {
        nextErrors.dueMileage =
          `Due mileage cannot be less than the vehicle's current mileage of ${vehicle.currentMileage.toLocaleString()} km.`;
      }
    }

    if (values.notes.length > 1000) {
      nextErrors.notes =
        "Notes cannot exceed 1000 characters.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await maintenanceRequestService.approve(
        request.id,
        {
          scheduledDate: toApiDate(
            values.scheduledDate,
          ),

          dueMileage:
            values.dueMileage
              ? Number(
                  values.dueMileage,
                )
              : null,

          notes:
            values.notes.trim() ||
            null,
        },
      );

      toast.success(
        "Request approved and maintenance scheduled.",
      );

      onApproved();
      onClose();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
        aria-label="Close approval modal"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-request-title"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Approve Request #
                {request.id}
              </p>

              <h2
                id="approve-request-title"
                className="mt-1 font-display text-xl font-extrabold text-text-main"
              >
                Schedule Maintenance
              </h2>

              <p className="mt-1 truncate text-xs leading-5 text-text-muted">
                {request.vehiclePlateNumber}
                {" · "}
                {
                  request.maintenanceTypeName
                }
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2 rounded-2xl border border-border-dark bg-background/40 p-4">
              <div className="flex items-center gap-2">
                <Wrench
                  size={16}
                  className="text-primary"
                />

                <p className="text-xs font-extrabold text-text-main">
                  User request
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-text-muted">
                {request.description}
              </p>

              <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Requested by{" "}
                <span className="normal-case text-text-main">
                  {
                    request.requestedByFullName
                  }
                </span>
              </p>
            </div>

            <FormField
              label="Scheduled date"
              error={
                errors.scheduledDate
              }
              hint={
                request.preferredDate
                  ? `Preferred: ${getDateInputValue(request.preferredDate)}`
                  : "No preferred date"
              }
              required
            >
              <div className="relative">
                <CalendarCheck2
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="date"
                  min={getTodayInputValue()}
                  value={
                    values.scheduledDate
                  }
                  onChange={(event) =>
                    updateValue(
                      "scheduledDate",
                      event.target.value,
                    )
                  }
                  className={`${getInputClass(
                    Boolean(
                      errors.scheduledDate,
                    ),
                  )} pl-10`}
                />
              </div>
            </FormField>

            <FormField
              label="Due mileage"
              error={errors.dueMileage}
              hint={
                isVehicleLoading
                  ? "Loading vehicle..."
                  : vehicle
                    ? `Current: ${vehicle.currentMileage.toLocaleString()} km`
                    : "Optional"
              }
            >
              <div className="relative">
                <Gauge
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="number"
                  min={
                    vehicle
                      ?.currentMileage ?? 1
                  }
                  step="1"
                  value={
                    values.dueMileage
                  }
                  onChange={(event) =>
                    updateValue(
                      "dueMileage",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. 85000"
                  className={`${getInputClass(
                    Boolean(
                      errors.dueMileage,
                    ),
                  )} pl-10`}
                />
              </div>

              {vehicleError && (
                <p className="mt-1.5 text-[11px] text-danger">
                  {vehicleError}
                </p>
              )}
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                label="Maintenance notes"
                error={errors.notes}
                hint={`${values.notes.length}/1000`}
              >
                <textarea
                  rows={4}
                  maxLength={1000}
                  value={values.notes}
                  onChange={(event) =>
                    updateValue(
                      "notes",
                      event.target.value,
                    )
                  }
                  placeholder="Add scheduling instructions or service notes..."
                  className={`${getInputClass(
                    Boolean(errors.notes),
                  )} h-auto resize-none py-3`}
                />
              </FormField>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-border-dark bg-background/20 p-5 sm:flex-row sm:justify-end sm:p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:border-primary/30 hover:text-text-main disabled:opacity-50"
            >
              Review Later
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isVehicleLoading ||
                Boolean(vehicleError)
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={17}
                  />
                  Approve & Schedule
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

function FormField({
  label,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-text-main">
          {label}

          {required && (
            <span className="ml-1 text-danger">
              *
            </span>
          )}
        </span>

        {hint && (
          <span className="text-right text-[10px] text-text-muted">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-danger">
          {error}
        </p>
      )}
    </label>
  );
}

function getInputClass(
  hasError: boolean,
) {
  return `h-11 w-full rounded-xl border bg-background/60 px-3 text-sm text-text-main outline-none transition placeholder:text-text-muted/50 ${
    hasError
      ? "border-danger/60 focus:ring-4 focus:ring-danger/10"
      : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
  }`;
}