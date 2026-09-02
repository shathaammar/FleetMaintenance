import {
  AlertTriangle,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { MaintenanceTypeFormModal, } from "../../components/dashboard/MaintenanceTypeFormModal";
import { ConfirmDeleteModal, } from "../../components/ui/ConfirmDeleteModal";
import { maintenanceTypeService, } from "../../services/maintenanceTypeService";
import type { MaintenanceType, } from "../../types/maintenanceType";
import { getApiErrorMessage, } from "../../utils/getApiErrorMessage";

const ITEMS_PER_PAGE = 12;

export function AdminMaintenanceTypesPage() {
  const [
    maintenanceTypes,
    setMaintenanceTypes,
  ] = useState<MaintenanceType[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [pageInput, setPageInput] =
    useState("1");

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    selectedType,
    setSelectedType,
  ] = useState<MaintenanceType | null>(
    null,
  );

  const [
    formMode,
    setFormMode,
  ] = useState<"create" | "edit">(
    "create",
  );

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    isDeleteOpen,
    setIsDeleteOpen,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const loadMaintenanceTypes =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data =
          await maintenanceTypeService.getAll();

        const sortedData = [...data].sort(
          (first, second) =>
            first.name.localeCompare(
              second.name,
            ),
        );

        setMaintenanceTypes(sortedData);
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadMaintenanceTypes();
  }, [loadMaintenanceTypes]);

  const filteredTypes = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return maintenanceTypes;
    }

    return maintenanceTypes.filter(
      (type) =>
        type.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        type.description
          ?.toLowerCase()
          .includes(normalizedSearch),
    );
  }, [
    maintenanceTypes,
    search,
  ]);

  const totalPages = Math.ceil(
  filteredTypes.length / ITEMS_PER_PAGE,
);

const paginatedTypes = useMemo(() => {
  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  return filteredTypes.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
}, [
  currentPage,
  filteredTypes,
]);

const firstVisibleItem =
  filteredTypes.length === 0
    ? 0
    : (currentPage - 1) *
        ITEMS_PER_PAGE +
      1;

