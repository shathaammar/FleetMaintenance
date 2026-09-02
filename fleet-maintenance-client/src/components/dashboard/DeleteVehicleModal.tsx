import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  AlertTriangle,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import {
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  vehicleService,
} from "../../services/vehicleService";
import type {
  Vehicle,
} from "../../types/vehicle";
import {
  getApiErrorMessage,
} from "../../utils/getApiErrorMessage";

interface DeleteVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteVehicleModal({
  vehicle,
  isOpen,
  onClose,
  onDeleted,
}: DeleteVehicleModalProps) {
  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!vehicle) {
      return;
    }

    try {
      setIsDeleting(true);

      await vehicleService.deleteVehicle(
        vehicle.id,
      );

      toast.success(
        "Vehicle deleted successfully.",
      );

      onDeleted();
      onClose();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && vehicle && (
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
          onMouseDown={handleClose}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background/80 p-2 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 16,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-vehicle-title"
            aria-describedby="delete-vehicle-description"
            className="max-h-[calc(100dvh-1rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-border-dark bg-surface p-4 shadow-2xl shadow-black/40 sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:p-6"
          >
            {/* Icon and close button */}
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-danger/10 text-danger sm:size-14">
                <AlertTriangle
                  size={27}
                />
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="grid size-9 shrink-0 place-items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close confirmation"
              >
                <X size={19} />
              </button>
            </div>

            {/* Confirmation message */}
            <h2
              id="delete-vehicle-title"
              className="mt-5 font-display text-xl font-extrabold text-text-main"
            >
              Delete this vehicle?
            </h2>

            <p
              id="delete-vehicle-description"
              className="mt-3 break-words text-sm leading-6 text-text-muted"
            >
              You are about to permanently delete{" "}
              <span className="font-bold text-text-main">
                {vehicle.make}{" "}
                {vehicle.model}
              </span>{" "}
              with plate number{" "}
              <span className="font-bold text-primary">
                {vehicle.plateNumber}
              </span>
              .
            </p>

            {/* Warning */}
            <div className="mt-4 rounded-xl border border-danger/15 bg-danger/5 p-3 sm:p-4">
              <p className="text-xs leading-5 text-danger">
                This action cannot be undone.
                Deletion may also fail if the
                vehicle is linked to maintenance
                records.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="h-11 w-full rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Keep Vehicle
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleDelete();
                }}
                disabled={isDeleting}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-extrabold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isDeleting ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={18} />
                )}

                {isDeleting
                  ? "Deleting..."
                  : "Delete Vehicle"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}