type Props = { value: number };

export function StarRating({ value }: Props) {
  const filled = Math.min(5, Math.max(0, Math.round(value)));
  return (
    <span className="text-amber-500" aria-hidden>
      {"★".repeat(filled)}
      {"☆".repeat(5 - filled)}
    </span>
  );
}
