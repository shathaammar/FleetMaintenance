import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  UserRound,
  UsersRound,
  Wrench,
  X,
  CarFront,
  CalendarClock,
  DollarSign,
  History,
} from "lucide-react";

import { useState } from "react";

import { Link } from "react-router-dom";

import fleetNovaLogo from "../../assets/FleetNova-Logo.png";
import heroImage from "../../assets/fleetnova-hero.png";
import maintenanceFacilityImage from "../../assets/fleetnova-maintenance-facility.png";

import { ROUTES } from "../../constants/routes";

import { useAuth } from "../../hooks/useAuth";

export function LandingPage() {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  const dashboardPath =
    isAdmin
      ? ROUTES.ADMIN.DASHBOARD
      : ROUTES.USER.DASHBOARD;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-text-main">
      <section
        id="home"
        className="relative isolate min-h-[680px] overflow-hidden lg:min-h-[720px]"
        >
        <img
          src={heroImage}
          alt="FleetNova commercial fleet"
          className="absolute inset-0 -z-30 size-full object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
        />

        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(4,16,31,0.98)_0%,rgba(4,16,31,0.9)_38%,rgba(4,16,31,0.35)_72%,rgba(4,16,31,0.12)_100%)]" />

        <div className="absolute inset-0 -z-20 bg-[linear-gradient(0deg,#06111f_0%,rgba(6,17,31,0.7)_16%,transparent_48%,rgba(3,12,23,0.25)_100%)]" />

        <LandingNavbar
          isAuthenticated={
            isAuthenticated
          }
          dashboardPath={
            dashboardPath
          }
          isMenuOpen={isMenuOpen}
          onToggleMenu={() =>
            setIsMenuOpen(
              (current) => !current,
            )
          }
          onCloseMenu={() =>
            setIsMenuOpen(false)
          }
        />

        <div className="mx-auto flex min-h-[640px] w-full max-w-[1440px] items-center px-5 pb-28 pt-28 sm:px-8 lg:min-h-[680px] lg:px-12 lg:pb-36 xl:px-16">
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
              duration: 0.75,
              ease: "easeOut",
            }}
            className="max-w-3xl"
          >
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              Maintenance that keeps
              <span className="block text-primary">
                your fleet moving.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              One connected platform for
              maintenance requests, service
              scheduling, vehicle health, and
              smarter fleet decisions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTES.REGISTER}
                className="flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-extrabold text-background shadow-[0_14px_40px_rgba(245,166,35,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-light"
              >
                Get Started
              </Link>

              <a
                href="#features"
                className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:border-primary/40 hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <OverviewPanels />

      <CompanyOverview />

      {/* <div
        aria-hidden="true"
        className="h-20 bg-[linear-gradient(180deg,#ffffff_0%,#06111f_100%)]"
       /> */}

      <FeaturesSection />

      <WorkflowSection />

      <FinalCtaSection
        isAuthenticated={isAuthenticated}
        dashboardPath={dashboardPath}
      />

      <LandingFooter />
    </div>
  );
}

