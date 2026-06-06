"use client"

import { useEffect } from "react"

/* ── Hosted-buttons SDK (Thrive Monthly - LOCAL PICKUP & SHIPPED) ── */
const HOSTED_SDK =
  "https://www.paypal.com/sdk/js?client-id=BAAFZPiewTVJrcnIsMloOBvO6K7aauWAeHysIf8zGj0dll6AAuWq6fcBH59SbN-bxD7qOvC-wq2SDxPwzI&components=hosted-buttons&enable-funding=venmo&currency=USD"

/* ── Subscription SDK (Grow & Glow LOCAL PICKUP) ─────────────────── */
const SUB_SDK =
  "https://www.paypal.com/sdk/js?client-id=BAAHdAcMm8cZkXhgCS1MWh2p235j-5EOEO3lMUqP4uiGC9gU_3yT8TIegt0ofrx6altEjfd4Sjr2MhtWWY&vault=true&intent=subscription"

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src^="${src.split("?")[0]}"]`)) {
      resolve()
      return
    }
    const s = document.createElement("script")
    s.src = src
    s.onload  = () => resolve()
    s.onerror = reject
    document.head.appendChild(s)
  })
}

/* ── Hosted button (PayPal-rendered, includes PayPal + Venmo) ─────── */
export function PayPalHostedButton({ buttonId, label }: { buttonId: string; label?: string }) {
  const containerId = `pp-hosted-${buttonId}`

  useEffect(() => {
    let cancelled = false
    loadScript(HOSTED_SDK)
      .then(() => {
        if (cancelled) return
        const win = window as any
        if (win.paypal?.HostedButtons) {
          win.paypal.HostedButtons({ hostedButtonId: buttonId }).render(`#${containerId}`)
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

/* ── Subscription button (recurring plan) ────────────────────────── */
export function PayPalSubscriptionButton({ planId }: { planId: string }) {
  const containerId = `pp-sub-${planId}`

  useEffect(() => {
    let cancelled = false
    loadScript(SUB_SDK)
      .then(() => {
        if (cancelled) return
        const win = window as any
        if (win.paypal?.Buttons) {
          win.paypal.Buttons({
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
