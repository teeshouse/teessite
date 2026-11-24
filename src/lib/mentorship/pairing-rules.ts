export interface PairingCheck {
  mentor: { status: string; max_mentees: number } | null
  intern: {
    status: string
    is_minor: boolean
    parent_consent: boolean
    consent_expires_at: string | null
  } | null
  mentorActivePairs: number
  internActivePairs: number
  /** null when the admin picked a cohort id that does not exist; undefined when no cohort was chosen. */
  cohort: { status: string; max_pairs: number } | null | undefined
  cohortActivePairs: number
  now?: Date
}

export interface PairingError { message: string; status: number }

/** Returns the first reason a pair cannot be created, or null when it is allowed. */
export function pairingError(c: PairingCheck): PairingError | null {
  const now = c.now ?? new Date()

  if (!c.intern) return { message: "Intern not found", status: 404 }
  if (!c.mentor) return { message: "Mentor not found", status: 404 }

  if (c.intern.status === "declined" || c.intern.status === "completed") {
    return { message: `Cannot pair: this intern's application is ${c.intern.status}.`, status: 400 }
  }

  if (c.intern.is_minor) {
    const expired = !c.intern.consent_expires_at || new Date(c.intern.consent_expires_at) < now
    if (!c.intern.parent_consent || expired) {
      return {
        message: "Cannot pair: parent consent has not been received or has expired for this intern.",
        status: 400,
      }
    }
  }

  if (c.mentor.status !== "approved" && c.mentor.status !== "active") {
    return { message: "Cannot pair: this mentor has not been approved yet.", status: 400 }
  }

  if (c.internActivePairs > 0) {
    return { message: "This intern already has an active pair.", status: 400 }
  }

  if (c.mentorActivePairs >= c.mentor.max_mentees) {
    return { message: "This mentor is already at their max intern capacity.", status: 400 }
  }

  if (c.cohort === null) return { message: "Cohort not found", status: 404 }
  if (c.cohort) {
    if (c.cohort.status === "completed") {
      return { message: "Cannot pair: this cohort is completed.", status: 400 }
    }
    if (c.cohortActivePairs >= c.cohort.max_pairs) {
      return { message: "This cohort is already at its maximum number of pairs.", status: 400 }
    }
  }

  return null
}
