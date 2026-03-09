// Inline SVG logos for payment methods â€” no external image deps

export function PayPalLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 101 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.2 2H5.6C5.1 2 4.6 2.4 4.5 2.9L1.8 19.8c-.1.4.2.8.6.8h3.3c.5 0 1-.4 1.1-.9l.7-4.5c.1-.5.5-.9 1.1-.9h2.1c4.4 0 6.9-2.1 7.6-6.3.3-1.8 0-3.3-.8-4.3C16.5 2.6 14.6 2 12.2 2z" fill="#003087"/>
      <path d="M13 8.3c-.4 2.4-2.2 2.4-4 2.4H8l.7-4.5h1.1c1.2 0 2.4 0 3 .7.4.4.4 1 .2 1.4z" fill="#003087"/>
      <path d="M28.2 8.2h-3.3c-.5 0-1 .4-1.1.9l-.1.9-.2-.3c-.6-.9-2-1.2-3.4-1.2-3.2 0-5.9 2.4-6.4 5.8-.3 1.7.1 3.3 1 4.4.9 1 2.1 1.4 3.6 1.4 2.6 0 4-.7 4-.7l-.1.9c-.1.4.2.8.6.8h3c.5 0 1-.4 1.1-.9l1.8-11.3c.1-.3-.2-.7-.5-.7z" fill="#003087"/>
      <path d="M23.5 14c-.3 1.7-1.6 2.8-3.3 2.8-.8 0-1.5-.3-2-.7-.4-.5-.6-1.1-.5-1.8.3-1.7 1.6-2.8 3.3-2.8.8 0 1.5.3 1.9.7.5.5.7 1.2.6 1.8z" fill="#003087"/>
      <path d="M44.5 8.2h-3.3c-.6 0-1.1.3-1.4.8l-4 5.9-1.7-5.7c-.2-.6-.8-1-1.4-1h-3.2c-.5 0-.8.5-.6.9l3.2 9.4-3 4.2c-.3.5 0 1.1.6 1.1h3.3c.6 0 1.1-.3 1.4-.8l9.6-13.9c.3-.4 0-1-.5-1z" fill="#003087"/>
      <path d="M55.2 2h-6.6c-.5 0-1 .4-1.1.9l-2.7 17c-.1.4.2.8.6.8h3.5c.4 0 .7-.3.8-.6l.8-4.8c.1-.5.5-.9 1.1-.9h2.1c4.4 0 6.9-2.1 7.6-6.3.3-1.8 0-3.3-.8-4.3C59.5 2.6 57.6 2 55.2 2z" fill="#009CDE"/>
      <path d="M56 8.3c-.4 2.4-2.2 2.4-4 2.4H51l.7-4.5h1.1c1.2 0 2.4 0 3 .7.4.4.4 1 .2 1.4z" fill="#009CDE"/>
      <path d="M71.2 8.2h-3.3c-.5 0-1 .4-1.1.9l-.1.9-.2-.3c-.6-.9-2-1.2-3.4-1.2-3.2 0-5.9 2.4-6.4 5.8-.3 1.7.1 3.3 1 4.4.9 1 2.1 1.4 3.6 1.4 2.6 0 4-.7 4-.7l-.1.9c-.1.4.2.8.6.8h3c.5 0 1-.4 1.1-.9l1.8-11.3c.1-.3-.2-.7-.5-.7z" fill="#009CDE"/>
      <path d="M66.5 14c-.3 1.7-1.6 2.8-3.3 2.8-.8 0-1.5-.3-2-.7-.4-.5-.6-1.1-.5-1.8.3-1.7 1.6-2.8 3.3-2.8.8 0 1.5.3 1.9.7.5.5.7 1.2.6 1.8z" fill="#009CDE"/>
      <path d="M74.5 2.9l-2.7 17.1c-.1.4.2.8.6.8h2.8c.5 0 1-.4 1.1-.9L79 2.9c.1-.4-.2-.8-.6-.8h-3.2c-.4 0-.6.3-.7.8z" fill="#009CDE"/>
    </svg>
  )
}

export function VenmoLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 150 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="34" rx="4" fill="#008CFF"/>
      <text x="12" y="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="20" fill="white" letterSpacing="1">venmo</text>
    </svg>
  )
}

export function CashAppLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#00D64F"/>
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
        fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="white">$</text>
    </svg>
  )
}