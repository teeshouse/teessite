export type OpportunityKind = "internship" | "paid" | "volunteer"

export type ApplyMethod =
  | { type: "form" }
  | { type: "handshake"; url: string }
  | { type: "getConnected"; url: string }

export interface Opportunity {
  id: string
  title: string
  kind: OpportunityKind
  /** Internships only: true = Paid Internship, false/omitted = Unpaid Internship. */
  paidInternship?: boolean
  /** Set to false to close a role. Closed roles disappear from the cards and the form dropdown. */
  open: boolean
  description: string
  /** Approved pay rate or stipend. Volunteer and unpaid roles fall back to a status label. */
  compensation?: string
  /** Schedule or expected hours, e.g. "6 hrs/week". */
  timeCommitment?: string
  apply: ApplyMethod
}

export const HELP_ME_FIND_A_FIT = { id: "help-me-find-a-fit", title: "Help me find a fit" } as const

export const OPPORTUNITY_SELECT_EVENT = "opportunity-select"

export const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
export const timeSlots  = ["Morning (8 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 7 PM)"]
export const bgOptions  = ["Yes", "No", "I'd like to learn more before committing"]
export const creditOptions = ["Yes", "No", "Not sure"]
export const educationOptions = [
  "Less than High School",
  "High School Diploma / GED",
  "Some College",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / Professional Degree",
  "Prefer not to say",
]

export interface FormOption {
  id: string
  title: string
  kind: OpportunityKind | "general"
}

export const opportunities: Opportunity[] = [
  {
    id: "program-facilitator",
    title: "Program Facilitator",
    kind: "paid",
    open: false,
    description: "Lead or assist in pre-crafted curriculum focused on garden discovery, nutrition connections, environmental stewardship, and creative reflection.",
    apply: { type: "form" },
  },
  {
    id: "field-maintenance-operator",
    title: "Field Maintenance Operator",
    kind: "paid",
    open: false,
    description: "Plant, maintain, and harvest fresh produce. Assist with composting, watering, and ensuring the gardens thrive.",
    apply: { type: "form" },
  },
  {
    id: "adopt-a-school-garden",
    title: "Adopt a School Garden",
    kind: "volunteer",
    open: true,
    description: "Help set up a school garden, keep it maintained over time, and support students during garden lessons.",
    apply: { type: "form" },
  },
  {
    id: "garden-club-support-volunteer",
    title: "Garden Club Support Volunteer",
    kind: "volunteer",
    open: false,
    description: "Help our facilitators run Garden Club sessions by preparing materials, setting up, and supporting participants.",
    apply: { type: "form" },
  },
  {
    id: "community-outreach-ambassador",
    title: "Community Outreach Ambassador",
    kind: "volunteer",
    open: true,
    description: "Set up and run community events including farmers markets, art showcases, and fundraisers.",
    apply: { type: "form" },
  },
]

export const kindSections: { kind: OpportunityKind; id: string; heading: string; emptyMessage: string }[] = [
  { kind: "internship", id: "internships",             heading: "Internships",             emptyMessage: "No internships are open right now." },
  { kind: "paid",       id: "paid-positions",          heading: "Paid Positions",          emptyMessage: "No paid positions are open right now." },
  { kind: "volunteer",  id: "volunteer-opportunities", heading: "Volunteer Opportunities", emptyMessage: "No volunteer opportunities are open right now." },
]

export function openOpportunities(): Opportunity[] {
  return opportunities.filter(o => o.open)
}

/** Roles that accept submissions through the Tee's House website form. */
export function formOpportunities(): Opportunity[] {
  return openOpportunities().filter(o => o.apply.type === "form")
}

export function findFormOpportunity(id: unknown): Opportunity | undefined {
  return typeof id === "string" ? formOpportunities().find(o => o.id === id) : undefined
}

export function opportunityBadge(o: Opportunity): string {
  if (o.kind === "internship") return o.paidInternship ? "Paid Internship" : "Unpaid Internship"
  return o.kind === "paid" ? "Paid Position" : "Volunteer"
}

export function opportunityCompensation(o: Opportunity): string | undefined {
  if (o.compensation) return o.compensation
  if (o.kind === "volunteer") return "Volunteer (unpaid)"
  if (o.kind === "internship" && !o.paidInternship) return "Unpaid"
  return undefined
}
