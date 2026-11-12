"use client"
import { OPPORTUNITY_SELECT_EVENT } from "@/lib/opportunities"

interface Props {
  opportunityId: string
  label: string
  className?: string
}

export default function ApplyButton({ opportunityId, label, className }: Props) {
  return (
    <a
      href="#apply"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPPORTUNITY_SELECT_EVENT, { detail: opportunityId }))}
    >
      {label}
    </a>
  )
}
