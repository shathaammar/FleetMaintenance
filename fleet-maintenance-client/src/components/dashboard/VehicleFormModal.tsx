import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  LoaderCircle,
  X,
} from "lucide-react";
import { useEffect } from "react";
import {
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import {
  VEHICLE_STATUS_OPTIONS,
} from "../../constants/vehicleStatus";
import {
  vehicleService,
} from "../../services/vehicleService";
import type {
  Vehicle,
} from "../../types/vehicle";
import {
  getApiErrorMessage,
} from "../../utils/getApiErrorMessage";

const maximumVehicleYear =
  new Date().getUTCFullYear() + 1;

const vehicleSchema = z.object({
  plateNumber: z
    .string()
    .trim()
    .min(
      1,
      "Plate number is required.",
    )
    .max(
      20,
      "Plate number cannot exceed 20 characters.",
    ),

  make: z
    .string()
    .trim()
    .min(
      1,
      "Vehicle make is required.",
    )
    .max(
      50,
      "Vehicle make cannot exceed 50 characters.",
    ),

  model: z
    .string()
    .trim()
    .min(
      1,
      "Vehicle model is required.",
    )
    .max(
      50,
      "Vehicle model cannot exceed 50 characters.",
    ),

  year: z
    .number()
    .int(
      "Year must be a whole number.",
    )
    .min(
      1900,
      "Year must be 1900 or later.",
    )
    .max(
      maximumVehicleYear,
      `Year cannot exceed ${maximumVehicleYear}.`,
    ),

  currentMileage: z
    .number()
    .int(
      "Current mileage must be a whole number.",
    )
    .min(
      0,
      "Current mileage cannot be negative.",
    ),

  status: z.enum([
    "Active",
    "InMaintenance",
    "OutOfService",
  ]),
});

type VehicleFormData = z.infer<
  typeof vehicleSchema
>;

interface VehicleFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  vehicle?: Vehicle | null;
  onClose: () => void;
  onSaved: () => void;
}

