# MOVE2THEMAX — Automated Operations Stack

> **Priority: Reliability first, cost-efficiency second.**
> Designed for a Netherlands-based e-commerce + custom 3D printing business, starting with 3 people.

---

## Architecture Overview

```
Customer → Website (Shopify) → Order Management → 3D Print Queue
                ↓                      ↓                  ↓
        Support (Crisp)        Sendcloud (shipping)   OctoPrint/Obico
                ↓                      ↓                  ↓
        Moneybird (billing)    Customer Tracking     Filament Monitor
                ↓                      ↓                  ↓
              n8n (integration layer — self-hosted, connects everything)
```

---

## 1. E-commerce Platform

### ✅ Recommendation: **Shopify** (~€32–92/mo)

| Why Shopify |
|---|
| Most reliable hosted e-commerce platform globally (99.99% uptime SLA) |
| Native integrations with every tool in this stack |
| Built-in order management, inventory, customer portal |
| Dutch BTW (VAT) handling built-in |
| Handles EU VAT OSS natively |

**Plan:** Start on **Basic** (€32/mo) — upgrade to **Shopify** (€92/mo) when you need better reporting.

**Alternatives considered:** WooCommerce (self-hosted, less reliable), Lightspeed (NL-based, good but smaller ecosystem).

---

## 2. Customer Support Automation

### ✅ Recommendation: **Crisp** (~€25/mo for team plan)

**Why Crisp over Zendesk/Freshdesk/Intercom:**
- Purpose-built for small teams; Zendesk/Intercom are enterprise-priced
- AI chatbot included that handles FAQs (order status, return policy, product questions)
- Live chat + email + social media unified inbox
- Shopify integration — agents see order history inline in chat
- Dutch/EU data residency compliant (GDPR)
- Pricing: **Free** tier → **Pro €25/mo** (up to 4 agents)

**Automation setup:**
- AI bot handles: order status queries (auto-pulls from Shopify), FAQ, return requests
- Auto-assign tickets by category (shipping = agent A, product = agent B)
- Auto-close resolved tickets after 48h
- Canned responses for common 3D print questions (lead times, materials, colors)

**Escalation:** Unresolved AI chats auto-escalate to human agent with full context.

---

## 3. Order Tracking & Shipping Automation

### ✅ Recommendation: **Sendcloud** (free–€45/mo)

**Why Sendcloud is the right choice for NL:**
- Dutch company, specifically built for Netherlands/EU market
- Direct integrations with **PostNL, DHL, DPD, UPS, GLS, Bpost**
- Shopify plugin — orders automatically imported
- Automated tracking emails/SMS to customers in Dutch or English
- Branded tracking pages
- Return portal included
- Pricing: **Free** up to 400 shipments/mo → **Lite €45/mo** for growth features

**Automation workflow:**
1. Order placed in Shopify → auto-imported to Sendcloud
2. Print job completed (webhook from OctoPrint) → Sendcloud label auto-generated
3. Label printed, tracking number pushed back to Shopify → customer email sent automatically
4. Customer gets branded tracking page + automated updates at each carrier scan
5. Delivery confirmed → trigger follow-up review request email (via Shopify email or Klaviyo)

---

## 4. 3D Printer Monitoring & Management

### ✅ Recommendation: **OctoPrint** (free, self-hosted) + **Obico** (~€10/mo)

**Architecture:**
```
Raspberry Pi per printer → OctoPrint → Obico cloud layer → Dashboard + alerts
```

**OctoPrint** (open source, free):
- Industry standard for FDM printer monitoring
- Runs on a Raspberry Pi 4 (~€60 one-time per printer)
- Remote start/stop/pause via web interface
- Real-time webcam feed
- Plugins: `PrintTimeGenius` (accurate time estimates), `Gadget` (Bambu support if needed)

**Obico** (formerly The Spaghetti Detective):
- Cloud layer on top of OctoPrint — adds remote access from anywhere
- **AI failure detection** — detects spaghetti, layer shifts, critical failures; pauses automatically
- Mobile app notifications
- Multi-printer dashboard
- Pricing: **€10/mo** for up to 3 printers (scales)
- Self-hostable if you want full control later

**Filament monitoring:**
- Plugin: `Filament Manager` (OctoPrint) — tracks usage per spool per print
- Each spool logged with weight; plugin calculates remaining filament
- When spool hits threshold → trigger automated reorder (see Section 5)

---

## 5. Inventory & Filament Reordering

### ✅ Recommendation: **Shopify Inventory** + **n8n automation** for reorders

