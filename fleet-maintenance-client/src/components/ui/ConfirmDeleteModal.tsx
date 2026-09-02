import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  AlertTriangle,
  LoaderCircle,
  X,
} from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  warning?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  warning =
    "This action cannot be undone.",
  isDeleting,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const handleClose = () => {
    if (!isDeleting) {
      onClose();
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
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-md rounded-3xl border border-border-dark bg-surface p-5 shadow-2xl shadow-black/40 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-danger/10 text-danger">
                <AlertTriangle size={27} />
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="grid size-9 shrink-0 place-items-center rounded-xl text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:opacity-50"
                aria-label="Close confirmation"
              >
                <X size={19} />
              </button>
            </div>

            <h2 className="mt-5 font-display text-xl font-extrabold text-text-main">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              {description}
            </p>

            <div className="mt-4 rounded-xl border border-danger/15 bg-danger/5 p-3">
              <p className="text-xs leading-5 text-danger">
                {warning}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="h-11 rounded-xl border border-border-dark px-5 text-sm font-bold text-text-muted transition hover:bg-surface-light hover:text-text-main disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-extrabold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                ) : null}

                {isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}