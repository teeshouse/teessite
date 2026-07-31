"use client"
export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-amber no-print mt-8 mx-auto">
      Print / Save as PDF
    </button>
  )
}
