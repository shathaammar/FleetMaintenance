import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
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

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { maintenanceRequestService } from "../../services/maintenanceRequestService";
import { maintenanceTypeService } from "../../services/maintenanceTypeService";
import { vehicleService } from "../../services/vehicleService";

import type {
  MaintenanceType,
} from "../../types/maintenanceType";

import type {
  Vehicle,
} from "../../types/vehicle";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

interface FormValues {
  vehicleId: string;
  maintenanceTypeId: string;
  description: string;
  preferredDate: string;
}

interface FormErrors {
  vehicleId?: string;
  maintenanceTypeId?: string;
  description?: string;
  preferredDate?: string;
}

const emptyValues: FormValues = {
  vehicleId: "",
  maintenanceTypeId: "",
  description: "",
  preferredDate: "",
};

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
  return `${value}T00:00:00.000Z`;
}

export function UserCreateMaintenanceRequestPage() {
  const navigate = useNavigate();

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
    vehicles,
    setVehicles,
  ] = useState<Vehicle[]>([]);

  const [
    maintenanceTypes,
    setMaintenanceTypes,
  ] = useState<MaintenanceType[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState<string | null>(null);

  const loadOptions = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const [
        vehiclesResult,
        typesResult,
      ] = await Promise.all([
        vehicleService.getVehicles({
          search: "",
          pageNumber: 1,
          pageSize: 100,
        }),

        maintenanceTypeService.getAll(),
      ]);

      setVehicles(
        vehiclesResult.items,
      );

      setMaintenanceTypes(
        typesResult,
      );
    } catch (error) {
      setLoadError(
        getApiErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOptions();
  }, []);

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

    if (!values.vehicleId) {
      nextErrors.vehicleId =
        "Please select a vehicle.";
    }

    if (!values.maintenanceTypeId) {
      nextErrors.maintenanceTypeId =
        "Please select a maintenance type.";
    }

    const description =
      values.description.trim();

    if (!description) {
      nextErrors.description =
        "Please describe the maintenance issue.";
    } else if (
      description.length > 1000
    ) {
      nextErrors.description =
        "Description cannot exceed 1000 characters.";
    }

    if (
      values.preferredDate &&
      values.preferredDate <
        getTodayInputValue()
    ) {
      nextErrors.preferredDate =
        "Preferred date cannot be in the past.";
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

      await maintenanceRequestService.create({
        vehicleId: Number(
          values.vehicleId,
        ),

        maintenanceTypeId: Number(
          values.maintenanceTypeId,
        ),

        description:
          values.description.trim(),

        preferredDate:
          values.preferredDate
            ? toApiDate(
                values.preferredDate,
              )
            : null,
      });

      toast.success(
        "Maintenance request submitted successfully.",
      );

      navigate(
        "/user/maintenance-requests",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <LoaderCircle
            size={32}
            className="mx-auto animate-spin text-primary"
          />

          <p className="mt-3 text-sm text-text-muted">
            Preparing request form...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-border-dark bg-surface/70 p-6 text-center">
        <div>
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle size={27} />
          </div>

          <h2 className="mt-4 font-display text-xl font-extrabold text-text-main">
            Unable to prepare the form
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-muted">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadOptions();
            }}
            className="mt-5 h-10 rounded-xl bg-primary px-5 text-xs font-extrabold text-background"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const noAvailableOptions =
    vehicles.length === 0 ||
    maintenanceTypes.length === 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            MAINTENANCE REQUEST
          </p>

          <h2 className="font-display text-2xl font-extrabold text-text-main">
            Request Maintenance
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
            Tell the fleet team what your
            vehicle needs. Your request
            will be reviewed before
            maintenance is scheduled.
          </p>
        </div>
      </section>

      {noAvailableOptions ? (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
          <AlertTriangle
            size={30}
            className="mx-auto text-primary"
          />

          <h3 className="mt-4 font-display text-lg font-extrabold text-text-main">
            Request form unavailable
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
            No vehicles or maintenance
            types are currently available.
            Contact your fleet
            administrator for assistance.
          </p>
        </section>
      ) : (
        <div>
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl"
          >
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
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
                    Select maintenance type
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

              <div className="sm:col-span-2">
                <FormField
                  label="Describe the issue"
                  error={
                    errors.description
                  }
                  hint={`${values.description.length}/1000`}
                  required
                >
                  <textarea
                    rows={6}
                    maxLength={1000}
                    value={
                      values.description
                    }
                    onChange={(event) =>
                      updateValue(
                        "description",
                        event.target.value,
                      )
                    }
                    placeholder="Describe the symptoms, unusual sounds, warning lights, or maintenance needed..."
                    className={`${getInputClass(
                      Boolean(
                        errors.description,
                      ),
                    )} h-auto resize-none py-3 leading-6`}
                  />
                </FormField>
              </div>

              <div className="sm:col-span-2">
                <FormField
                  label="Preferred date"
                  error={
                    errors.preferredDate
                  }
                  hint="Optional"
                >
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      type="date"
                      min={getTodayInputValue()}
                      value={
                        values.preferredDate
                      }
                      onChange={(event) =>
                        updateValue(
                          "preferredDate",
                          event.target.value,
                        )
                      }
                      className={`${getInputClass(
                        Boolean(
                          errors.preferredDate,
                        ),
                      )} pl-10`}
                    />
                  </div>
                </FormField>

                <div className="mt-2 flex items-start gap-2 text-[11px] leading-5 text-text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-base font-extrabold leading-4 text-emerald-400"
                  >
                    *
                  </span>

                  <p>
                    The preferred date is not guaranteed. The fleet administrator will set the final schedule.
                  </p>
                </div>
              </div>
            </div>

            <section className="border-t border-emerald-500/20 bg-emerald-500/5 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <h3 className="text-sm font-extrabold text-text-main">
                  What happens next?
                </h3>
              </div>

              <ol className="mt-4 space-y-3 text-xs leading-5 text-text-muted">
                <li className="flex gap-2">
                  <span className="font-extrabold text-emerald-400">
                    1.
                  </span>
                  <span>
                    Your request is submitted as Pending.
                  </span>
                </li>

                <li className="flex gap-2">
                  <span className="font-extrabold text-emerald-400">
                    2.
                  </span>
                  <span>
                    The fleet administrator reviews the issue.
                  </span>
                </li>

                <li className="flex gap-2">
                  <span className="font-extrabold text-emerald-400">
                    3.
                  </span>
                  <span>
                    Approved requests are converted into scheduled maintenance records.
                  </span>
                </li>
              </ol>
            </section>

            <footer className="flex flex-col-reverse gap-3 border-t border-border-dark bg-background/20 p-5 sm:flex-row sm:justify-end sm:p-6">
              <Link
                to="/user/maintenance-requests"
                className="flex h-11 items-center justify-center rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:border-primary/30 hover:text-text-main"
              >
                Cancel
              </Link>

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
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                  </>
                )}
              </button>
            </footer>
          </form>
        </div>
      )}
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