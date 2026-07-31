import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerSupabase } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase"

// TEMPORARY diagnostic route — remove once the admin-login redirect bug is fixed.
export async function GET() {
  const cookieStore = cookies()
  const allCookieNames = cookieStore.getAll().map(c => c.name)
  const authCookie = cookieStore.getAll().find(c => c.name.includes("auth-token"))
  const authCookieValuePrefix = authCookie?.value.slice(0, 60) ?? null
  const authCookieValueLength = authCookie?.value.length ?? null

  const supabase = createServerSupabase()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  let adminRow = null
  let adminError = null
  if (user) {
    const res = await supabaseAdmin.from("admin_users").select("id, email, auth_user_id").eq("auth_user_id", user.id).maybeSingle()
    adminRow = res.data
    adminError = res.error
  }

  return NextResponse.json({
    allCookieNames,
    authCookieValuePrefix,
    authCookieValueLength,
    userFound: Boolean(user),
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    userError: userError?.message ?? null,
    adminRow,
    adminError: adminError?.message ?? null,
  })
}
