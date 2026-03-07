import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export async function submitVolunteerApplication(data: {
  name: string; email: string; phone?: string
  role_interest: string[]; availability: string; message?: string
}) {
  const { error } = await supabase.from("volunteer_applications").insert([{ ...data, status: "new" }])
  if (error) throw error
  return { success: true }
}
export async function submitContactForm(data: {
  name: string; email: string; subject?: string; message: string
}) {
  const { error } = await supabase.from("contact_submissions").insert([{ ...data, status: "new" }])
  if (error) throw error
  return { success: true }
}
export async function submitNewsletterSignup(data: {
  email: string; first_name?: string; source?: string
}) {
  const { error } = await supabase.from("newsletter_signups").insert([{ ...data, active: true }])
  if (error) throw error
  return { success: true }
}