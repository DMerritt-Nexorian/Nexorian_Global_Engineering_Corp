# Payment Provider Evaluation & Architecture Recommendation

**Nexorian Corporation / Executive Systems ARCS Group**
**Control Repository:** `Nexorian_Global_Engineering_Corp`
**Governance Standard:** Section 27–29 (Payment Architecture & Security Gates)

---

## Executive Summary

To commercialize software products across the Project Nexus portfolio while strict security and financial standards are maintained, Nexorian Corporation must implement a secure, provider-agnostic payment architecture.

**CRITICAL MANDATE:**
- **NO** personal bank credentials or direct personal account routing numbers shall ever be published on the public website.
- Payment processing must strictly rely on secure, server-side verified merchant architectures.

---

## Provider Comparison Matrix

| Evaluation Criterion | Option A: Stripe Checkout / Payment Links | Option B: Paddle (Merchant of Record) | Option C: Custom Direct Gateway |
|----------------------|-------------------------------------------|---------------------------------------|---------------------------------|
| **Role** | Payment Processor | Merchant of Record (MoR) | Direct Processor |
| **Global Sales Tax / VAT Handling** | Merchant Responsibility (Stripe Tax optional) | **Handled Automatically by Paddle** | Merchant Responsibility |
| **Digital Software Delivery** | Integrated or via Webhook | Built-in / Webhook entitlement | Custom Webhook |
| **Refunds & Chargeback Admin** | Managed by Nexorian via API/Dashboard | **Managed by Paddle as MoR** | Managed by Nexorian |
| **Subscription & One-Time Support** | Native (Stripe Billing) | Native | Custom Development |
| **Integration Complexity** | LOW / MODERATE | LOW / MODERATE | HIGH |
| **International Compliance Risk** | Moderate (Requires multi-state/country tax registrations) | **LOW** (Paddle acts as reseller of record) | High |
| **Recommended Use Case** | US/Direct Enterprise Sales & Custom Webhooks | **Global Software & Developer SDK Downloads** | N/A (Not Recommended) |

---

## Recommended Architecture: Provider-Agnostic Hybrid Gateway

The Executive Systems ARCS Group recommends implementing a **Provider Abstraction Layer** (`PaymentProviderAdapter` interface) in the Next.js web portal:

```
Customer
   ↓
Nexorian Product Page (/products/[id])
   ↓
Payment Provider Abstraction (Stripe / Paddle)
   ↓
Secure Provider Hosted Checkout
   ↓
Signed Server-Side Webhook Event (e.g. checkout.session.completed)
   ↓
HMAC Signature & Replay Verification
   ↓
Entitlement Service & License Key Generator
   ↓
Signed Expiring Download URL Generation
```

### Rationale
1. **Primary Recommendation for Global Digital Downloads:** **Paddle (Merchant of Record)**. Handling global VAT/GST sales tax compliance, chargeback mitigation, and digital distribution regulatory burdens automatically.
2. **Secondary Option for Direct B2B/Enterprise:** **Stripe Checkout**. Ideal for custom invoicing, enterprise ACH transfers, and US-centric commercial licensing.

---

## Production Security & Webhook Rules (Gate H3 Requirements)

1. **No Browser-Only Redirections:** Browser redirects to `?success=true` shall **NEVER** trigger license generation or artifact delivery.
2. **Mandatory Webhook Verification:** Webhook endpoints must verify HMAC SHA-256 signatures using secret environment variables (`PAYMENT_WEBHOOK_SECRET`).
3. **Idempotency & Replay Protection:** Webhook events are logged and idempotency keys checked before entitlement issuance.
4. **Environment Isolation:** Live keys (`sk_live_...`) remain isolated from non-production staging environments. Test mode (`sk_test_...` or Paddle Sandbox) is strictly enforced in Phase 1.
