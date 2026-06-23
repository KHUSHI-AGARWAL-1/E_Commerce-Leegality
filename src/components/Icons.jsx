export function SearchIcon({ className = '', ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l5 5" />
    </svg>
  );
}

export function CartIcon({ className = '', ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M3 5h2l2.2 9.1c.2.7.8 1.2 1.5 1.2h7.8c.7 0 1.3-.4 1.5-1.1L20 8H7.2" />
      <circle cx="10" cy="19" r="1.3" />
      <circle cx="17" cy="19" r="1.3" />
    </svg>
  );
}