const lastVisibleItem = Math.min(
  currentPage * ITEMS_PER_PAGE,
  filteredTypes.length,
);

  const openCreateModal = () => {
    setSelectedType(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (
    type: MaintenanceType,
  ) => {
    setSelectedType(type);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const openDeleteModal = (
    type: MaintenanceType,
  ) => {
    setSelectedType(type);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteOpen(false);
      setSelectedType(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedType) {
      return;
    }

    try {
      setIsDeleting(true);

      await maintenanceTypeService.delete(
        selectedType.id,
      );

      toast.success(
        "Maintenance type deleted successfully.",
      );

      setMaintenanceTypes(
        (currentTypes) =>
          currentTypes.filter(
            (type) =>
              type.id !==
              selectedType.id,
          ),
      );

      setIsDeleteOpen(false);
      setSelectedType(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const lastAvailablePage = Math.max(
      1,
      Math.ceil(
        filteredTypes.length /
          ITEMS_PER_PAGE,
      ),
    );

    setCurrentPage((page) =>
      Math.min(page, lastAvailablePage),
    );
  }, [filteredTypes.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const goToPage = () => {
    const requestedPage = Number(pageInput);
    const nextPage =
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= totalPages
        ? requestedPage
        : 1;

    setCurrentPage(nextPage);
    setPageInput(String(nextPage));
  };

  return (
    <>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-primary/8 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Service Catalog
              </div>

              <h2 className="font-display text-2xl font-extrabold text-text-main">
                Maintenance Types
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
                Create and manage the maintenance
                services available across your
                fleet.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_10px_30px_rgba(245,166,35,0.18)] transition hover:bg-primary-light"
            >
              <Plus size={18} />
              Add Type
            </button>
          </div>
        </section>

        {/* <section className="grid gap-4 sm:grid-cols-2">
          <article className="flex items-center gap-4 rounded-2xl border border-border-dark bg-surface/70 p-5">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Wrench size={23} />
            </div>

            <div>
              <p className="font-display text-2xl font-extrabold text-text-main">
                {maintenanceTypes.length}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Available service types
              </p>
            </div>
          </article>

          <article className="flex items-center gap-4 rounded-2xl border border-border-dark bg-surface/70 p-5">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-500/10 text-blue-400">
              <FileText size={23} />
            </div>

            <div>
              <p className="font-display text-2xl font-extrabold text-text-main">
                {
                  maintenanceTypes.filter(
                    (type) =>
                      Boolean(
                        type.description,
                      ),
                  ).length
                }
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Types with descriptions
              </p>
            </div>
          </article>
        </section> */}

        <section className="rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-border-dark p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="relative w-full sm:max-w-md">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                type="search"
                maxLength={100}
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search name or description..."
                className="h-11 w-full rounded-xl border border-border-dark bg-background/60 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                void loadMaintenanceTypes();
              }}
              disabled={isLoading}
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
              aria-label="Refresh maintenance types"
            >
              <RefreshCw
                size={18}
                className={
                  isLoading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-52 animate-pulse rounded-2xl bg-background/60"
                  />
                ))}
              </div>
            ) : errorMessage ? (
              <div className="grid min-h-80 place-items-center text-center">
                <div>
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
                    <AlertTriangle
                      size={27}
                    />
                  </div>

                  <h3 className="mt-4 font-display text-lg font-extrabold text-text-main">
                    Unable to load types
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      void loadMaintenanceTypes();
                    }}
                    className="mx-auto mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
                  >
                    <RefreshCw size={15} />
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredTypes.length ===
              0 ? (
              <div className="grid min-h-80 place-items-center text-center">
                <div>
                  <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Wrench size={30} />
                  </div>

                  <h3 className="mt-4 font-display text-xl font-extrabold text-text-main">
                    {search
                      ? "No matching types"
                      : "No maintenance types"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
                    {search
                      ? "Try using a different search term."
                      : "Create your first maintenance type to build the service catalog."}
                  </p>

                  {!search && (
                    <button
                      type="button"
                      onClick={
                        openCreateModal
                      }
                      className="mx-auto mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
                    >
                      <Plus size={15} />
                      Create First Type
                    </button>
                  )}
                </div>
              </div>
             ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedTypes.map(
                    (type) => (
                      <article
                        key={type.id}
                        className="group flex min-h-52 flex-col rounded-2xl border border-border-dark bg-background/45 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-black/15"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-background">
                            <Wrench size={20} />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(type)
                              }
                              className="grid size-9 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                              aria-label={`Edit ${type.name}`}
                            >
                              <Edit3 size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(
                                  type,
                                )
                              }
                              className="grid size-9 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-danger/30 hover:bg-danger/10 hover:text-danger"
                              aria-label={`Delete ${type.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 flex-1">
                          <h3 className="font-display text-base font-extrabold text-text-main">
                            {type.name}
                          </h3>

                          <p className="mt-2 line-clamp-3 text-xs leading-5 text-text-muted">
                            {type.description ||
                              "No description provided for this maintenance type."}
                          </p>
                        </div>

                        <div className="mt-4 border-t border-border-dark pt-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted/70">
                            Service ID #{type.id}
                          </p>
                        </div>
                      </article>
                    ),
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-border-dark pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-center text-xs text-text-muted sm:text-left">
                    Showing{" "}
                    <span className="font-bold text-text-main">
                      {firstVisibleItem}
                    </span>
                    {" – "}
                    <span className="font-bold text-text-main">
                      {lastVisibleItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-text-main">
                      {filteredTypes.length}
                    </span>{" "}
                    maintenance types
                  </p>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.max(
                                page - 1,
                                1,
                              ),
                          )
                        }
                        disabled={
                          currentPage === 1
                        }
                        className="grid size-8 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Previous page"
                      >
                        <ChevronLeft
                          size={10}
                        />
                      </button>

                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={pageInput}
                          onChange={(event) =>
                            setPageInput(
                              event.target.value,
                            )
                          }
                          onBlur={goToPage}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              goToPage();
                            }
                          }}
                          className="size-10 appearance-none rounded-xl border border-primary/35 bg-primary/10 text-center text-sm font-extrabold text-text-main outline-none transition hover:border-primary/60 focus:border-primary focus:bg-primary/15 focus:ring-4 focus:ring-primary/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          aria-label="Current page"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage(
                            (page) =>
                              Math.min(
                                page + 1,
                                totalPages,
                              ),
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        className="grid size-8 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label="Next page"
                      >
                        <ChevronRight
                          size={10}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <MaintenanceTypeFormModal
        isOpen={isFormOpen}
        mode={formMode}
        maintenanceType={selectedType}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedType(null);
        }}
        onSaved={() => {
          void loadMaintenanceTypes();
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        isDeleting={isDeleting}
        title="Delete maintenance type?"
        description={
          selectedType
            ? `You are about to permanently delete “${selectedType.name}”.`
            : ""
        }
        warning="The type cannot be deleted if it is linked to existing maintenance records."
        onClose={closeDeleteModal}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </>
  );
}