export function ExplorerLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="block text-accent underline" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}
