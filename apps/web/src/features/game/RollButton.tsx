export function RollButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button className="rounded-xl bg-accent px-4 py-2 font-bold text-black disabled:opacity-50" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}
