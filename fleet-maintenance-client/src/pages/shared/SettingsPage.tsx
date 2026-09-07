import { motion } from "framer-motion";

import {
  CalendarDays,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
  ReactNode,
} from "react";

import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

import { profileService } from "../../services/profileService";

import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

import type {
  UserProfile,
} from "../../types/profile";

interface ProfileForm {
  fullName: string;
  phoneNumber: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ProfileErrors {
  fullName?: string;
  phoneNumber?: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const emptyPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const dateFormatter =
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function SettingsPage() {
  const { updateUser } = useAuth();

  const [
    profile,
    setProfile,
  ] = useState<UserProfile | null>(null);

  const [
    profileForm,
    setProfileForm,
  ] = useState<ProfileForm>({
    fullName: "",
    phoneNumber: "",
  });

  const [
    passwordForm,
    setPasswordForm,
  ] = useState<PasswordForm>(
    emptyPasswordForm,
  );

  const [
    profileErrors,
    setProfileErrors,
  ] = useState<ProfileErrors>({});

  const [
    passwordErrors,
    setPasswordErrors,
  ] = useState<PasswordErrors>({});

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSavingProfile,
    setIsSavingProfile,
  ] = useState(false);

  const [
    isChangingPassword,
    setIsChangingPassword,
  ] = useState(false);

  const [
    loadError,
    setLoadError,
  ] = useState<string | null>(null);

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const loadProfile =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const result =
          await profileService.getProfile();

        setProfile(result);

        setProfileForm({
          fullName: result.fullName,
          phoneNumber:
            result.phoneNumber ?? "",
        });
      } catch (error) {
        setLoadError(
          getApiErrorMessage(error),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateProfileValue = (
    field: keyof ProfileForm,
    value: string,
  ) => {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));

    setProfileErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const updatePasswordValue = (
    field: keyof PasswordForm,
    value: string,
  ) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validateProfile = () => {
    const nextErrors: ProfileErrors = {};
    const fullName =
      profileForm.fullName.trim();

    const phoneNumber =
      profileForm.phoneNumber.trim();

    if (!fullName) {
      nextErrors.fullName =
        "Full name is required.";
    } else if (fullName.length > 100) {
      nextErrors.fullName =
        "Full name cannot exceed 100 characters.";
    }

    if (
      phoneNumber &&
      !/^\+?[1-9]\d{7,14}$/.test(
        phoneNumber,
      )
    ) {
      nextErrors.phoneNumber =
        "Enter a valid number such as +962791234567.";
    }

    setProfileErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const validatePassword = () => {
    const nextErrors: PasswordErrors = {};

    if (!passwordForm.currentPassword) {
      nextErrors.currentPassword =
        "Current password is required.";
    }

    if (!passwordForm.newPassword) {
      nextErrors.newPassword =
        "New password is required.";
    } else if (
      passwordForm.newPassword.length < 8
    ) {
      nextErrors.newPassword =
        "Password must contain at least 8 characters.";
    } else if (
      !/[A-Z]/.test(
        passwordForm.newPassword,
      ) ||
      !/[a-z]/.test(
        passwordForm.newPassword,
      ) ||
      !/[0-9]/.test(
        passwordForm.newPassword,
      )
    ) {
      nextErrors.newPassword =
        "Use uppercase, lowercase, and a number.";
    } else if (
      passwordForm.newPassword ===
      passwordForm.currentPassword
    ) {
      nextErrors.newPassword =
        "New password must be different.";
    }

    if (
      !passwordForm.confirmNewPassword
    ) {
      nextErrors.confirmNewPassword =
        "Please confirm your new password.";
    } else if (
      passwordForm.confirmNewPassword !==
      passwordForm.newPassword
    ) {
      nextErrors.confirmNewPassword =
        "New passwords do not match.";
    }

    setPasswordErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleProfileSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validateProfile()) {
      return;
    }

    try {
      setIsSavingProfile(true);

      const updatedProfile =
        await profileService.updateProfile({
          fullName:
            profileForm.fullName.trim(),

          phoneNumber:
            profileForm.phoneNumber.trim(),
        });

      setProfile(updatedProfile);

      setProfileForm({
        fullName:
          updatedProfile.fullName,

        phoneNumber:
          updatedProfile.phoneNumber ?? "",
      });

      updateUser({
        fullName:
          updatedProfile.fullName,

        email:
          updatedProfile.email,
      });

      toast.success(
        "Profile updated successfully.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      setIsChangingPassword(true);

      await profileService.changePassword({
        currentPassword:
          passwordForm.currentPassword,

        newPassword:
          passwordForm.newPassword,

        confirmNewPassword:
          passwordForm.confirmNewPassword,
      });

      setPasswordForm(
        emptyPasswordForm,
      );

      setPasswordErrors({});

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast.success(
        "Password changed successfully.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <SettingsLoadingState />;
  }

  if (loadError || !profile) {
    return (
      <SettingsErrorState
        message={
          loadError ??
          "Unable to load profile."
        }
        onRetry={() => {
          void loadProfile();
        }}
      />
    );
  }

  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const joinedDate =
    dateFormatter.format(
      new Date(profile.createdAt),
    );

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border-dark bg-surface/70 p-4 backdrop-blur-xl sm:p-6"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="grid size-16 shrink-0 place-items-center rounded-3xl border border-primary/25 bg-primary/10 font-display text-xl font-black text-primary shadow-lg shadow-primary/10">
            {initials || "FN"}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl font-black text-text-main sm:text-2xl">
              {profile.fullName}
            </h1>

            <p className="mt-1 truncate text-sm text-text-muted">
              {profile.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary"
                >
                  {role}
                </span>
              ))}

              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-dark bg-background/50 px-3 py-1 text-[10px] font-bold text-text-muted">
                <CalendarDays size={12} />
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onSubmit={handleProfileSubmit}
          className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl"
        >
          <SectionHeader
            title="Personal Information"
            description="Manage your name, and account information."
          />

          <div className="space-y-5 p-5 sm:p-6">
            <FormField
              label="Full name"
              error={profileErrors.fullName}
              required
            >
              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="text"
                  maxLength={100}
                  value={profileForm.fullName}
                  onChange={(event) =>
                    updateProfileValue(
                      "fullName",
                      event.target.value,
                    )
                  }
                  className={`${getInputClass(
                    Boolean(
                      profileErrors.fullName,
                    ),
                  )} pl-11`}
                />
              </div>
            </FormField>

            <FormField
              label="Email address"
              hint="Email address cannot be changed"
            >
              <div className="relative">
                <Mail
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-border-dark bg-background/30 pl-11 pr-4 text-sm text-text-muted opacity-70"
                />
              </div>
            </FormField>

            <FormField
              label="Phone number"
              hint="Optional"
              error={
                profileErrors.phoneNumber
              }
            >
              <div className="relative">
                <Phone
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="tel"
                  maxLength={16}
                  value={
                    profileForm.phoneNumber
                  }
                  onChange={(event) =>
                    updateProfileValue(
                      "phoneNumber",
                      event.target.value,
                    )
                  }
                  placeholder="+962791234567"
                  className={`${getInputClass(
                    Boolean(
                      profileErrors.phoneNumber,
                    ),
                  )} pl-11`}
                />
              </div>
            </FormField>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs leading-5 text-text-muted">
              You must use the international format.
            </div>
          </div>

          <footer className="flex justify-end border-t border-border-dark bg-background/20 p-5 sm:p-6">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSavingProfile ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                </>
              )}
            </button>
          </footer>
        </motion.form>

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          onSubmit={handlePasswordSubmit}
          className="overflow-hidden rounded-2xl border border-border-dark bg-surface/70 backdrop-blur-xl"
        >
          <SectionHeader
            title="Password"
            description="Update your password to keep your account secure."
          />

