# MOVE2THEMAX — Founder To-Do List
## Launching in the Netherlands with 3 People

> Your personal action list as the business founder. Organised by phase.
> Items marked 🔴 are legally required. Items marked 🟡 are strongly recommended. Items marked 🟢 are operational.

---

## PHASE 0 — Before You Trade (Do these FIRST)

### Legal Structure
- [ ] 🔴 **Decide legal entity** — BV is recommended if 2+ founders or expecting to grow. Eenmanszaak if solo and starting small.
- [ ] 🔴 **Find a notaris** — get quotes for BV incorporation (verwachte kosten: €500–1500). Try Ligo.nl or De Notaristelefoon for affordable online notaries.
- [ ] 🔴 **Draft a shareholders agreement** (aandeelhoudersovereenkomst) if there are 2+ founders — what happens if someone leaves, how decisions are made, how profits split. Hire a lawyer for this (€500–2000).
- [ ] 🔴 **Register at KVK** — book appointment at kvk.nl. Cost: €75 registration fee. Bring valid ID.
- [ ] 🔴 **Open a zakelijke bankrekening** — Bunq Business (€9/mo) is cheapest and works well. Apply online. Required before KVK finalisation for BV.

### Tax Registration
- [ ] 🔴 **Register for BTW** — happens automatically when KVK-registered, but confirm with Belastingdienst you have your BTW-nummer
- [ ] 🔴 **Register as inhoudingsplichtige** (payroll tax withholding) at Belastingdienst before you pay your first employee
- [ ] 🟡 **Hire a boekhouder (accountant/bookkeeper)** — find a Dutch-speaking accountant familiar with e-commerce and manufacturing. Budget: €100–250/mo for small business bookkeeping. Ask KVK for referrals or use accountantskantoor.nl

### Insurance
- [ ] 🔴 **Get Bedrijfsaansprakelijkheidsverzekering (AVB)** with product liability — get quotes from Hiscox, Interpolis, or your bank's insurer. Budget: €300–800/year.
- [ ] 🟡 **Get Arbeidsongeschiktheidsverzekering (AOV)** for yourself — if you can't work, you have no income. Essential for founders. Get quotes via a financial advisor or Independer.nl.
- [ ] 🟡 **Get Inventarisverzekering** — insure your 3D printers and equipment at replacement value.
- [ ] 🟡 **Register with an Arbodienst** before your first employee starts — required by law. Basic contract ~€300–600/year.

---

## PHASE 1 — Hiring Your 3 People

- [ ] 🔴 **Draft employment contracts** for each employee — use a Dutch HR lawyer or template from CNV/FNV or a reputable HR service. Must be in Dutch or with Dutch translation.
- [ ] 🔴 **Check if a CAO applies** to your sector — ask your accountant or an HR advisor.
- [ ] 🔴 **Verify minimum wage compliance** — check current WML at rijksoverheid.nl/onderwerpen/minimumloon
- [ ] 🔴 **Register employees with UWV** via the loonheffing system (your payroll software handles this)
- [ ] 🔴 **Set up payroll administration** — sign up for Employes.nl (~€6/employee/mo) or have your accountant handle it. Do not do payroll manually.
- [ ] 🔴 **Conduct RI&E** (workplace risk assessment) — required when you have employees. Use a certified arbodeskundige. Your Arbodienst can provide this.
- [ ] 🟡 **Write your Arbobeleid** (H&S policy document) — your accountant or Arbodienst can help.
- [ ] 🟡 **Set up employee handbook** (personeelshandboek) — vacation requests, sick day procedure, expense claims. Even informal is fine at 3 people.
- [ ] 🟢 **Set clear roles and responsibilities** for 3 people — who handles customer support, who manages printers, who does logistics/packing?

---

## PHASE 2 — Legal Documents for the Website

- [ ] 🔴 **Algemene Voorwaarden (T&Cs)** — have a Dutch lawyer draft or review these. Key clauses: custom products exempt from return right, IP indemnification, liability limitation. Cost: €200–500 for a good template reviewed by lawyer.
- [ ] 🔴 **Privacyverklaring (Privacy Policy)** — required by AVG/GDPR. Use a GDPR-compliant generator or lawyer. Must explain: what data, why, how long, who receives it.
- [ ] 🔴 **Cookie consent banner** — install Cookiebot or CookieYes on Shopify. Free tiers available.
- [ ] 🔴 **Website mandatory information** — add to your website footer:
  - Company name + address
  - KVK-nummer
  - BTW-nummer
  - Email address
  - Link to T&Cs and Privacy Policy
- [ ] 🟡 **EUIPO Trademark** — register "MOVE2THEMAX" as EU trademark (~€850 for 1 class). File at euipo.europa.eu. Protects your brand across all 27 EU countries.

---

## PHASE 3 — Technical & Operations Setup