**Filament reorder automation (via n8n):**
1. OctoPrint Filament Manager webhook → n8n when filament drops below threshold
2. n8n checks current order queue (Shopify orders pending fulfillment)
3. Calculates forecast: open orders × avg filament per print × safety buffer
4. If stock projected to run out within 5 days → auto-generate purchase order
5. Send PO via email to your filament supplier (e.g., Fillamentum, Das Filament, eSun)
6. Log reorder in Moneybird as expected expense

**Order demand forecasting:**
- Use **Shopify Analytics** built-in reports for sales trends
- For more advanced forecasting: **Inventory Planner** (€99/mo — worthwhile at scale, skip initially)
- For now: weekly n8n report summarizing 30-day order velocity and projected filament need

---

## 6. Automated Billing & Invoicing

### ✅ Recommendation: **Moneybird** (€19–39/mo)

**Why Moneybird is the right choice for NL:**
- Dutch company, built specifically for Dutch tax law
- Native **BTW (VAT)** handling — 21%, 9%, 0% rates
- Automatic BTW return preparation (quarterly)
- Connects to Dutch banks (ING, Rabobank, ABN AMRO, Bunq) via direct bank sync
- Automatic invoice matching to bank transactions
- Shopify integration — orders → invoices automatically
- EU VAT OSS support
- Accountant access (share with your boekhouder directly)
- Pricing: **Starter €19/mo** → **Business €39/mo** (needed for multi-user + automations)

**Automation setup:**
- Shopify order paid → Moneybird invoice auto-generated and sent
- Recurring invoices for any subscription customers (auto-charge)
- Bank sync daily → transactions auto-matched to invoices
- Quarterly BTW return pre-filled — you just review and submit to Belastingdienst
- Monthly P&L and cashflow report auto-emailed to you

---

## 7. Financial Reporting

### Built into Moneybird:
- Real-time P&L dashboard
- Cashflow overview
- BTW reports (quarterly)
- Annual financial summary for accountant

**Additional:** Connect Moneybird to **Google Sheets** via n8n for custom dashboards if needed.

---

## 8. Integration Layer

### ✅ Recommendation: **n8n** (self-hosted, €0 infra cost on a small VPS)

**Why n8n over Zapier/Make:**

| Tool | Pros | Cons |
|---|---|---|
| **n8n** (self-hosted) | Free, unlimited workflows, full control, no per-task pricing | Requires VPS setup (~€5–10/mo on Hetzner) |
| Make (Integromat) | Easy UI, reliable cloud | €9–16/mo, per-operation costs add up |
| Zapier | Most integrations | Expensive at scale (€50+/mo), per-task pricing |

**Recommendation:** Host n8n on **Hetzner Cloud** (German datacenter, EU data residency) — CX11 server = **€3.79/mo**. Install takes ~30 minutes.

**Key n8n workflows to build:**
1. Shopify order → Sendcloud label + OctoPrint print queue notification
2. OctoPrint print complete → Sendcloud trigger shipment
3. Filament low → supplier reorder email
4. Moneybird overdue invoice → auto-reminder email
5. Weekly: Shopify sales report → email summary
6. Monthly: Moneybird P&L → email report
7. New Crisp ticket → Slack/Teams notification to team

---

## 9. Payroll Administration

### ✅ Recommendation: **Employes.nl** (~€6/employee/mo) or **Loonservice via accountant**

- Dutch payroll provider, handles loonheffing calculations automatically
- Generates payslips, files with UWV and Belastingdienst
- Alternative: Use your accountant's loon service if they offer it

---

## Total Monthly Cost Estimate

| Tool | Cost/mo |
|---|---|
| Shopify Basic | €32 |
| Crisp Pro | €25 |
| Sendcloud (Lite) | €45 |
| Obico (3 printers) | €10 |
| Moneybird Business | €39 |
| n8n (Hetzner VPS) | €4 |
| Employes.nl (3 staff) | €18 |
| **Total** | **~€173/mo** |

> For comparison: Enterprise alternatives (Zendesk + Zapier + Exact + Parcellab) would cost **€500–1500/mo** for the same functionality.

---

## Implementation Priority

### Phase 1 — Week 1–2 (Core)
1. Set up Shopify store
2. Set up Moneybird + bank sync
3. Set up Sendcloud + PostNL carrier connection

### Phase 2 — Week 3–4 (Automation)
4. Install OctoPrint on each printer (Raspberry Pi)
5. Set up Obico for remote monitoring
6. Deploy n8n on Hetzner + build core workflows

### Phase 3 — Month 2 (Support & Advanced)
7. Set up Crisp AI chatbot + train on FAQ
8. Build filament reorder automation in n8n
9. Build reporting dashboards

---

*Last updated: March 2026*
