export function BakeButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button className="rounded-sm bg-blue-600 px-4 py-2 font-bold text-white disabled:opacity-50" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}
