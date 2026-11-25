import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"
import { loadTasksForPair } from "@/lib/mentorship/task-data"
import TasksPanel from "@/components/mentorship/portal/TasksPanel"

export const revalidate = 0
export const metadata = { title: "Tasks | Mentorship Portal" }

export default async function PortalTasksPage() {
  const { user } = await requirePortalUser()
  if (!user) return null
  const pair = await getPairForPortalUser(user.role, user.profileId)
  const { tasks, setupNeeded } = pair ? await loadTasksForPair(pair.id) : { tasks: [], setupNeeded: false }

  return (
    <div>
      <h1 className="text-green-dark mb-2">Tasks</h1>
      <p className="text-gray-muted text-sm mb-6">
        {user.role === "mentor"
          ? "Assign tasks to your intern, add notes, and review their work."
          : "Tasks from your mentor. Add notes and documents as you work."}
      </p>
      {!pair ? (
        <p className="text-gray-muted text-sm">No active pairing yet.</p>
      ) : (
        <TasksPanel role={user.role} initialTasks={tasks} setupNeeded={setupNeeded} pairActive={pair.status === "active"} />
      )}
    </div>
  )
}