interface LandingNavbarProps {
  isAuthenticated: boolean;
  dashboardPath: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

function LandingNavbar({
  isAuthenticated,
  dashboardPath,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
}: LandingNavbarProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/10 bg-[#06111f]/25 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
        <Link
          to={ROUTES.HOME}
          onClick={onCloseMenu}
          className="flex min-w-0 items-center gap-3"
        >
          <img
            src={fleetNovaLogo}
            alt="FleetNova"
            className="size-11 shrink-0 object-contain"
          />

          <div>
            <p className="font-display text-lg font-black leading-none text-white">
              Fleet
              <span className="text-primary">
                Nova
              </span>
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <LandingLink
            href="#home"
            label="Home"
            active
          />

          <LandingLink
            href="#overview"
            label="About"
          />

          <LandingLink
            href="#features"
            label="Features"
          />

          <LandingLink
            href="#how-it-works"
            label="How It Works"
          />

          <LandingLink
            href="#contact"
            label="Contact"
          />
        </div>

        <div className="hidden items-center lg:flex">
  <Link
    to={
      isAuthenticated
        ? dashboardPath
        : ROUTES.LOGIN
    }
    className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-extrabold text-background transition hover:bg-primary-light"
  >
    {isAuthenticated && <LayoutDashboard size={17} />}

    {isAuthenticated
      ? "Dashboard"
      : "Login"}
  </Link>
</div>

        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={
            isMenuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={isMenuOpen}
          className="grid size-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white lg:hidden"
        >
          {isMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="overflow-hidden border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-5 py-5 sm:px-8">
              <MobileLink
                href="#home"
                label="Home"
                onClick={onCloseMenu}
              />

              <MobileLink
                href="#overview"
                label="About"
                onClick={onCloseMenu}
              />

              <MobileLink
                href="#features"
                label="Features"
                onClick={onCloseMenu}
              />

              <MobileLink
                href="#how-it-works"
                label="How It Works"
                onClick={onCloseMenu}
              />

              <MobileLink
                href="#contact"
                label="Contact"
                onClick={onCloseMenu}
              />

              <div className="border-t border-white/10 pt-4">
  <Link
    to={
      isAuthenticated
        ? dashboardPath
        : ROUTES.LOGIN
    }
    onClick={onCloseMenu}
    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-extrabold text-background"
  >
    {isAuthenticated && <LayoutDashboard size={17} />}

    {isAuthenticated
      ? "Dashboard"
      : "Login"}
  </Link>
</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function OverviewPanels() {
  return (
<section
  id="overview"
  className="relative z-20 bg-[linear-gradient(180deg,#06111f_0%,#0b2038_20%,#dbe5ef_62%,#f4f7fb_100%)] pb-4"
>
      <div className="mx-auto grid max-w-[1340px] -translate-y-24 items-start gap-0 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="overflow-hidden bg-[#0d2747] shadow-[0_24px_60px_rgba(2,12,27,0.22)] md:h-[470px] lg:h-[450px] xl:h-[428px]"
        >
          <div className="p-6 sm:p-7">
            <p className="text-sm font-extrabold text-primary">
              About FleetNova
            </p>

            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-white">
              Built to keep operations
              moving.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              FleetNova connects drivers,
              fleet teams, and maintenance
              operations in one clear digital
              workflow.
            </p>
          </div>

          <img
            src={maintenanceFacilityImage}
            alt="Commercial vehicle in a maintenance facility"
            className="h-52 w-full object-cover"
          />
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="bg-[#102f56] p-6 shadow-[0_28px_70px_rgba(2,12,27,0.28)] sm:p-7 md:min-h-[480px] md:-translate-y-5 lg:min-h-[500px]"
        >
          <p className="text-sm font-extrabold text-primary">
            Core Capabilities
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold text-white">
            Everything in one place.
          </h2>

          <div className="mt-7 grid grid-cols-2 gap-px bg-white/10">
  <Capability
    icon={<ClipboardCheck size={21} />}
    title="Requests"
    description="Submit, review, approve, and track every service request."
  />

  <Capability
    icon={<Wrench size={21} />}
    title="Maintenance"
    description="Schedule service and keep complete maintenance records."
  />

  <Capability
    icon={<BarChart3 size={21} />}
    title="Insights"
    description="Monitor fleet activity, costs, and upcoming service."
  />

  <Capability
    icon={<ShieldCheck size={21} />}
    title="Secure Access"
    description="Give users and administrators the right level of control."
  />
</div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="bg-[#0d2747] p-6 shadow-[0_24px_60px_rgba(2,12,27,0.22)] sm:p-7 md:h-[470px] lg:h-[450px] xl:h-[428px]"
        >
          <p className="text-sm font-extrabold text-primary">
            Built for Every Role
          </p>

          <h2 className="mt-3 font-serif text-2xl font-bold text-white">
            One system. Two focused
            experiences.
          </h2>

          <div className="mt-6 space-y-4">
            <RoleItem
              icon={<UserRound size={20} />}
              title="Fleet Users"
              description="Submit and track maintenance requests with complete clarity."
            />

            <RoleItem
              icon={<UsersRound size={20} />}
              title="Administrators"
              description="Control vehicles, schedules, records, costs, and approvals."
            />
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function CompanyOverview() {
  const points = [
    "Centralized vehicle information",
    "Faster maintenance decisions",
    "Transparent request tracking",
    "Reliable service history",
  ];

  return (
    <section className="-mt-24 bg-[#f4f7fb] pb-24">
      <div className="mx-auto grid max-w-[1340px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#d98200]">
            Fleet Operations, Simplified
          </p>

          <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold leading-tight text-[#0b1f36] sm:text-5xl">
            From maintenance request to
            completed service.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
            Replace scattered messages and
            manual tracking with a structured
            process that gives every team
            member the information they need.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <div
                key={point}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[#d98200]"
                />

                <span className="text-sm font-bold text-slate-700">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -bottom-5 -left-5 size-32 border-b-2 border-l-2 border-primary/50" />

          <img
            src={maintenanceFacilityImage}
            alt="Fleet maintenance operation"
            className="relative h-[360px] w-full object-cover shadow-2xl shadow-slate-900/20 sm:h-[440px]"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Capability({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#102f56] p-4 text-primary">
      {icon}

      <p className="mt-3 text-sm font-extrabold text-white">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-300">
        {description}
      </p>
    </div>
  );
}

function RoleItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 border-b border-white/10 pb-4 last:border-0">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-extrabold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <CarFront size={23} />,
      title: "Vehicle Management",
      description:
        "Keep every vehicle, status, mileage reading, and essential detail organized in one place.",
    },
    {
      icon: <ClipboardCheck size={23} />,
      title: "Maintenance Requests",
      description:
        "Let fleet users submit service needs and follow each decision with complete transparency.",
    },
    {
      icon: <CalendarClock size={23} />,
      title: "Service Scheduling",
      description:
        "Turn approved requests into scheduled maintenance records with clear dates and mileage targets.",
    },
    {
      icon: <History size={23} />,
      title: "Service History",
      description:
        "Maintain a dependable record of completed services, notes, mileage, and vehicle activity.",
    },
    {
      icon: <DollarSign size={23} />,
      title: "Cost Tracking",
      description:
        "Record maintenance costs in USD and understand how completed services affect fleet spending.",
    },
    {
      icon: <BarChart3 size={23} />,
      title: "Operational Insights",
      description:
        "Monitor active vehicles, overdue maintenance, completed work, and upcoming service from one dashboard.",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-background pb-20 pt-16 sm:pb-24 sm:pt-20"
    >
      <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="flex flex-col gap-5"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
              Platform Features
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
              Built around the real work
              of maintaining a fleet.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted">
              FleetNova brings vehicles,
              requests, schedules, costs, and
              maintenance records together so
              every action stays visible.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-px overflow-hidden border border-border-dark bg-border-dark md:grid-cols-2 xl:grid-cols-3">
          {features.map(
            (feature, index) => (
              <motion.article
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.06,
                }}
                className="group relative min-h-72 overflow-hidden bg-surface p-6 text-center transition duration-300 hover:bg-surface-light sm:p-7"
              >
                <div className="mx-auto grid size-12 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition group-hover:border-primary/40 group-hover:bg-primary group-hover:text-background">
                  {feature.icon}
                </div>

                <h3 className="mt-8 font-serif text-2xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-text-muted">
                  {feature.description}
                </p>

                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition duration-300 group-hover:scale-x-100" />
              </motion.article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  const steps = [
    {
      icon: <ClipboardCheck size={22} />,
      title: "Submit a Request",
      description:
        "A fleet user selects an active vehicle, chooses the required service, and describes the issue.",
      role: "Fleet User",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Review & Decide",
      description:
        "The administrator reviews the request details and either approves or rejects it.",
      role: "Administrator",
    },
    {
      icon: <CalendarClock size={22} />,
      title: "Schedule Service",
      description:
        "An approved request automatically becomes a scheduled maintenance record.",
      role: "Fleet Team",
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: "Complete & Record",
      description:
        "The service is completed with final mileage, notes, and cost saved in the vehicle history.",
      role: "Administrator",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-white/5 bg-background py-20 sm:py-24"
    >
      <div className="pointer-events-none absolute -left-44 top-1/3 size-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            How It Works
          </p>

          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            One clear path from issue
            to completed service.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400">
            Every request follows a visible,
            controlled workflow so users
            always know what happens next.
          </p>
        </motion.div>

        <div className="relative mt-14">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[linear-gradient(90deg,transparent,#f5a623,#f5a623,transparent)] lg:block" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-white/[0.06] sm:p-6"
              >
                <div className="relative z-10 flex items-center justify-start">
                  <div className="grid size-16 place-items-center rounded-full border border-primary/25 bg-surface text-primary shadow-[0_0_0_8px_rgba(245,166,35,0.04)] transition group-hover:bg-primary group-hover:text-background">
                    {step.icon}
                  </div>
                </div>

                <div className="mt-7">
                  <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    {step.role}
                  </span>

                  <h3 className="mt-4 font-serif text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {step.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 sm:flex-row sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div>
              <h3 className="font-display text-base font-extrabold text-white">
                Complete visibility at every step
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Users track their requests
                while administrators manage
                the complete fleet operation.
              </p>
            </div>
          </div>

          <a
            href="#home"
            className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-primary/30 px-5 text-sm font-extrabold text-primary transition hover:bg-primary hover:text-background sm:w-auto"
          >
            Start Your Journey
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

interface FinalCtaSectionProps {
  isAuthenticated: boolean;
  dashboardPath: string;
}

function FinalCtaSection({
  isAuthenticated,
  dashboardPath,
}: FinalCtaSectionProps) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-background px-5 pb-20 pt-6 sm:px-8 sm:pb-24 lg:px-12"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{ once: true }}
        className="relative mx-auto flex max-w-[1240px] flex-col items-center overflow-hidden rounded-3xl border border-primary/20 bg-[linear-gradient(135deg,#102f56_0%,#0d2747_55%,#081a2e_100%)] px-6 py-14 text-center shadow-[0_28px_80px_rgba(0,0,0,0.25)] sm:px-10 sm:py-16 lg:py-20"
      >
        <div className="absolute -right-20 -top-24 size-72 rounded-full border border-primary/10" />
        <div className="absolute -right-8 -top-12 size-48 rounded-full border border-primary/10" />

        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
          Start with FleetNova
        </p>

        <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
          Keep every vehicle and maintenance
          decision moving forward.
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Bring requests, schedules, service
          history, and fleet insights together
          in one organized platform.
        </p>

        <Link
          to={
            isAuthenticated
              ? dashboardPath
              : ROUTES.REGISTER
          }
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-sm font-extrabold text-background shadow-[0_14px_35px_rgba(245,166,35,0.2)] transition hover:-translate-y-0.5 hover:bg-primary-light"
        >
          {isAuthenticated
            ? "Go to Dashboard"
            : "Create Your Account"}

          <ArrowRight size={17} />
        </Link>
      </motion.div>
    </section>
  );
}

function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#040e19]">
      <div className="mx-auto flex max-w-[1340px] flex-col items-center gap-5 px-5 py-7 text-center sm:px-8 md:flex-row md:justify-between md:text-left lg:px-12">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2.5"
        >
          <img
            src={fleetNovaLogo}
            alt="FleetNova"
            className="size-9 object-contain"
          />

          <span className="font-display text-lg font-black text-white">
            Fleet
            <span className="text-primary">
              Nova
            </span>
          </span>
        </Link>

        <div className="flex flex-col items-center gap-3 text-sm text-slate-500 sm:flex-row sm:gap-6 md:ml-auto">
          <p>
            © {currentYear} FleetNova. All rights
            reserved.
          </p>

          <a
            href="#home"
            className="font-bold text-slate-400 transition hover:text-primary"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

function LandingLink({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`border-b py-2 text-sm font-bold transition ${
        active
          ? "border-primary text-white"
          : "border-transparent text-slate-300 hover:border-primary/50 hover:text-white"
      }`}
    >
      {label}
    </a>
  );
}

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="flex min-h-11 items-center rounded-lg px-4 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-primary"
    >
      {label}
    </a>
  );
}
