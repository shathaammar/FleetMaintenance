import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, } from "react-router-dom";
import { z } from "zod";

import fleetNovaLogo from "../../assets/FleetNove-Logo.png";
import loginHero from "../../assets/login-hero.png";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .max(
        100,
        "Full name cannot exceed 100 characters.",
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email(
        "A valid email address is required.",
      )
      .max(
        256,
        "Email cannot exceed 256 characters.",
      ),

    password: z
      .string()
      .min(1, "Password is required.")
      .min(
        8,
        "Password must contain at least 8 characters.",
      )
      .regex(
        /[A-Z]/,
        "Password must contain an uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "Password must contain a lowercase letter.",
      )
      .regex(
        /[0-9]/,
        "Password must contain a number.",
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Please confirm your password.",
      ),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

type RegisterFormData = z.infer<
  typeof registerSchema
>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: createAccount } =
    useAuth();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormData>({
    resolver:
      zodResolver(registerSchema),

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password =
    watch("password") ?? "";

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(password),
    },
  ];

  const onSubmit = async (
    data: RegisterFormData,
  ) => {
    try {
      await createAccount({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword:
          data.confirmPassword,
      });

      toast.success(
        "Your account was created successfully.",
      );

      navigate(
        ROUTES.USER.DASHBOARD,
        {
          replace: true,
        },
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-screen overflow-hidden lg:block">
          <img
            src={loginHero}
            alt="FleetNova vehicle facility"
            className="absolute inset-0 size-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/15 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/30" />

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
            }}
            className="absolute bottom-12 left-12 right-12 rounded-3xl border border-white/10 bg-background/45 p-7 backdrop-blur-xl xl:bottom-16 xl:left-16 xl:right-16"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Start smarter
            </p>

            <h1 className="mt-3 max-w-xl font-display text-3xl font-extrabold leading-tight text-white xl:text-4xl">
              Your fleet deserves
              <span className="block text-primary">
                intelligent care.
              </span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/65">
              Track maintenance, reduce downtime
              and keep every vehicle ready for
              the road.
            </p>
          </motion.div>
        </section>

        <section className="relative flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-16">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-primary/8 blur-[130px]" />

          <header className="relative z-10 flex items-center justify-between">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3"
            >
              <div className="grid size-12 place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-surface-light">
                <img
                  src={fleetNovaLogo}
                  alt="FleetNova logo"
                  className="size-full object-contain p-1.5"
                />
              </div>

              <div>
                <p className="font-display text-xl font-extrabold text-text-main">
                  Fleet
                  <span className="text-primary">
                    Nova
                  </span>
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Smart Fleet Management
                </p>
              </div>
            </Link>
          </header>

          <div className="relative z-10 flex flex-1 items-center justify-center py-10">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="w-full max-w-lg"
            >
              <div className="mb-7">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Create your account
                </p>

                <h2 className="font-display text-3xl font-extrabold text-text-main sm:text-4xl">
                  Join FleetNova
                </h2>

                <p className="mt-3 text-sm leading-6 text-text-muted">
                  Create your user account and
                  start managing maintenance
                  requests.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(
                  onSubmit,
                )}
                noValidate
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      id="fullName"
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      {...register("fullName")}
                      className={[
                        "h-12 w-full rounded-xl border bg-surface/80 pl-12 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/50",
                        errors.fullName
                          ? "border-danger"
                          : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                      ].join(" ")}
                    />
                  </div>

                  {errors.fullName && (
                    <p className="mt-2 text-xs text-danger">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="registerEmail"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                    />

                    <input
                      id="registerEmail"
                      type="email"
                      maxLength={256}
                      autoComplete="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={[
                        "h-12 w-full rounded-xl border bg-surface/80 pl-12 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/50",
                        errors.email
                          ? "border-danger"
                          : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                      ].join(" ")}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs text-danger">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="registerPassword"
                      className="mb-2 block text-xs font-bold text-text-main"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                      />

                      <input
                        id="registerPassword"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        placeholder="Password"
                        {...register("password")}
                        className={[
                          "h-12 w-full rounded-xl border bg-surface/80 pl-12 pr-11 text-sm text-text-main outline-none transition placeholder:text-text-muted/50",
                          errors.password
                            ? "border-danger"
                            : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                        ].join(" ")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-xs font-bold text-text-main"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                      />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        placeholder="Confirm"
                        {...register(
                          "confirmPassword",
                        )}
                        className={[
                          "h-12 w-full rounded-xl border bg-surface/80 pl-12 pr-11 text-sm text-text-main outline-none transition placeholder:text-text-muted/50",
                          errors.confirmPassword
                            ? "border-danger"
                            : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                        ].join(" ")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {(errors.password ||
                  errors.confirmPassword) && (
                  <p className="text-xs text-danger">
                    {errors.confirmPassword
                      ?.message ??
                      errors.password?.message}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 rounded-xl border border-border-dark bg-surface/55 p-3">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={[
                        "flex items-center gap-1.5 text-[10px]",
                        rule.valid
                          ? "text-emerald-400"
                          : "text-text-muted",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid size-4 shrink-0 place-items-center rounded-full border",
                          rule.valid
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-border-dark",
                        ].join(" ")}
                      >
                        {rule.valid && (
                          <Check size={10} />
                        )}
                      </span>

                      {rule.label}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-text-muted">
                  Already have an account?{" "}
                  <Link
                    to={ROUTES.LOGIN}
                    className="font-bold text-primary underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>

          <footer className="relative z-10 text-center text-[11px] text-text-muted/70">
            © 2026 FleetNova. Smart fleet
            maintenance and management.
          </footer>
        </section>
      </div>
    </main>
  );
}