### E-commerce
- [ ] 🟢 **Set up Shopify store** — choose theme, add products, configure payment methods (iDEAL via Mollie or Shopify Payments)
- [ ] 🟢 **Configure Dutch BTW rates** in Shopify — 21% on standard products
- [ ] 🟢 **Connect Sendcloud** to Shopify — set up PostNL and/or DHL carrier accounts
- [ ] 🟢 **Connect Moneybird** to Shopify — auto-invoice generation on order payment
- [ ] 🟢 **Set up iDEAL payments** — essential for Dutch customers. Use Mollie (most popular in NL) or Shopify Payments.
- [ ] 🟢 **Configure Klarna/Afterpay** — "buy now pay later" — very popular in NL e-commerce, increases conversion

### 3D Printing Infrastructure
- [ ] 🟢 **Install Raspberry Pi + OctoPrint on each printer** — get RPi 4 (2GB) per printer
- [ ] 🟢 **Add webcam to each printer** for remote monitoring
- [ ] 🟢 **Set up Obico** — connect OctoPrint instances, set up failure detection alerts
- [ ] 🟢 **Install Filament Manager plugin** on OctoPrint — log all spools, set low-stock alerts
- [ ] 🟢 **Create print queue workflow** — how does a Shopify order become a print job? Define your process.

### Automation
- [ ] 🟢 **Set up Hetzner VPS** (CX11, ~€4/mo) and install n8n — follow n8n.io self-host docs
- [ ] 🟢 **Build Shopify → Sendcloud automation** — order paid → label generated
- [ ] 🟢 **Build print complete → ship automation** — OctoPrint webhook → Sendcloud trigger
- [ ] 🟢 **Build filament low → reorder automation** — OctoPrint → email to supplier
- [ ] 🟢 **Set up Crisp** chatbot — train AI on your FAQ, product info, lead times

### Finance
- [ ] 🔴 **Set up Moneybird** — connect business bank account, configure BTW settings
- [ ] 🔴 **Set up quarterly BTW reminder** in your calendar (Jan 31, Apr 30, Jul 31, Oct 31)
- [ ] 🟡 **Set up monthly P&L review** — Moneybird automated report emailed to you on 1st of each month

---

## PHASE 4 — Ongoing Compliance (Recurring)

### Monthly
- [ ] 🔴 File and pay **loonheffing** (payroll tax) by end of month
- [ ] 🟢 Review bank reconciliation in Moneybird
- [ ] 🟢 Review customer support metrics in Crisp
- [ ] 🟢 Review printer uptime and filament levels

### Quarterly
- [ ] 🔴 File and pay **BTW return** (January, April, July, October)
- [ ] 🟡 Review P&L vs. targets
- [ ] 🟢 Review order fulfillment SLAs
- [ ] 🟢 Check if operational stack needs adjustments

### Annually
- [ ] 🔴 File **Vpb return** (corporate tax) within 6 months of year end
- [ ] 🔴 Pay **vakantiegeld** to employees (by June 1)
- [ ] 🔴 Update **RI&E** if workspace or activities change significantly
- [ ] 🟡 Review and renew insurance policies
- [ ] 🟡 Review employee contracts and salaries
- [ ] 🟡 Annual financial review with accountant

---

## KEY CONTACTS TO ESTABLISH

- [ ] **Notaris** — for BV incorporation
- [ ] **Boekhouder/Accountant** — ongoing bookkeeping + tax filings
- [ ] **HR/arbeidsrecht lawyer** — employment contracts, CAO advice
- [ ] **Arbodienst** — occupational health, RI&E
- [ ] **Verzekeringsadviseur** — insurance broker for AVB, AOV, inventory
- [ ] **Filament supplier(s)** — account + automated reorder contact

---

## ESTIMATED STARTUP COSTS

| Item | One-Time Cost |
|---|---|
| KVK registration (BV) | €75 |
| Notaris (BV incorporation) | €500–1,500 |
| Lawyer (shareholders agreement) | €500–2,000 |
| Lawyer (T&Cs review) | €200–500 |
| EUIPO trademark | €850 |
| Raspberry Pi × number of printers | €60/printer |
| Webcams × printers | €30/printer |
| Business insurance (first year) | €300–800 |
| Accountant setup fee | €0–500 |
| **Estimated total (low end)** | **~€2,500** |
| **Estimated total (high end)** | **~€7,000** |

---

## USEFUL DUTCH RESOURCES

- **KVK.nl** — business registration, guides for entrepreneurs
- **Belastingdienst.nl** — tax portal, BTW registration, loonheffing
- **UWV.nl** — employee insurance, sick pay, unemployment
- **Rijksoverheid.nl** — minimum wage, employment law
- **ACM.nl** — consumer protection rules
- **AP.nl (Autoriteit Persoonsgegevens)** — GDPR/AVG guidance
- **EUIPO.europa.eu** — EU trademark registration
- **Ruimtelijkeplannen.nl** — check zoning for your address

---

*Last updated: March 2026. This is a practical guide, not legal advice. Always verify with qualified Dutch professionals.*
