export type TaskStatus = "open" | "submitted" | "completed"
export type PortalRole = "mentor" | "mentee"

/** Only the mentor creates, edits, deletes, or approves tasks. */
export function canManageTasks(role: PortalRole): boolean {
  return role === "mentor"
}

/**
 * The mentor can move a task to any status (approve it, or reopen it).
 * The intern can only mark their own work as done, or take that back.
 */
export function canChangeTaskStatus(role: PortalRole, from: TaskStatus, to: TaskStatus): boolean {
  if (from === to) return false
  if (role === "mentor") return true
  return (from === "open" && to === "submitted") || (from === "submitted" && to === "open")
}

/** A task is overdue once its due date has passed and it is not completed. `today` is the Central Time date (see todayCentral). */
export function isOverdue(dueDate: string | null, status: TaskStatus, today: string): boolean {
  return Boolean(dueDate) && status !== "completed" && (dueDate as string) < today
}
