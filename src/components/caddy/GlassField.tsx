export function GlassField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <input
        {...props}
        className="field-glass w-full rounded-2xl px-4 py-3 text-sm font-semibold placeholder:font-medium placeholder:text-muted-foreground"
      />
    </label>
  );
}