          <div className="space-y-5 p-5 sm:p-6">
            <PasswordField
              label="Current password"
              value={
                passwordForm.currentPassword
              }
              error={
                passwordErrors.currentPassword
              }
              visible={showCurrentPassword}
              onToggle={() =>
                setShowCurrentPassword(
                  (current) => !current,
                )
              }
              onChange={(value) =>
                updatePasswordValue(
                  "currentPassword",
                  value,
                )
              }
            />

            <PasswordField
              label="New password"
              value={passwordForm.newPassword}
              error={
                passwordErrors.newPassword
              }
              visible={showNewPassword}
              onToggle={() =>
                setShowNewPassword(
                  (current) => !current,
                )
              }
              onChange={(value) =>
                updatePasswordValue(
                  "newPassword",
                  value,
                )
              }
            />

            <PasswordField
              label="Confirm new password"
              value={
                passwordForm.confirmNewPassword
              }
              error={
                passwordErrors.confirmNewPassword
              }
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword(
                  (current) => !current,
                )
              }
              onChange={(value) =>
                updatePasswordValue(
                  "confirmNewPassword",
                  value,
                )
              }
            />

            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs leading-5 text-text-muted">
                Your password must have at
                least 8 characters, including
                uppercase, lowercase, and a
                number.
              </p>
            </div>
          </div>

          <footer className="flex justify-end border-t border-border-dark bg-background/20 p-5 sm:p-6">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isChangingPassword ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Updating...
                </>
              ) : (
                <>
                  Update Password
                </>
              )}
            </button>
          </footer>
        </motion.form>
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <header className="border-b border-border-dark p-5 sm:p-6">
      <div>
        {eyebrow && (
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}

        <h2 className="font-display text-lg font-black text-text-main">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-text-muted">
          {description}
        </p>
      </div>
    </header>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

function FormField({
  label,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-text-main">
          {label}

          {required && (
            <span className="ml-1 text-danger">
              *
            </span>
          )}
        </span>

        {hint && (
          <span className="text-[10px] text-text-muted">
            {hint}
          </span>
        )}
      </div>

      {children}

      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-danger">
          {error}
        </p>
      )}
    </label>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  error?: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}

function PasswordField({
  label,
  value,
  error,
  visible,
  onToggle,
  onChange,
}: PasswordFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      required
    >
      <div className="relative">
        <KeyRound
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          autoComplete={
            label === "Current password"
              ? "current-password"
              : "new-password"
          }
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`${getInputClass(
            Boolean(error),
          )} pl-11 pr-11`}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-text-muted transition hover:text-primary"
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </FormField>
  );
}

function getInputClass(
  hasError: boolean,
) {
  return `h-11 w-full rounded-xl border bg-background/60 px-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/50 ${
    hasError
      ? "border-danger/60 focus:ring-4 focus:ring-danger/10"
      : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
  }`;
}

function SettingsLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-52 rounded-3xl border border-border-dark bg-surface/70" />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-[560px] rounded-2xl border border-border-dark bg-surface/70" />
        <div className="h-[560px] rounded-2xl border border-border-dark bg-surface/70" />
      </div>
    </div>
  );
}

interface SettingsErrorStateProps {
  message: string;
  onRetry: () => void;
}

function SettingsErrorState({
  message,
  onRetry,
}: SettingsErrorStateProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-danger/20 bg-danger/5 p-6 text-center">
      <UserRound
        size={32}
        className="text-danger"
      />

      <h2 className="mt-4 font-display text-xl font-black text-text-main">
        Unable to load settings
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-text-muted">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 h-10 rounded-xl bg-primary px-5 text-xs font-extrabold text-background"
      >
        Try Again
      </button>
    </div>
  );
}