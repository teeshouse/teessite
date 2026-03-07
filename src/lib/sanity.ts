import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImage } from "@/types"

export const sanityClient = createClient({
  projectId:  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:    process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN
})

const builder = imageUrlBuilder(sanityClient)
export function urlFor(source: SanityImage) { return builder.image(source) }

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]`)
}
export async function getFeaturedPrograms() {
  return sanityClient.fetch(`*[_type == "program" && featured == true] | order(_createdAt desc)[0...3] { _id, title, slug, status, category, description, image }`)
}
export async function getAllPrograms() {
  return sanityClient.fetch(`*[_type == "program"] | order(year desc) { _id, title, slug, status, year, category, description, image, featured }`)
}
export async function getProgramBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "program" && slug.current == $slug][0]`, { slug })
}
export async function getFeaturedNews() {
  return sanityClient.fetch(`*[_type == "news" && featured == true] | order(publishedAt desc)[0...3] { _id, title, slug, publishedAt, excerpt, featuredImage, tags }`)
}
export async function getAllNews() {
  return sanityClient.fetch(`*[_type == "news"] | order(publishedAt desc) { _id, title, slug, publishedAt, excerpt, featuredImage, tags, featured }`)
}
export async function getNewsBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "news" && slug.current == $slug][0]`, { slug })
}
export async function getVolunteerRoles() {
  return sanityClient.fetch(`*[_type == "volunteerRole" && active == true] | order(order asc) { _id, title, icon, description, responsibilities, active, order }`)
}
export async function getImpactStats() {
  return sanityClient.fetch(`*[_type == "impactStat"] | order(order asc) { _id, label, value, icon, order }`)
}