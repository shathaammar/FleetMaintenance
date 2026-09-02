import { zodResolver, } from "@hookform/resolvers/zod";
import { motion, } from "framer-motion";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState, } from "react";
import { useForm, } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, } from "react-router-dom";
import { z, } from "zod";

import fleetNovaLogo from "../../assets/FleetNove-Logo.png";
import loginHero from "../../assets/login-hero.png";
import { ROUTES, } from "../../constants/routes";
import { useAuth, } from "../../hooks/useAuth";
import { getApiErrorMessage, } from "../../utils/getApiErrorMessage";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(
      1,
      "Email is required.",
    )
    .email(
      "Enter a valid email address.",
    ),

  password: z
    .string()
    .min(
      1,
      "Password is required.",
    )
    .min(
      6,
      "Password must contain at least 6 characters.",
    ),
});

type LoginFormData = z.infer<
  typeof loginSchema
>;

export function LoginPage() {
  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver:
      zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    try {
      const user =
        await login(data);

      toast.success(
        `Welcome back, ${user.fullName}!`,
      );

      if (user.role === "Admin") {
        navigate(
          ROUTES.ADMIN.DASHBOARD,
          {
            replace: true,
          },
        );

        return;
      }

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
    <main className="relative min-h-dvh overflow-x-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-[420px] rounded-full bg-primary/8 blur-[130px]" />

      <div className="grid min-h-dvh lg:grid-cols-[0.92fr_1.08fr]">
        {/* Login section */}
        <section className="relative z-10 flex min-h-dvh min-w-0 flex-col px-4 py-5 sm:px-8 sm:py-6 md:px-10 lg:px-12 xl:px-20">
          {/* Logo */}
          <header className="flex shrink-0 items-center justify-between">
            <button
              type="button"
              onClick={() => {
                navigate(
                  ROUTES.HOME,
                );
              }}
              className="flex min-w-0 items-center gap-3 text-left"
              aria-label="Go to FleetNova home"
            >
              <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-primary/20 bg-surface-light shadow-[0_10px_35px_rgba(245,166,35,0.16)] sm:size-12 sm:rounded-2xl">
                <img
                  src={fleetNovaLogo}
                  alt="FleetNova logo"
                  className="size-full object-contain p-1.5"
                />
              </div>

              <div className="min-w-0">
                <p className="whitespace-nowrap font-display text-lg font-extrabold tracking-tight text-text-main sm:text-xl">
                  Fleet
                  <span className="text-primary">
                    Nova
                  </span>
                </p>

                <p className="whitespace-nowrap text-[7px] font-bold uppercase tracking-[0.14em] text-text-muted sm:text-[8px] sm:tracking-[0.18em]">
                  Smart Fleet Management
                </p>
              </div>
            </button>
          </header>

          {/* Form container */}
          <div className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:py-12">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              className="w-full max-w-md"
            >
              <div className="mb-7 sm:mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary">
                  Welcome back!
                </div>

                <h1 className="font-display text-3xl font-extrabold leading-tight text-text-main sm:text-4xl xl:text-5xl">
                  Ready to keep

                  <span className="block text-primary">
                    your fleet moving?
                  </span>
                </h1>

                <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">
                  Sign in to monitor vehicles,
                  manage maintenance and review
                  service requests.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(
                  onSubmit,
                )}
                noValidate
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                      aria-hidden="true"
                    />

                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="name@example.com"
                      {...register(
                        "email",
                      )}
                      aria-invalid={
                        errors.email
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        errors.email
                          ? "email-error"
                          : undefined
                      }
                      className={[
                        "h-13 w-full rounded-xl border bg-surface/80 pl-12 pr-4 text-base text-text-main outline-none transition placeholder:text-text-muted/55 sm:text-sm",
                        errors.email
                          ? "border-danger focus:ring-4 focus:ring-danger/5"
                          : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                      ].join(" ")}
                    />
                  </div>

                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-2 text-xs font-medium leading-5 text-danger"
                    >
                      {
                        errors.email
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-bold text-text-main"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                      aria-hidden="true"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register(
                        "password",
                      )}
                      aria-invalid={
                        errors.password
                          ? "true"
                          : "false"
                      }
                      aria-describedby={
                        errors.password
                          ? "password-error"
                          : undefined
                      }
                      className={[
                        "h-13 w-full rounded-xl border bg-surface/80 pl-12 pr-12 text-base text-text-main outline-none transition placeholder:text-text-muted/55 sm:text-sm",
                        errors.password
                          ? "border-danger focus:ring-4 focus:ring-danger/5"
                          : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                      ].join(" ")}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword(
                          (currentValue) =>
                            !currentValue,
                        );
                      }}
                      className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-text-muted transition hover:bg-surface-light hover:text-primary"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={
                        showPassword
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                        />
                      ) : (
                        <Eye
                          size={18}
                        />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-2 text-xs font-medium leading-5 text-danger"
                    >
                      {
                        errors.password
                          .message
                      }
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_12px_35px_rgba(245,166,35,0.2)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {isSubmitting
                    ? "Signing in..."
                    : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-text-muted">
                New to FleetNova?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-bold text-primary transition hover:text-primary-light underline"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Copyright */}
          <footer className="shrink-0 text-center text-[11px] leading-5 text-text-muted/70">
            © 2026 FleetNova. Smart fleet
            maintenance and management.
          </footer>
        </section>

        {/* Hero section */}
        <section className="relative hidden min-h-dvh overflow-hidden lg:block">
          <img
            src={loginHero}
            alt="Modern vehicle maintenance facility"
            className="absolute inset-0 size-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/10 bg-background/45 p-6 backdrop-blur-xl xl:bottom-16 xl:left-16 xl:right-16 xl:p-7"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Built for performance
            </p>

            <h2 className="max-w-xl font-display text-2xl font-extrabold leading-tight text-white xl:text-4xl">
              Every vehicle. Every service.

              <span className="block text-primary">
                One intelligent platform.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/65">
              Stay ahead of maintenance, reduce
              downtime and make confident fleet
              decisions.
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
}