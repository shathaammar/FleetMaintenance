import {
  LoaderCircle,
  MessageSquareWarning,
  X,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import toast from "react-hot-toast";

import { maintenanceRequestService } from "../../services/maintenanceRequestService";

import type {
  MaintenanceRequest,
} from "../../types/maintenanceRequest";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

interface RejectMaintenanceRequestModalProps {
  isOpen: boolean;
  request: MaintenanceRequest | null;
  onClose: () => void;
  onRejected: () => void;
}

export function RejectMaintenanceRequestModal({
  isOpen,
  request,
  onClose,
  onRejected,
}: RejectMaintenanceRequestModalProps) {
  const [
    reason,
    setReason,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setReason("");
    setError(null);
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

  const validate = () => {
    const normalizedReason =
      reason.trim();

    if (!normalizedReason) {
      setError(
        "Rejection reason is required.",
      );

      return false;
    }

    if (normalizedReason.length > 500) {
      setError(
        "Rejection reason cannot exceed 500 characters.",
      );

      return false;
    }

    setError(null);

    return true;
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

      await maintenanceRequestService.reject(
        request.id,
        {
          reason: reason.trim(),
        },
      );

      toast.success(
        "Maintenance request rejected.",
      );

      onRejected();
      onClose();
    } catch (requestError) {
      toast.error(
        getApiErrorMessage(
          requestError,
        ),
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
        aria-label="Close rejection modal"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-request-title"
        className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-danger/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-danger/10 text-danger">
              <XCircle size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-danger">
                Reject Request #
                {request.id}
              </p>

              <h2
                id="reject-request-title"
                className="mt-1 font-display text-xl font-extrabold text-text-main"
              >
                Reject Maintenance Request
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
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-danger/30 hover:text-danger disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-5 sm:p-6">
            <div className="rounded-2xl border border-border-dark bg-background/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Submitted by{" "}
                <span className="normal-case text-text-main">
                  {
                    request.requestedByFullName
                  }
                </span>
              </p>

              <p className="mt-3 line-clamp-4 text-sm leading-6 text-text-muted">
                {request.description}
              </p>
            </div>

            <label className="mt-5 block">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-bold text-text-main">
                  <MessageSquareWarning
                    size={15}
                    className="text-danger"
                  />

                  Rejection reason

                  <span className="text-danger">
                    *
                  </span>
                </span>

                <span
                  className={`text-[10px] ${
                    reason.length > 500
                      ? "text-danger"
                      : "text-text-muted"
                  }`}
                >
                  {reason.length}/500
                </span>
              </div>

              <textarea
                rows={5}
                maxLength={500}
                value={reason}
                onChange={(event) => {
                  setReason(
                    event.target.value,
                  );

                  setError(null);
                }}
                placeholder="Explain clearly why this request cannot be approved..."
                className={`w-full resize-none rounded-xl border bg-background/60 px-3 py-3 text-sm leading-6 text-text-main outline-none transition placeholder:text-text-muted/50 ${
                  error
                    ? "border-danger/60 focus:ring-4 focus:ring-danger/10"
                    : "border-border-dark focus:border-danger/50 focus:ring-4 focus:ring-danger/5"
                }`}
              />

              {error && (
                <p className="mt-1.5 text-[11px] font-semibold text-danger">
                  {error}
                </p>
              )}
            </label>

            <div className="mt-4 rounded-2xl border border-danger/20 bg-danger/5 p-3">
              <p className="text-[11px] leading-5 text-danger/90">
                The requester will see this
                reason in their request
                history. Keep it clear and
                professional.
              </p>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-border-dark bg-background/20 p-5 sm:flex-row sm:justify-end sm:p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:border-primary/30 hover:text-text-main disabled:opacity-50"
            >
              Keep Pending
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-extrabold text-white shadow-lg shadow-danger/15 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle size={17} />
                  Reject Request
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}