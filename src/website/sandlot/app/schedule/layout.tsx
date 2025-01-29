export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center w-full">
      <div className="w-full text-center">{children}</div>
    </section>
  );
}
