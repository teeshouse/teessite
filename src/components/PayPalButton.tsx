"use client"

import { useEffect } from "react"

/* ── SDK URLs ────────────────────────────────────────────────────── */
const HOSTED_SDK =
  "https://www.paypal.com/sdk/js?client-id=BAAFZPiewTVJrcnIsMloOBvO6K7aauWAeHysIf8zGj0dll6AAuWq6fcBH59SbN-bxD7qOvC-wq2SDxPwzI&components=hosted-buttons&enable-funding=venmo&currency=USD"

const SUB_SDK =
  "https://www.paypal.com/sdk/js?client-id=BAAHdAcMm8cZkXhgCS1MWh2p235j-5EOEO3lMUqP4uiGC9gU_3yT8TIegt0ofrx6altEjfd4Sjr2MhtWWY&vault=true&intent=subscription"

/* Each SDK gets its own namespace so they don't overwrite window.paypal */
const HOSTED_NS = "paypalHosted"
const SUB_NS    = "paypalSub"

function loadScript(src: string, namespace: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded if namespace exists on window
    if ((window as any)[namespace]) { resolve(); return }
    // Already injected but still loading
    const existing = document.querySelector(`script[data-pp-namespace="${namespace}"]`)
    if (existing) {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", reject)
      return
    }
    const s = document.createElement("script")
    s.src = src
    s.setAttribute("data-namespace", namespace)
    s.setAttribute("data-pp-namespace", namespace)
    s.onload  = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/* ── Hosted button (Grow & Glow — PayPal + Venmo) ────────────────── */
export function PayPalHostedButton({ buttonId, label }: { buttonId: string; label?: string }) {
  const containerId = `pp-hosted-${buttonId}`

  useEffect(() => {
    let cancelled = false
    loadScript(HOSTED_SDK, HOSTED_NS)
      .then(() => {
        if (cancelled) return
        const pp = (window as any)[HOSTED_NS]
        if (pp?.HostedButtons) {
          pp.HostedButtons({ hostedButtonId: buttonId }).render(`#${containerId}`)
        }
      })
      .catch(console.error)
    return () => { cancelled = true }
  }, [buttonId, containerId])

  return (
    <div>
      {label && (
        <p className="text-xs font-bold uppercase tracking-widest text-gray-muted mb-2 text-center">{label}</p>
      )}
      <div id={containerId} />
    </div>
  )
}

/* ── Subscription button (Thrive Monthly) ────────────────────────── */
export function PayPalSubscriptionButton({ planId }: { planId: string }) {
  const containerId = `pp-sub-${planId}`

  useEffect(() => {
    let cancelled = false
    loadScript(SUB_SDK, SUB_NS)
      .then(() => {
        if (cancelled) return
        const pp = (window as any)[SUB_NS]
        if (pp?.Buttons) {
          pp.Buttons({
            style: { shape: "pill", color: "gold", layout: "vertical", label: "subscribe" },
            createSubscription: (_: any, actions: any) =>
              actions.subscription.create({ plan_id: planId, quantity: 1 }),
            onApprove: (data: any) => {
              alert(`Thank you! Your subscription ID: ${data.subscriptionID}`)
            },
          }).render(`#${containerId}`)
        }
      })
      .catch(console.error)
    return () => { cancelled = true }
  }, [planId, containerId])

  return <div id={containerId} />
}
