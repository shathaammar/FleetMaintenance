import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";

import fleetNovaLogo from "../../assets/FleetNove-Logo.png";
import loginHero from "../../assets/login-hero.png";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(
      6,
      "Password must contain at least 6 characters.",
    ),
});

type LoginFormData = z.infer<
  typeof loginSchema
>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    try {
      const user = await login(data);

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
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[420px] rounded-full bg-primary/8 blur-[130px]" />

      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative z-10 flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
          <header className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                navigate(ROUTES.HOME)
              }
              className="flex items-center gap-3"
            >
              <div className="grid size-12 place-items-center overflow-hidden rounded-2xl border border-primary/20 bg-surface-light shadow-[0_10px_35px_rgba(245,166,35,0.16)]">
                <img
                  src={fleetNovaLogo}
                  alt="FleetNova logo"
                  className="size-full object-contain p-1.5"
                />
              </div>

              <div className="text-left">
                <p className="font-display text-xl font-extrabold tracking-tight text-text-main">
                  Fleet
                  <span className="text-primary">
                    Nova
                  </span>
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Smart Fleet Management
                </p>
              </div>
            </button>
          </header>

          <div className="flex flex-1 items-center justify-center py-12">
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
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary">
                  Welcome back!
                </div>

                <h1 className="font-display text-4xl font-extrabold leading-tight text-text-main sm:text-5xl">
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
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={[
                        "h-13 w-full rounded-xl border bg-surface/80 pl-12 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted/55",
                        errors.email
                          ? "border-danger focus:ring-4 focus:ring-danger/5"
                          : "border-border-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5",
                      ].join(" ")}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs font-medium text-danger">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold text-text-main"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
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
                      {...register("password")}
                      className={[
                        "h-13 w-full rounded-xl border bg-surface/80 pl-12 pr-12 text-sm text-text-main outline-none transition placeholder:text-text-muted/55",
                        errors.password
                          ? "border-danger focus:ring-4 focus:ring-danger/5"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-primary"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs font-medium text-danger">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-extrabold text-background shadow-[0_12px_35px_rgba(245,166,35,0.2)] transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={19}
                        className="animate-spin"
                      />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          <footer className="text-center text-[11px] text-text-muted/70">
            © 2026 FleetNova. Smart fleet
            maintenance and management.
          </footer>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden lg:block">
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
            }}
            className="absolute bottom-12 left-12 right-12 rounded-3xl border border-white/10 bg-background/45 p-7 backdrop-blur-xl xl:bottom-16 xl:left-16 xl:right-16"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Built for performance
            </p>

            <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight text-white xl:text-4xl">
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