export function VehicleFormModal({
  isOpen,
  mode,
  vehicle,
  onClose,
  onSaved,
}: VehicleFormModalProps) {
  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),

    defaultValues: {
      plateNumber: "",
      make: "",
      model: "",
      year: new Date().getUTCFullYear(),
      currentMileage: 0,
      status: "Active",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEditMode && vehicle) {
      reset({
        plateNumber:
          vehicle.plateNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        currentMileage:
          vehicle.currentMileage,
        status: vehicle.status,
      });

      return;
    }

    reset({
      plateNumber: "",
      make: "",
      model: "",
      year:
        new Date().getUTCFullYear(),
      currentMileage: 0,
      status: "Active",
    });
  }, [
    isOpen,
    isEditMode,
    vehicle,
    reset,
  ]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const onSubmit = async (
    data: VehicleFormData,
  ) => {
    try {
      if (isEditMode && vehicle) {
        await vehicleService.updateVehicle(
          vehicle.id,
          {
            plateNumber:
              data.plateNumber.trim(),

            make:
              data.make.trim(),

            model:
              data.model.trim(),

            year:
              data.year,

            currentMileage:
              data.currentMileage,

            status:
              data.status,
          },
        );

        toast.success(
          "Vehicle updated successfully.",
        );
      } else {
        await vehicleService.createVehicle({
          plateNumber:
            data.plateNumber.trim(),

          make:
            data.make.trim(),

          model:
            data.model.trim(),

          year:
            data.year,

          currentMileage:
            data.currentMileage,
        });

        toast.success(
          "Vehicle created successfully.",
        );
      }

      onSaved();
      onClose();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/80 p-2 backdrop-blur-sm sm:p-4"
          onMouseDown={handleClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 18,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 18,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            className="max-h-[calc(100dvh-1rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-border-dark bg-surface shadow-2xl shadow-black/40 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border-dark bg-surface/95 p-4 backdrop-blur-xl sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-extrabold text-text-main">
                  {isEditMode
                    ? "Edit Vehicle"
                    : "Add New Vehicle"}
                </h2>

                <p className="mt-1 text-xs leading-5 text-text-muted">
                  {isEditMode
                    ? "Update vehicle information and status."
                    : "Register a new vehicle in your system."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="grid size-10 shrink-0 place-items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </header>

            <form
              onSubmit={handleSubmit(
                onSubmit,
              )}
              noValidate
              className="space-y-5 p-4 sm:p-6"
            >
              {/* Plate number */}
              <div>
                <label
                  htmlFor="plateNumber"
                  className="mb-2 block text-xs font-bold text-text-main"
                >
                  Plate Number
                </label>

                <input
                  id="plateNumber"
                  type="text"
                  maxLength={20}
                  placeholder="Example: ABC-4521"
                  {...register(
                    "plateNumber",
                  )}
                  className={[
                    "h-12 w-full rounded-xl border bg-background/60 px-4 text-base uppercase text-text-main outline-none transition placeholder:normal-case placeholder:text-text-muted/50 sm:text-sm",
                    errors.plateNumber
                      ? "border-danger focus:ring-4 focus:ring-danger/5"
                      : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                  ].join(" ")}
                />

                {errors.plateNumber && (
                  <p className="mt-2 text-xs leading-5 text-danger">
                    {
                      errors.plateNumber
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Make and model */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="make"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Vehicle Make
                  </label>

                  <input
                    id="make"
                    type="text"
                    maxLength={50}
                    placeholder="Example: Toyota"
                    {...register("make")}
                    className={[
                      "h-12 w-full rounded-xl border bg-background/60 px-4 text-base text-text-main outline-none transition placeholder:text-text-muted/50 sm:text-sm",
                      errors.make
                        ? "border-danger focus:ring-4 focus:ring-danger/5"
                        : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                    ].join(" ")}
                  />

                  {errors.make && (
                    <p className="mt-2 text-xs leading-5 text-danger">
                      {errors.make.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="model"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Vehicle Model
                  </label>

                  <input
                    id="model"
                    type="text"
                    maxLength={50}
                    placeholder="Example: Hilux"
                    {...register("model")}
                    className={[
                      "h-12 w-full rounded-xl border bg-background/60 px-4 text-base text-text-main outline-none transition placeholder:text-text-muted/50 sm:text-sm",
                      errors.model
                        ? "border-danger focus:ring-4 focus:ring-danger/5"
                        : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                    ].join(" ")}
                  />

                  {errors.model && (
                    <p className="mt-2 text-xs leading-5 text-danger">
                      {errors.model.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Year and mileage */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="year"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Manufacturing Year
                  </label>

                  <input
                    id="year"
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={maximumVehicleYear}
                    {...register("year", {
                      valueAsNumber: true,
                    })}
                    className={[
                      "h-12 w-full rounded-xl border bg-background/60 px-4 text-base text-text-main outline-none transition sm:text-sm",
                      errors.year
                        ? "border-danger focus:ring-4 focus:ring-danger/5"
                        : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                    ].join(" ")}
                  />

                  {errors.year && (
                    <p className="mt-2 text-xs leading-5 text-danger">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="currentMileage"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Current Mileage
                  </label>

                  <div className="relative">
                    <input
                      id="currentMileage"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      {...register(
                        "currentMileage",
                        {
                          valueAsNumber: true,
                        },
                      )}
                      className={[
                        "h-12 w-full rounded-xl border bg-background/60 px-4 pr-12 text-base text-text-main outline-none transition sm:text-sm",
                        errors.currentMileage
                          ? "border-danger focus:ring-4 focus:ring-danger/5"
                          : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                      ].join(" ")}
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                      km
                    </span>
                  </div>

                  {errors.currentMileage && (
                    <p className="mt-2 text-xs leading-5 text-danger">
                      {
                        errors
                          .currentMileage
                          .message
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Status – edit mode only */}
              {isEditMode && (
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Vehicle Status
                  </label>

                  <select
                    id="status"
                    {...register("status")}
                    className="h-12 w-full rounded-xl border border-border-dark bg-background/60 px-4 text-base text-text-main outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/5 sm:text-sm"
                  >
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
              )}

              {/* Actions */}
              <footer className="flex flex-col-reverse gap-3 border-t border-border-dark px-1 pt-5 sm:flex-row sm:justify-end sm:px-0">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting && (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Add Vehicle"}
                </button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}