import { sanityClient } from "./sanity.client"
import type { SiteSettings } from "@/types"
import {
  SITE_SETTINGS_QUERY, IMPACT_STATS_QUERY,
  PROGRAMS_QUERY, FEATURED_PROGRAMS_QUERY,
  NEWS_QUERY, FEATURED_NEWS_QUERY, NEWS_BY_SLUG_QUERY,
  VOLUNTEER_ROLES_QUERY, EVENTS_QUERY, UPCOMING_EVENTS_QUERY,
  TEAM_QUERY, TESTIMONIALS_QUERY, PARTNERS_QUERY,
  GALLERY_QUERY, FAQS_QUERY, PAGES_QUERY,
  PAGE_BY_SLUG_QUERY, ANNUAL_REPORTS_QUERY,
  SERVICES_QUERY, DOWNLOADS_QUERY
} from "./sanity.queries"

export async function getSiteSettings(): Promise<SiteSettings | null> { try { return await sanityClient.fetch<SiteSettings>(SITE_SETTINGS_QUERY) }    catch { return null } }
export async function getImpactStats()     { try { return await sanityClient.fetch(IMPACT_STATS_QUERY) }     catch { return [] } }
export async function getPrograms()        { try { return await sanityClient.fetch(PROGRAMS_QUERY) }         catch { return [] } }
export async function getFeaturedPrograms(){ try { return await sanityClient.fetch(FEATURED_PROGRAMS_QUERY)} catch { return [] } }
export async function getNews()            { try { return await sanityClient.fetch(NEWS_QUERY) }             catch { return [] } }
export async function getFeaturedNews()    { try { return await sanityClient.fetch(FEATURED_NEWS_QUERY) }    catch { return [] } }
export async function getVolunteerRoles()  { try { return await sanityClient.fetch(VOLUNTEER_ROLES_QUERY) }  catch { return [] } }
export async function getEvents()          { try { return await sanityClient.fetch(EVENTS_QUERY) }           catch { return [] } }
export async function getUpcomingEvents()  { try { return await sanityClient.fetch(UPCOMING_EVENTS_QUERY) }  catch { return [] } }
export async function getTeam()            { try { return await sanityClient.fetch(TEAM_QUERY) }             catch { return [] } }
export async function getTestimonials()    { try { return await sanityClient.fetch(TESTIMONIALS_QUERY) }     catch { return [] } }
export async function getPartners()        { try { return await sanityClient.fetch(PARTNERS_QUERY) }         catch { return [] } }
export async function getGallery()         { try { return await sanityClient.fetch(GALLERY_QUERY) }          catch { return [] } }
export async function getFaqs()            { try { return await sanityClient.fetch(FAQS_QUERY) }             catch { return [] } }
export async function getPages()           { try { return await sanityClient.fetch(PAGES_QUERY) }            catch { return [] } }
export async function getDownloads()       { try { return await sanityClient.fetch(DOWNLOADS_QUERY) }        catch { return [] } }
export async function getServices()        { try { return await sanityClient.fetch(SERVICES_QUERY) }         catch { return [] } }
export async function getAnnualReports()   { try { return await sanityClient.fetch(ANNUAL_REPORTS_QUERY) }  catch { return [] } }
export async function getPageBySlug(slug: string) {
  try { return await sanityClient.fetch(PAGE_BY_SLUG_QUERY, { slug }) } catch { return null }
}
export async function getNewsBySlug(slug: string) {
  try { return await sanityClient.fetch(NEWS_BY_SLUG_QUERY, { slug }) } catch { return null }
}