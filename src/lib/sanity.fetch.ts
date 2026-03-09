import { sanityClient } from "./sanity.client"
import {
  SITE_SETTINGS_QUERY,
  IMPACT_STATS_QUERY,
  PROGRAMS_QUERY,
  NEWS_QUERY,
  VOLUNTEER_ROLES_QUERY,
  FEATURED_NEWS_QUERY
} from "./sanity.queries"

export async function getSiteSettings() {
  try { return await sanityClient.fetch(SITE_SETTINGS_QUERY) } catch { return null }
}

export async function getImpactStats() {
  try { return await sanityClient.fetch(IMPACT_STATS_QUERY) } catch { return [] }
}

export async function getPrograms() {
  try { return await sanityClient.fetch(PROGRAMS_QUERY) } catch { return [] }
}

export async function getNews() {
  try { return await sanityClient.fetch(NEWS_QUERY) } catch { return [] }
}

export async function getFeaturedNews() {
  try { return await sanityClient.fetch(FEATURED_NEWS_QUERY) } catch { return [] }
}

export async function getVolunteerRoles() {
  try { return await sanityClient.fetch(VOLUNTEER_ROLES_QUERY) } catch { return [] }
}