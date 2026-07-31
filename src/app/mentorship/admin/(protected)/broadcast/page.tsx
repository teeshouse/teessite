import BroadcastForm from "@/components/mentorship/admin/BroadcastForm"

export const metadata = { title: "Broadcast | Mentorship Admin" }

export default function AdminBroadcastPage() {
  return (
    <div>
      <h1 className="text-green-dark mb-6">Broadcast Message</h1>
      <BroadcastForm />
    </div>
  )
}
