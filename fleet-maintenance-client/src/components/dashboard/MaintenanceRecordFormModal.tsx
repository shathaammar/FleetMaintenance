import {
  CalendarDays,
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
import type { MaintenanceType, } from "../../types/maintenanceType";
import type { Vehicle, } from "../../types/vehicle";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

type FormMode = "create" | "edit";

interface MaintenanceRecordFormModalProps {
  isOpen: boolean;
  mode: FormMode;
  record: MaintenanceRecord | null;
  vehicles: Vehicle[];
  maintenanceTypes: MaintenanceType[];
  onClose: () => void;
  onSaved: () => void;
}

interface FormValues {
  vehicleId: string;
  maintenanceTypeId: string;
  scheduledDate: string;
  dueMileage: string;
  notes: string;
}

interface FormErrors {
  vehicleId?: string;
  maintenanceTypeId?: string;
  scheduledDate?: string;
  dueMileage?: string;
  notes?: string;
}

const emptyValues: FormValues = {
  vehicleId: "",
  maintenanceTypeId: "",
  scheduledDate: "",
  dueMileage: "",
  notes: "",
};

function getDateInputValue(
  value: string,
) {
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

function getMinimumDate() {
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
  return `${value}T00:00:00.000Z`;
}

export function MaintenanceRecordFormModal({
  isOpen,
  mode,
  record,
  vehicles,
  maintenanceTypes,
  onClose,
  onSaved,
}: MaintenanceRecordFormModalProps) {
  const [
    values,
    setValues,
  ] = useState<FormValues>(
    emptyValues,
  );

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && record) {
      setValues({
        vehicleId:
          record.vehicleId.toString(),

        maintenanceTypeId:
          record.maintenanceTypeId.toString(),

        scheduledDate:
          getDateInputValue(
            record.scheduledDate,
          ),

        dueMileage:
          record.dueMileage?.toString() ??
          "",

        notes: record.notes ?? "",
      });
    } else {
      setValues(emptyValues);
    }

    setErrors({});
  }, [
    isOpen,
    mode,
    record,
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

  if (!isOpen) {
    return null;
  }

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id ===
        Number(values.vehicleId),
    );

  const updateValue = (
    field: keyof FormValues,
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
    const nextErrors: FormErrors = {};

    if (
      mode === "create" &&
      !values.vehicleId
    ) {
      nextErrors.vehicleId =
        "Please select a vehicle.";
    }

    if (!values.maintenanceTypeId) {
      nextErrors.maintenanceTypeId =
        "Please select a maintenance type.";
    }

    if (!values.scheduledDate) {
      nextErrors.scheduledDate =
        "Please select a scheduled date.";
    } else if (
      values.scheduledDate <
      getMinimumDate()
    ) {
      nextErrors.scheduledDate =
        "Scheduled date cannot be in the past.";
    }

    if (values.dueMileage) {
      const dueMileage = Number(
        values.dueMileage,
      );

      if (
        !Number.isInteger(dueMileage) ||
        dueMileage <= 0
      ) {
        nextErrors.dueMileage =
          "Due mileage must be a positive whole number.";
      } else if (
        selectedVehicle &&
        dueMileage <
          selectedVehicle.currentMileage
      ) {
        nextErrors.dueMileage =
          `Due mileage cannot be less than the current mileage of ${selectedVehicle.currentMileage.toLocaleString()} km.`;
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
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "create") {
        await maintenanceRecordService.create({
          vehicleId: Number(
            values.vehicleId,
          ),

          maintenanceTypeId: Number(
            values.maintenanceTypeId,
          ),

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
        });

        toast.success(
          "Maintenance scheduled successfully.",
        );
      } else if (record) {
        await maintenanceRecordService.update(
          record.id,
          {
            maintenanceTypeId: Number(
              values.maintenanceTypeId,
            ),

            scheduledDate: toApiDate(
              values.scheduledDate,
            ),

            ...(values.dueMileage
              ? {
                  dueMileage: Number(
                    values.dueMileage,
                  ),
                }
              : {}),

            notes: values.notes.trim(),
          },
        );

        toast.success(
          "Maintenance schedule updated successfully.",
        );
      }

      onSaved();
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
        aria-labelledby="maintenance-form-title"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                {mode === "create"
                  ? "New Schedule"
                  : `Record #${record?.id}`}
              </p>

              <h2
                id="maintenance-form-title"
                className="mt-1 font-display text-xl font-extrabold text-text-main"
              >
                {mode === "create"
                  ? "Schedule Maintenance"
                  : "Edit Maintenance Schedule"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-text-muted">
                {mode === "create"
                  ? "Create a planned maintenance record for a fleet vehicle."
                  : "Update this scheduled maintenance record."}
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

        <form
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            {mode === "create" ? (
              <FormField
                label="Vehicle"
                error={errors.vehicleId}
                required
              >
                <select
                  value={values.vehicleId}
                  onChange={(event) =>
                    updateValue(
                      "vehicleId",
                      event.target.value,
                    )
                  }
                  className={getInputClass(
                    Boolean(
                      errors.vehicleId,
                    ),
                  )}
                >
                  <option value="">
                    Select vehicle
                  </option>

                  {vehicles.map(
                    (vehicle) => (
                      <option
                        key={vehicle.id}
                        value={vehicle.id}
                      >
                        {
                          vehicle.plateNumber
                        }{" "}
                        — {vehicle.make}{" "}
                        {vehicle.model}
                      </option>
                    ),
                  )}
                </select>
              </FormField>
            ) : (
              <FormField label="Vehicle">
                <div className="flex h-11 items-center rounded-xl border border-border-dark bg-background/35 px-3 text-sm font-bold text-text-muted">
                  {record?.vehiclePlateNumber}
                </div>
              </FormField>
            )}

            <FormField
              label="Maintenance type"
              error={
                errors.maintenanceTypeId
              }
              required
            >
              <select
                value={
                  values.maintenanceTypeId
                }
                onChange={(event) =>
                  updateValue(
                    "maintenanceTypeId",
                    event.target.value,
                  )
                }
                className={getInputClass(
                  Boolean(
                    errors.maintenanceTypeId,
                  ),
                )}
              >
                <option value="">
                  Select service type
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
            </FormField>

            <FormField
              label="Scheduled date"
              error={
                errors.scheduledDate
              }
              required
            >
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="date"
                  min={getMinimumDate()}
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
                selectedVehicle
                  ? `Current: ${selectedVehicle.currentMileage.toLocaleString()} km`
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
                    selectedVehicle
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
            </FormField>

            <div className="sm:col-span-2">
              <FormField
                label="Notes"
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
                  placeholder="Add service instructions or relevant details..."
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
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-lg shadow-primary/15 transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  {mode === "create"
                    ? "Schedule Maintenance"
                    : "Save Changes"}
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