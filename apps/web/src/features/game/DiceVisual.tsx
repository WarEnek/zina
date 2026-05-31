export function DiceVisual({ value }: { value?: number }) {
  return (
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-2xl font-black">
      {value ?? '?'}
    </div>
  )
}
