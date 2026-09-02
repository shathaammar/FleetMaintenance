import { zodResolver } from
  "@hookform/resolvers/zod";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  LoaderCircle,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from
  "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import {
  maintenanceTypeService,
} from "../../services/maintenanceTypeService";
import type {
  MaintenanceType,
} from "../../types/maintenanceType";
import {
  getApiErrorMessage,
} from "../../utils/getApiErrorMessage";

const maintenanceTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      1,
      "Maintenance type name is required.",
    )
    .max(
      100,
      "Maintenance type name cannot exceed 100 characters.",
    ),

  description: z
    .string()
    .max(
      500,
      "Description cannot exceed 500 characters.",
    ),
});

type MaintenanceTypeFormData = z.infer<
  typeof maintenanceTypeSchema
>;

interface MaintenanceTypeFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  maintenanceType?: MaintenanceType | null;
  onClose: () => void;
  onSaved: () => void;
}

export function MaintenanceTypeFormModal({
  isOpen,
  mode,
  maintenanceType,
  onClose,
  onSaved,
}: MaintenanceTypeFormModalProps) {
  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<MaintenanceTypeFormData>({
    resolver:
      zodResolver(
        maintenanceTypeSchema,
      ),

    defaultValues: {
      name: "",
      description: "",
    },
  });

  const description =
    watch("description") ?? "";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
      isEditMode &&
      maintenanceType
    ) {
      reset({
        name: maintenanceType.name,
        description:
          maintenanceType.description ??
          "",
      });

      return;
    }

    reset({
      name: "",
      description: "",
    });
  }, [
    isOpen,
    isEditMode,
    maintenanceType,
    reset,
  ]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const onSubmit = async (
    data: MaintenanceTypeFormData,
  ) => {
    const normalizedDescription =
      data.description.trim() || null;

    try {
      if (
        isEditMode &&
        maintenanceType
      ) {
        await maintenanceTypeService.update(
          maintenanceType.id,
          {
            name: data.name.trim(),
            description:
              normalizedDescription,
          },
        );

        toast.success(
          "Maintenance type updated successfully.",
        );
      } else {
        await maintenanceTypeService.create({
          name: data.name.trim(),
          description:
            normalizedDescription,
        });

        toast.success(
          "Maintenance type created successfully.",
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={handleClose}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm"
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
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
          >
            <header className="flex items-center justify-between border-b border-border-dark p-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-text-main">
                    {isEditMode
                      ? "Edit Maintenance Type"
                      : "New Maintenance Type"}
                  </h2>

                  <p className="mt-1 text-xs text-text-muted">
                    {isEditMode
                      ? "Update this service category."
                      : "Create a service category for maintenance records."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="grid size-10 shrink-0 place-items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:opacity-50"
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
              className="space-y-5 p-5 sm:p-6"
            >
              <div>
                <label
                  htmlFor="maintenanceTypeName"
                  className="mb-2 block text-xs font-bold text-text-main"
                >
                  Type Name
                </label>

                <input
                  id="maintenanceTypeName"
                  type="text"
                  maxLength={100}
                  autoFocus
                  placeholder="Example: Brake Inspection"
                  {...register("name")}
                  className={[
                    "h-12 w-full rounded-xl border bg-background/60 px-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/50",
                    errors.name
                      ? "border-danger focus:ring-4 focus:ring-danger/5"
                      : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                  ].join(" ")}
                />

                {errors.name && (
                  <p className="mt-2 text-xs text-danger">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="maintenanceTypeDescription"
                    className="text-xs font-bold text-text-main"
                  >
                    Description
                    <span className="ml-1 font-normal text-text-muted">
                      (Optional)
                    </span>
                  </label>

                  <span
                    className={[
                      "text-[10px]",
                      description.length >
                      450
                        ? "text-primary"
                        : "text-text-muted",
                    ].join(" ")}
                  >
                    {description.length}/500
                  </span>
                </div>

                <textarea
                  id="maintenanceTypeDescription"
                  rows={5}
                  maxLength={500}
                  placeholder="Describe what this maintenance service includes..."
                  {...register("description")}
                  className={[
                    "w-full resize-none rounded-xl border bg-background/60 p-4 text-sm leading-6 text-text-main outline-none transition placeholder:text-text-muted/50",
                    errors.description
                      ? "border-danger focus:ring-4 focus:ring-danger/5"
                      : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                  ].join(" ")}
                />

                {errors.description && (
                  <p className="mt-2 text-xs text-danger">
                    {
                      errors.description
                        .message
                    }
                  </p>
                )}
              </div>

              <footer className="flex flex-col-reverse gap-3 border-t border-border-dark pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
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
                      : "Create Type"}
                </button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}