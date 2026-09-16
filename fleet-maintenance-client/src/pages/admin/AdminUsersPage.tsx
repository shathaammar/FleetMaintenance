import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FilterX,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import type { PagedResult } from "../../types/api";
import type { UserRole } from "../../types/auth";
import type { User } from "../../types/user";
import { formatDate } from "../../utils/formatDate";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const PAGE_SIZE = 10;

const initialResult:
  PagedResult<User> = {
    items: [],
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalCount: 0,
    totalPages: 0,
  };

const ROLE_OPTIONS: UserRole[] = [
  "Admin",
  "User",
];

export function AdminUsersPage() {
  const {
    user: currentUser,
  } = useAuth();

  const [
    result,
    setResult,
  ] = useState<PagedResult<User>>(
    initialResult,
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    pageNumber,
    setPageNumber,
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
    selectedUser,
    setSelectedUser,
  ] = useState<User | null>(null);

  const [
    isRoleModalOpen,
    setIsRoleModalOpen,
  ] = useState(false);

  const pageSize = PAGE_SIZE;

  const loadUsers = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data =
          await userService.getUsers({
            search:
              search.trim() || undefined,

            pageNumber,
            pageSize,
          });

        setResult(data);
      } catch (error) {
        setErrorMessage(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      search,
      pageNumber,
    ],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        void loadUsers();
      },
      350,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadUsers]);

  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  const goToPage = () => {
    const requestedPage = Number(pageInput);
    const totalPages = Math.max(
      result.totalPages,
      1,
    );
    const nextPage =
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= totalPages
        ? requestedPage
        : 1;

    setPageNumber(nextPage);
    setPageInput(String(nextPage));
  };

  const openRoleModal = (
    targetUser: User,
  ) => {
    setSelectedUser(targetUser);
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChanged = (
    updatedUser: User,
  ) => {
    setResult((current) => ({
      ...current,
      items: current.items.map(
        (item) =>
          item.id === updatedUser.id
            ? updatedUser
            : item,
      ),
    }));

    closeRoleModal();
  };

  const clearFilters = () => {
    setSearch("");
    setPageNumber(1);
  };

  const hasActiveFilters = Boolean(
    search.trim(),
  );

  const startItem =
    result.totalCount === 0
      ? 0
      : (result.pageNumber - 1) *
          result.pageSize +
        1;

  const endItem = Math.min(
    result.pageNumber * result.pageSize,
    result.totalCount,
  );

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-border-dark bg-surface/70 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Access Control
            </div>

            <h2 className="font-display text-2xl font-extrabold text-text-main">
              User Management
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              Review registered accounts and
              manage administrator access.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl">
          <div className="flex flex-col gap-3 border-b border-border-dark p-4 sm:flex-row sm:items-start sm:p-5">
            <div className="flex-1">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="search"
                  maxLength={100}
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value,
                    );

                    setPageNumber(1);
                  }}
                  placeholder="Search by name or email"
                  className="h-11 w-full rounded-xl border border-border-dark bg-background/60 pl-11 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55 focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl border border-border-dark px-3 text-xs font-bold text-text-muted transition hover:border-primary/30 hover:text-primary"
                >
                  <FilterX size={15} />
                  Clear all filters
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                void loadUsers();
              }}
              disabled={isLoading}
              aria-label="Refresh users"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-dark bg-background/60 text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
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

          {isLoading ? (
            <LoadingState />
          ) : errorMessage ? (
            <ErrorState
              message={errorMessage}
              onRetry={() => {
                void loadUsers();
              }}
            />
          ) : result.items.length === 0 ? (
            <EmptyState
              hasSearch={hasActiveFilters}
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-border-dark text-[10px] uppercase tracking-wider text-text-muted">
                      <th className="px-6 py-4 font-bold">
                        Name
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Email
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Role
                      </th>

                      <th className="px-4 py-4 font-bold">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right font-bold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.items.map(
                      (item) => {
                        const isCurrentUser =
                          currentUser?.userId ===
                          item.id;

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-border-dark/70 transition last:border-0 hover:bg-surface-light/40"
                          >
                            <td className="px-6 py-4">
                              <p className="font-bold text-text-main">
                                {
                                  item.fullName
                                }
                              </p>

                              {isCurrentUser && (
                                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                                  You
                                </p>
                              )}
                            </td>

                            <td className="px-4 py-4 text-sm text-text-muted">
                              {item.email}
                            </td>

                            <td className="px-4 py-4">
                              <RoleBadges
                                roles={
                                  item.roles
                                }
                              />
                            </td>

                            <td className="px-4 py-4 text-sm text-text-muted">
                              {formatDate(
                                item.createdAt,
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  openRoleModal(
                                    item,
                                  )
                                }
                                disabled={
                                  isCurrentUser
                                }
                                title={
                                  isCurrentUser
                                    ? "You cannot change your own role."
                                    : undefined
                                }
                                className="inline-flex h-9 items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 text-xs font-extrabold text-primary transition hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary/10 disabled:hover:text-primary"
                              >
                                <ShieldCheck
                                  size={15}
                                />
                                Change Role
                              </button>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 p-4 lg:hidden">
                {result.items.map(
                  (item) => {
                    const isCurrentUser =
                      currentUser?.userId ===
                      item.id;

                    return (
                      <article
                        key={item.id}
                        className="rounded-2xl border border-border-dark bg-background/40 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-display text-base font-extrabold text-text-main">
                              {
                                item.fullName
                              }
                            </p>

                            <p className="mt-1 truncate text-xs text-text-muted">
                              {item.email}
                            </p>
                          </div>

                          <RoleBadges
                            roles={
                              item.roles
                            }
                          />
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border-dark pt-4">
                          <p className="text-xs text-text-muted">
                            Joined{" "}
                            {formatDate(
                              item.createdAt,
                            )}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              openRoleModal(
                                item,
                              )
                            }
                            disabled={
                              isCurrentUser
                            }
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 text-xs font-extrabold text-primary transition hover:bg-primary hover:text-background disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <ShieldCheck
                              size={15}
                            />
                            {isCurrentUser
                              ? "This is you"
                              : "Change Role"}
                          </button>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>

              <footer className="flex flex-col items-center justify-between gap-3 border-t border-border-dark p-4 text-center sm:flex-row sm:px-6 sm:text-left">
                <p className="text-xs text-text-muted">
                  Showing{" "}
                  <span className="font-bold text-text-main">
                    {startItem}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-text-main">
                    {endItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-text-main">
                    {result.totalCount}
                  </span>{" "}
                  users
                </p>

                <div className="flex max-w-full items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={
                      pageNumber <= 1
                    }
                    onClick={() =>
                      setPageNumber(
                        (current) =>
                          current - 1,
                      )
                    }
                    className="grid size-7 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Previous page"
                  >
                    <ChevronLeft
                      size={10}
                    />
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={Math.max(
                      result.totalPages,
                      1,
                    )}
                    value={pageInput}
                    onChange={(event) =>
                      setPageInput(
                        event.target.value,
                      )
                    }
                    onBlur={goToPage}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        goToPage();
                      }
                    }}
                    className="size-9 appearance-none rounded-xl border border-primary/35 bg-primary/10 text-center text-sm font-extrabold text-text-main outline-none transition hover:border-primary/60 focus:border-primary focus:bg-primary/15 focus:ring-4 focus:ring-primary/10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    aria-label="Current page"
                  />

                  <button
                    type="button"
                    disabled={
                      pageNumber >=
                      result.totalPages
                    }
                    onClick={() =>
                      setPageNumber(
                        (current) =>
                          current + 1,
                      )
                    }
                    className="grid size-7 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Next page"
                  >
                    <ChevronRight
                      size={10}
                    />
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>

      <ChangeRoleModal
        isOpen={isRoleModalOpen}
        targetUser={selectedUser}
        onClose={closeRoleModal}
        onChanged={handleRoleChanged}
      />
    </>
  );
}

interface RoleBadgesProps {
  roles: UserRole[];
}

function RoleBadges({
  roles,
}: RoleBadgesProps) {
  if (roles.length === 0) {
    return (
      <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400">
        No role
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {roles.map((role) => (
        <span
          key={role}
          className={`rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
            role === "Admin"
              ? "border-primary/25 bg-primary/10 text-primary"
              : "border-border-dark bg-background/50 text-text-muted"
          }`}
        >
          {role}
        </span>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3 p-4 sm:p-5">
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-2xl bg-background/40"
          />
        ),
      )}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="grid place-items-center p-10 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-danger/10 text-danger">
          <AlertTriangle size={26} />
        </div>

        <h3 className="mt-4 font-display text-base font-extrabold text-text-main">
          Unable to load users
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-5 flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-background"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  hasSearch: boolean;
}

function EmptyState({
  hasSearch,
}: EmptyStateProps) {
  return (
    <div className="grid place-items-center p-10 text-center">
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-background/50 text-text-muted">
          <UserRound size={26} />
        </div>

        <h3 className="mt-4 font-display text-base font-extrabold text-text-main">
          {hasSearch
            ? "No matching users"
            : "No users found"}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-text-muted">
          {hasSearch
            ? "Try changing the search term."
            : "Registered accounts will appear here."}
        </p>
      </div>
    </div>
  );
}

interface ChangeRoleModalProps {
  isOpen: boolean;
  targetUser: User | null;
  onClose: () => void;
  onChanged: (updatedUser: User) => void;
}

function ChangeRoleModal({
  isOpen,
  targetUser,
  onClose,
  onChanged,
}: ChangeRoleModalProps) {
  const currentRole: UserRole | null =
    targetUser
      ? targetUser.roles.includes(
          "Admin",
        )
        ? "Admin"
        : targetUser.roles.includes(
              "User",
            )
          ? "User"
          : null
      : null;

  const [
    selectedRole,
    setSelectedRole,
  ] = useState<UserRole>("User");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen || !targetUser) {
      return;
    }

    setSelectedRole(
      currentRole ?? "User",
    );
  }, [
    isOpen,
    targetUser,
    currentRole,
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

  if (!isOpen || !targetUser) {
    return null;
  }

  const hasChanged =
    currentRole === null
      ? true
      : selectedRole !== currentRole;

  const handleConfirm = async () => {
    if (!hasChanged) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedUser =
        await userService.updateRole(
          targetUser.id,
          { role: selectedRole },
        );

      toast.success(
        `${updatedUser.fullName}'s role was updated to ${selectedRole}.`,
      );

      onChanged(updatedUser);
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
        aria-label="Close role change modal"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-role-title"
        className="relative my-auto w-full max-w-md overflow-hidden rounded-3xl border border-border-dark bg-surface shadow-2xl shadow-black/40"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border-dark p-5 sm:p-6">
          <div className="flex min-w-0 gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                Role Change
              </p>

              <h2
                id="change-role-title"
                className="mt-1 font-display text-xl font-extrabold text-text-main"
              >
                Update User Role
              </h2>

              <p className="mt-1 truncate text-xs leading-5 text-text-muted">
                {targetUser.fullName}
                {" · "}
                {targetUser.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-border-dark text-text-muted transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="relative p-5 sm:p-6">
          <p className="text-xs font-bold text-text-main">
            Select a role
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() =>
                  setSelectedRole(role)
                }
                disabled={isSubmitting}
                className={`h-11 rounded-xl border text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  selectedRole === role
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border-dark text-text-muted hover:border-primary/30 hover:text-text-main"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {currentRole === null ? (
            <div className="mt-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-3">
              <p className="text-xs leading-5 text-text-muted">
                This account currently has
                no assigned role.{" "}
                <span className="font-bold text-primary">
                  {selectedRole}
                </span>{" "}
                will be assigned.
              </p>
            </div>
          ) : (
            hasChanged && (
              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs leading-5 text-text-muted">
                  {targetUser.fullName}{" "}
                  will be changed from{" "}
                  <span className="font-bold text-text-main">
                    {currentRole}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-primary">
                    {selectedRole}
                  </span>
                  .
                </p>
              </div>
            )
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 rounded-xl border border-border-dark text-sm font-bold text-text-muted transition hover:border-primary/30 hover:text-text-main disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                void handleConfirm();
              }}
              disabled={
                isSubmitting ||
                !hasChanged
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                "Confirm Change"
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}