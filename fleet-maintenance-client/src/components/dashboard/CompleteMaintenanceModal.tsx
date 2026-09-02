import {
  CalendarCheck2,
  CircleDollarSign,
  Gauge,
  LoaderCircle,
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
import { maintenanceRecordService } from "../../services/maintenanceRecordService";

import type { MaintenanceRecord, } from "../../types/maintenanceRecord";
import type { Vehicle, } from "../../types/vehicle";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

interface CompleteMaintenanceModalProps {
  isOpen: boolean;
  record: MaintenanceRecord | null;
  vehicle: Vehicle | null;
  onClose: () => void;
  onCompleted: () => void;
}

interface CompleteFormValues {
  completedDate: string;
  mileageAtService: string;
  cost: string;
  notes: string;
}

interface CompleteFormErrors {
  completedDate?: string;
  mileageAtService?: string;
  cost?: string;
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

function toApiDate(value: string) {
  return `${value}T12:00:00.000Z`;
}

export function CompleteMaintenanceModal({
  isOpen,
  record,
  vehicle,
  onClose,
  onCompleted,
}: CompleteMaintenanceModalProps) {
  const [
    values,
    setValues,
  ] = useState<CompleteFormValues>({
    completedDate: "",
    mileageAtService: "",
    cost: "",
    notes: "",
  });

  const [
    errors,
    setErrors,
  ] = useState<CompleteFormErrors>({});

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setValues({
      completedDate:
        getTodayInputValue(),

      mileageAtService:
        vehicle?.currentMileage
          .toString() ?? "",

      cost: "",

      notes: record?.notes ?? "",
    });

    setErrors({});
  }, [
    isOpen,
    record,
    vehicle,
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

  if (!isOpen || !record) {
    return null;
  }

  const updateValue = (
    field: keyof CompleteFormValues,
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
      CompleteFormErrors = {};

    if (!values.completedDate) {
      nextErrors.completedDate =
        "Completed date is required.";
    } else if (
      values.completedDate >
      getTodayInputValue()
    ) {
      nextErrors.completedDate =
        "Completed date cannot be in the future.";
    }

    if (!values.mileageAtService) {
      nextErrors.mileageAtService =
        "Mileage at service is required.";
    } else {
      const mileage = Number(
        values.mileageAtService,
      );

      if (
        !Number.isInteger(mileage) ||
        mileage < 0
      ) {
        nextErrors.mileageAtService =
          "Mileage must be a non-negative whole number.";
      } else if (
        vehicle &&
        mileage <
          vehicle.currentMileage
      ) {
        nextErrors.mileageAtService =
          `Mileage cannot be less than the vehicle's current mileage of ${vehicle.currentMileage.toLocaleString()} km.`;
      }
    }

    if (values.cost === "") {
      nextErrors.cost =
        "Maintenance cost is required.";
    } else {
      const cost = Number(values.cost);

      if (
        !Number.isFinite(cost) ||
        cost < 0
      ) {
        nextErrors.cost =
          "Cost cannot be negative.";
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

      await maintenanceRecordService.complete(
        record.id,
        {
          completedDate: toApiDate(
            values.completedDate,
          ),

          mileageAtService: Number(
            values.mileageAtService,
          ),

          cost: Number(values.cost),

          notes:
            values.notes.trim() ||
            null,
        },
      );

      toast.success(
        "Maintenance completed successfully.",
      );

      onCompleted();
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
        aria-label="Close modal"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="complete-maintenance-title"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                Record #{record.id}
              </p>

              <h2
                id="complete-maintenance-title"
                className="mt-1 font-display text-xl font-extrabold text-text-main"
              >
                Complete Maintenance
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                {record.vehiclePlateNumber}
                {" · "}
                {
                  record.maintenanceTypeName
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
            <FormField
              label="Completed date"
              error={errors.completedDate}
              required
            >
              <div className="relative">
                <CalendarCheck2
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="date"
                  max={getTodayInputValue()}
                  value={
                    values.completedDate
                  }
                  onChange={(event) =>
                    updateValue(
                      "completedDate",
                      event.target.value,
                    )
                  }
                  className={`${getInputClass(
                    Boolean(
                      errors.completedDate,
                    ),
                  )} pl-10`}
                />
              </div>
            </FormField>

            <FormField
              label="Mileage at service"
              error={
                errors.mileageAtService
              }
              hint={
                vehicle
                  ? `Current: ${vehicle.currentMileage.toLocaleString()} km`
                  : undefined
              }
              required
            >
              <div className="relative">
                <Gauge
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="number"
                  min={
                    vehicle?.currentMileage ??
                    0
                  }
                  step="1"
                  value={
                    values.mileageAtService
                  }
                  onChange={(event) =>
                    updateValue(
                      "mileageAtService",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. 85000"
                  className={`${getInputClass(
                    Boolean(
                      errors.mileageAtService,
                    ),
                  )} pl-10`}
                />
              </div>
            </FormField>

            <FormField
              label="Final cost (USD)"
              error={errors.cost}
              required
            >
              <div className="relative">
                <CircleDollarSign
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={values.cost}
                  onChange={(event) =>
                    updateValue(
                      "cost",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. 85.50"
                  className={`${getInputClass(
                    Boolean(errors.cost),
                  )} pl-10`}
                />
              </div>
            </FormField>

            <div className="rounded-2xl border border-border-dark bg-background/35 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Scheduled service
              </p>

              <p className="mt-2 text-sm font-extrabold text-text-main">
                {
                  record.maintenanceTypeName
                }
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {
                  record.vehiclePlateNumber
                }
              </p>
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Completion notes"
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
                  placeholder="Add details about completed work, replaced parts, or observations..."
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
              Keep Scheduled
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/15 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Completing...
                </>
              ) : (
                <>
                  Complete Maintenance
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
          <span className="text-[10px] text-text-muted">
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