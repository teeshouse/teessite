// Documents attached to task notes: PNG, PDF, or DOCX only.
// The extension, the file's own first bytes, and (for DOCX) its internal
// structure must all agree, so a renamed file of another type is refused.

export const TASK_FILE_MAX_COUNT = 3
// Vercel rejects request bodies over 4.5 MB, so the files in one note share 4 MB.
export const TASK_FILE_MAX_TOTAL_BYTES = 4 * 1024 * 1024
export const TASK_FILE_ACCEPT = ".png,.pdf,.docx"
export const TASK_FILES_BUCKET = "mentorship-task-files"

const TYPES: Record<string, { contentType: string; signature: number[] }> = {
  png:  { contentType: "image/png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  pdf:  { contentType: "application/pdf", signature: [0x25, 0x50, 0x44, 0x46] },
  docx: {
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    signature: [0x50, 0x4b, 0x03, 0x04],
  },
}

export type TaskFileCheck =
  | { ok: true; ext: string; contentType: string; safeName: string }
  | { ok: false; error: string }

export function safeFileName(name: string, ext: string): string {
  const base = name.split(/[\\/]/).pop() ?? ""
  const stem = base.replace(/\.[^.]*$/, "").replace(/[^\w .()-]+/g, "").trim().slice(0, 80) || "document"
  return `${stem}.${ext}`
}

export function validateTaskFile(name: string, bytes: Uint8Array): TaskFileCheck {
  const ext = (name.split(".").pop() ?? "").toLowerCase()
  const type = TYPES[ext]
  if (!type) return { ok: false, error: "Only PNG, PDF, and DOCX files can be uploaded." }
  if (bytes.length === 0) return { ok: false, error: "That file is empty." }
  if (!type.signature.every((b, i) => bytes[i] === b)) {
    return { ok: false, error: `"${name}" doesn't look like a real ${ext.toUpperCase()} file.` }
  }
  // A DOCX is a zip that contains word/document.xml; other zips (xlsx, pptx, plain zip) do not.
  if (ext === "docx" && !Buffer.from(bytes).includes("word/document.xml")) {
    return { ok: false, error: `"${name}" doesn't look like a real DOCX file.` }
  }
  return { ok: true, ext, contentType: type.contentType, safeName: safeFileName(name, ext) }
}

/** Checks the count and combined size of the files sent with one note. */
export function validateTaskFileBatch(sizes: number[]): string | null {
  if (sizes.length > TASK_FILE_MAX_COUNT) return `You can attach up to ${TASK_FILE_MAX_COUNT} files at a time.`
  if (sizes.reduce((a, b) => a + b, 0) > TASK_FILE_MAX_TOTAL_BYTES) return "Files are too large. Keep them under 4 MB in total."
  return null
}
