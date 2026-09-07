import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  LoaderCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { maintenanceRequestService } from "../../services/maintenanceRequestService";
import type { MaintenanceRequest } from "../../types/maintenanceRequest";

interface CancelMaintenanceRequestModalProps {
  isOpen: boolean;
  request: MaintenanceRequest | null;
  onClose: () => void;
  onCancelled: () => void | Promise<void>;
}

export default function CancelMaintenanceRequestModal({
  isOpen,
  request,
  onClose,
  onCancelled,
}: CancelMaintenanceRequestModalProps) {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  async function handleCancelRequest() {
    if (!request || request.status !== "Pending") {
      return;
    }

    try {
      setIsSubmitting(true);

      await maintenanceRequestService.cancelMyRequest(
        request.id,
      );

      toast.success(
        "Maintenance request cancelled successfully.",
      );

      await onCancelled();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && request && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-request-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#071525] shadow-2xl shadow-black/50"
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 24,
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
          >
            <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                    Confirmation
                  </p>

                  <h2
                    id="cancel-request-title"
                    className="mt-1 text-xl font-bold text-white"
                  >
                    Cancel request?
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Close"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <p className="leading-7 text-slate-300">
                You are about to cancel the maintenance
                request for vehicle{" "}
                <span className="font-semibold text-white">
                  {request.vehiclePlateNumber}
                </span>
                .
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Maintenance type
                </p>

                <p className="mt-1 font-semibold text-slate-100">
                  {request.maintenanceTypeName}
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                A cancelled request cannot be approved by
                the administrator. You can submit a new
                request later if needed.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="order-2 rounded-xl border border-white/10 px-4 py-3 font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:order-1"
                >
                  Keep Request
                </button>

                <button
                  type="button"
                  onClick={handleCancelRequest}
                  disabled={isSubmitting}
                  className="order-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Request"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}