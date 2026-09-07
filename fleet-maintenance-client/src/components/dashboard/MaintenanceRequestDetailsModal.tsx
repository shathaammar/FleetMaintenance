import {
  CalendarCheck2,
  CalendarDays,
  Hash,
  Mail,
  Wrench,
  X,
} from "lucide-react";

import { useEffect, } from "react";
import type { LucideIcon, } from "lucide-react";
import { MaintenanceRequestStatusBadge } from "./MaintenanceRequestStatusBadge";
import type { MaintenanceRequest, } from "../../types/maintenanceRequest";

interface MaintenanceRequestDetailsModalProps {
  isOpen: boolean;
  request: MaintenanceRequest | null;
  onClose: () => void;
}

const dateFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const dateTimeFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateFormatter.format(date);
}

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "Not reviewed yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateTimeFormatter.format(date);
}

export function MaintenanceRequestDetailsModal({
  isOpen,
  request,
  onClose,
}: MaintenanceRequestDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
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
    onClose,
  ]);

  if (!isOpen || !request) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close request details"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                Request #{request.id}
              </p>

              <h2
                id="request-details-title"
                className="mt-1 truncate font-display text-xl font-extrabold text-text-main sm:text-2xl"
              >
                {
                  request.maintenanceTypeName
                }
              </h2>

              <div className="mt-3">
                <MaintenanceRequestStatusBadge
                  status={request.status}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-border-dark bg-background/45 p-4">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Requested By
                  </p>

                  <p className="mt-1 truncate text-sm font-extrabold text-text-main">
                    {
                      request.requestedByFullName
                    }
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-border-dark pt-3">
                <Mail
                  size={14}
                  className="shrink-0 text-text-muted"
                />

                <p className="truncate text-xs text-text-muted">
                  {
                    request.requestedByEmail
                  }
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-border-dark bg-background/45 p-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-extrabold text-text-main">
                    {
                      request.vehiclePlateNumber
                    }
                  </p>
                </div>
              </div>

              <p className="mt-4 border-t border-border-dark pt-3 text-xs text-text-muted">
                Vehicle ID #
                {request.vehicleId}
              </p>
            </article>
          </section>

          <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailCard
              icon={Wrench}
              label="Service Type"
              value={
                request.maintenanceTypeName
              }
              color="primary"
            />

            <DetailCard
              icon={CalendarDays}
              label="Preferred Date"
              value={formatDate(
                request.preferredDate,
              )}
              color="blue"
            />

            <DetailCard
              icon={CalendarCheck2}
              label="Requested At"
              value={formatDateTime(
                request.requestedAt,
              )}
              color="primary"
            />

            <DetailCard
              icon={CalendarCheck2}
              label="Reviewed At"
              value={formatDateTime(
                request.reviewedAt,
              )}
              color="green"
            />

            <DetailCard
              icon={Hash}
              label="Maintenance Record"
              value={
                request.maintenanceRecordId
                  ? `Record #${request.maintenanceRecordId}`
                  : "Not created"
              }
              color="green"
            />

            <DetailCard
              icon={Hash}
              label="Type ID"
              value={`#${request.maintenanceTypeId}`}
              color="blue"
            />
          </section>

          <section className="mt-5 rounded-2xl border border-border-dark bg-background/45 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">
                Request Description
              </h3>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text-muted">
              {request.description}
            </p>
          </section>

          {request.rejectionReason && (
            <section className="mt-4 rounded-2xl border border-danger/20 bg-danger/5 p-4 sm:p-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-danger">
                Rejection Reason
              </h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-danger/85">
                {
                  request.rejectionReason
                }
              </p>
            </section>
          )}
        </div>

        <div className="border-t border-border-dark bg-background/20 p-5 sm:p-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl bg-primary text-sm font-extrabold text-background transition hover:bg-primary-light sm:ml-auto sm:block sm:w-auto sm:px-6"
          >
            Close Details
          </button>
        </div>
      </section>
    </div>
  );
}

type DetailColor =
  | "primary"
  | "green"
  | "blue";

interface DetailCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: DetailColor;
}

const colorClasses: Record<
  DetailColor,
  string
> = {
  primary:
    "bg-primary/10 text-primary",

  green:
    "bg-emerald-500/10 text-emerald-400",

  blue:
    "bg-blue-500/10 text-blue-400",
};

function DetailCard({
  icon: Icon,
  label,
  value,
  color,
}: DetailCardProps) {
  return (
    <article className="rounded-2xl border border-border-dark bg-background/45 p-4">
      <div
        className={`grid size-9 place-items-center rounded-xl ${colorClasses[color]}`}
      >
        <Icon size={17} />
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-extrabold text-text-main">
        {value}
      </p>
    </article>
  );
}