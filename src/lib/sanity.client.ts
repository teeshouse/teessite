import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

export const sanityClient = createClient({
  projectId: "zbeb0ctt",
  dataset:   "production",
  apiVersion: "2024-01-01",
  useCdn:    true
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}