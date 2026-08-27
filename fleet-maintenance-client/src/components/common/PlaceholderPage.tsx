interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="grid min-h-[calc(100vh-9rem)] place-items-center">
      <div className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Fleet Maintenance
        </p>

        <h2 className="font-display text-4xl font-extrabold text-text-main">
          {title}
        </h2>

        {description && (
          <p className="mx-auto mt-4 max-w-xl text-text-muted">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}