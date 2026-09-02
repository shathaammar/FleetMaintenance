import {
  Ban,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { maintenanceRecordService } from "../../services/maintenanceRecordService";

import type {
  MaintenanceRecord,
} from "../../types/maintenanceRecord";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

type RecordAction =
  | "cancel"
  | "delete";

interface MaintenanceRecordActionModalProps {
  isOpen: boolean;
  action: RecordAction;
  record: MaintenanceRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MaintenanceRecordActionModal({
  isOpen,
  action,
  record,
  onClose,
  onSuccess,
}: MaintenanceRecordActionModalProps) {
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

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

  const isCancelAction =
    action === "cancel";

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      if (isCancelAction) {
        await maintenanceRecordService.cancel(
          record.id,
        );

        toast.success(
          "Maintenance record cancelled successfully.",
        );
      } else {
        await maintenanceRecordService.delete(
          record.id,
        );

        toast.success(
          "Maintenance record deleted successfully.",
        );
      }

      onSuccess();
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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="record-action-title"
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div
          className={`pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl ${
            isCancelAction
              ? "bg-primary/10"
              : "bg-danger/10"
          }`}
        />

        <header className="relative flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="grid size-9 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-text-main disabled:opacity-50"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </header>

        <div className="relative px-6 pb-6 text-center sm:px-8 sm:pb-8">
          <div
            className={`mx-auto grid size-16 place-items-center rounded-2xl ${
              isCancelAction
                ? "bg-primary/10 text-primary"
                : "bg-danger/10 text-danger"
            }`}
          >
            {isCancelAction ? (
              <Ban size={29} />
            ) : (
              <Trash2 size={28} />
            )}
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Record #{record.id}
          </p>

          <h2
            id="record-action-title"
            className="mt-2 font-display text-xl font-extrabold text-text-main"
          >
            {isCancelAction
              ? "Cancel maintenance?"
              : "Delete maintenance record?"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-text-muted">
            {isCancelAction
              ? "This scheduled maintenance will be marked as cancelled and kept in the service history."
              : "This record will be permanently removed. This action cannot be undone."}
          </p>

          <div className="mt-5 rounded-2xl border border-border-dark bg-background/45 p-4 text-left">
            <p className="text-sm font-extrabold text-text-main">
              {record.vehiclePlateNumber}
            </p>

            <p className="mt-1 text-xs font-bold text-primary">
              {
                record.maintenanceTypeName
              }
            </p>
          </div>

          {!isCancelAction && (
            <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/5 p-3 text-left">
              <p className="text-[11px] leading-5 text-danger">
                Completed records and records
                created from approved requests
                cannot be deleted.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-border-dark text-sm font-bold text-text-muted transition hover:border-primary/30 hover:text-text-main disabled:opacity-50"
            >
              Keep Record
            </button>

            <button
              type="button"
              onClick={() => {
                void handleConfirm();
              }}
              disabled={isSubmitting}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isCancelAction
                  ? "bg-primary text-background hover:bg-primary-light"
                  : "bg-danger text-white hover:brightness-110"
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />

                  {isCancelAction
                    ? "Cancelling..."
                    : "Deleting..."}
                </>
              ) : (
                <>
                  {isCancelAction
                    ? "Cancel Maintenance"
                    : "Delete Record"}
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}