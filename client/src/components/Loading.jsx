export default function Loading({ label = 'Loading…' }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-ps-border border-t-ps-blue rounded-full animate-spin" />
      <p className="text-ps-muted text-sm">{label}</p>
    </div>
  );
}
