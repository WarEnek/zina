export function ExplorerLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="block text-blue-700 underline" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}
