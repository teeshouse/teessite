import { requirePortalUser } from "@/lib/mentorship/auth-guard"
import { getPairForPortalUser } from "@/lib/mentorship/portal-data"

export const revalidate = 0
export const metadata = { title: "Portal | Tee's House Mentorship" }

export default async function PortalDashboardPage() {
  const { user } = await requirePortalUser()
  if (!user) return null

  const pair = await getPairForPortalUser(user.role, user.profileId)
  const other = user.role === "mentor" ? pair?.mentee : pair?.mentor

  return (
    <div>
      <h1 className="text-green-dark mb-2">Welcome back</h1>
      <p className="text-gray-muted mb-6">You're signed in as a {user.role}.</p>

      {!pair ? (
        <div className="card p-8 text-center">
          <p className="text-gray-muted text-sm">
            You don't have an active pairing yet. Our team will notify you once you're matched.
          </p>
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="text-green-dark text-lg font-semibold mb-1">
            Paired with {other?.first_name} {other?.last_name}
          </h2>
          <p className="text-gray-muted text-sm mb-4">Status: {pair.status}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-dark">{pair.session_count}</div>
              <div className="text-xs text-gray-muted uppercase tracking-wide">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-dark">
                {pair.last_session_at ? new Date(pair.last_session_at).toLocaleDateString() : "—"}
              </div>
              <div className="text-xs text-gray-muted uppercase tracking-wide">Last Session</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
