export type ApplicationStatus =
  | "pending" | "reviewing" | "matched" | "active" | "completed" | "declined"

export interface MentorshipApplication {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  linked_in: string | null
  grade_level: string | null
  experience_level: string | null
  areas_of_interest: string[]
  looking_for: string[]
  availability: string[]
  bio: string | null
  date_of_birth: string
  is_minor: boolean
  parent_name: string | null
  parent_email: string | null
  parent_token: string | null
  parent_token_expires_at: string | null
  parent_consent: boolean
  parent_consent_at: string | null
  consent_expires_at: string | null
  agreed_to_terms: boolean
  agreed_at: string | null
  status: ApplicationStatus
  auth_user_id: string | null
  mentor_name: string | null
  mentor_email: string | null
  matched_at: string | null
  created_at: string
  updated_at: string
}

export type MentorStatus = "pending" | "approved" | "active" | "inactive"

export interface Mentor {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  linkedin_url: string | null
  company: string | null
  job_title: string | null
  years_experience: number | null
  bio: string | null
  location: string | null
  areas_of_expertise: string[]
  certifications: string[]
  industries: string[]
  mentoring_style: string[]
  max_mentees: number
  availability: string[]
  agreed_to_terms: boolean
  agreed_at: string | null
  background_self_cert: boolean
  status: MentorStatus
  approved_at: string | null
  auth_user_id: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface MentorshipCohort {
  id: string
  name: string
  season: string | null
  year: number
  start_date: string | null
  end_date: string | null
  max_pairs: number
  description: string | null
  created_by: string | null
  status: "upcoming" | "active" | "completed"
  created_at: string
  updated_at: string
}

export type PairStatus = "active" | "completed" | "ended_early"

export interface MentorshipPair {
  id: string
  mentor_id: string
  mentee_id: string
  cohort_id: string | null
  assigned_by: string | null
  status: PairStatus
  started_at: string | null
  ended_at: string | null
  session_count: number
  last_session_at: string | null
  flagged: boolean
  flag_reason: string | null
  certificate_token: string | null
  certificate_issued_at: string | null
  checkin_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface MentorshipSession {
  id: string
  pair_id: string
  session_date: string
  duration_mins: number | null
  format: string | null
  topics: string[]
  summary: string | null
  mentor_notes: string | null
  next_session_date: string | null
  action_items: string | null
  logged_by: string | null
  created_at: string
}

export interface MentorshipGoal {
  id: string
  pair_id: string
  title: string
  description: string | null
  target_date: string | null
  created_by: string | null
  status: "in_progress" | "completed" | "dropped"
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface MentorshipResource {
  id: string
  pair_id: string
  title: string
  url: string | null
  description: string | null
  category: string | null
  added_by: string | null
  created_at: string
}

export interface MentorshipScheduledSession {
  id: string
  pair_id: string
  scheduled_date: string
  duration_mins: number | null
  format: string | null
  agenda: string | null
  notes: string | null
  meet_link: string | null
  scheduled_by: string | null
  status: "scheduled" | "completed" | "cancelled"
  created_at: string
}
