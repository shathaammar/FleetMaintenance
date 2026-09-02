import {
  CalendarCheck2,
  CalendarDays,
  CircleDollarSign,
  Gauge,
  Hash,
  NotebookText,
  Wrench,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import { MaintenanceStatusBadge } from "./MaintenanceStatusBadge";

import type {
  MaintenanceRecord,
} from "../../types/maintenanceRecord";

interface MaintenanceRecordDetailsModalProps {
  isOpen: boolean;
  record: MaintenanceRecord | null;
  onClose: () => void;
}

const dateFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const currencyFormatter =
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return dateFormatter.format(date);
}

function formatMileage(
  value: number | null,
) {
  if (value === null) {
    return "Not specified";
  }

  return `${value.toLocaleString()} km`;
}

function formatCost(
  value: number | null,
) {
  if (value === null) {
    return "Not recorded";
  }

  return currencyFormatter.format(value);
}

export function MaintenanceRecordDetailsModal({
  isOpen,
  record,
  onClose,
}: MaintenanceRecordDetailsModalProps) {
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

  if (!isOpen || !record) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close details"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-details-title"
        className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                Maintenance Record
              </p>

              <h2
                id="record-details-title"
                className="mt-1 truncate font-display text-xl font-extrabold text-text-main sm:text-2xl"
              >
                {
                  record.maintenanceTypeName
                }
              </h2>

              <div className="mt-3">
                <MaintenanceStatusBadge
                  status={record.status}
                  isOverdue={
                    record.isOverdue
                  }
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
          <section className="rounded-2xl border border-border-dark bg-background/45 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Vehicle
                  </p>

                  <p className="mt-1 font-display text-lg font-extrabold text-text-main">
                    {
                      record.vehiclePlateNumber
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border-dark bg-surface/60 px-3 py-2 text-xs text-text-muted">
                <Hash size={14} />

                Record ID:
                <span className="font-extrabold text-text-main">
                  {record.id}
                </span>
              </div>
            </div>
          </section>

          <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailCard
              icon={CalendarDays}
              label="Scheduled Date"
              value={formatDate(
                record.scheduledDate,
              )}
              color="primary"
            />

            <DetailCard
              icon={CalendarCheck2}
              label="Completed Date"
              value={formatDate(
                record.completedDate,
              )}
              color="green"
            />

            <DetailCard
              icon={CircleDollarSign}
              label="Final Cost"
              value={formatCost(
                record.cost,
              )}
              color="green"
            />

            <DetailCard
              icon={Gauge}
              label="Due Mileage"
              value={formatMileage(
                record.dueMileage,
              )}
              color="blue"
            />

            <DetailCard
              icon={Gauge}
              label="Mileage at Service"
              value={formatMileage(
                record.mileageAtService,
              )}
              color="blue"
            />

            <DetailCard
              icon={Wrench}
              label="Service Type"
              value={
                record.maintenanceTypeName
              }
              color="primary"
            />
          </section>

          <section className="mt-5 rounded-2xl border border-border-dark bg-background/45 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <NotebookText
                size={17}
                className="text-primary"
              />

              <h3 className="text-xs font-extrabold uppercase tracking-wider text-text-main">
                Service Notes
              </h3>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-text-muted">
              {record.notes ||
                "No notes were provided for this maintenance record."}
            </p>
          </section>

          {/* <footer className="mt-5 flex flex-col gap-2 border-t border-border-dark pt-4 text-[10px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              Created{" "}
              <span className="font-bold text-text-main">
                {formatDateTime(
                  record.createdAt,
                )}
              </span>
            </p>

            <p>
              Vehicle ID #{record.vehicleId}
              {" · "}
              Type ID #
              {record.maintenanceTypeId}
            </p>
          </footer> */}
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