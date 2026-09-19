import type { ScopeAnswers, ScopeQuestion } from "@/types/scopeStudio";
export function listAnswer(a: ScopeAnswers, key: string): string[] {
  return Array.isArray(a[key]) ? (a[key] as string[]) : [];
}
export function numberAnswer(
  a: ScopeAnswers,
  key: string,
  field: string,
): number {
  const v = a[key];
  return v && typeof v === "object" && !Array.isArray(v)
    ? Number(v[field] ?? 0)
    : 0;
}
export const SCOPE_QUESTIONS: ScopeQuestion[] = [
  /* --- 1 background --- */
  {
    id: "company",
    sec: "background",
    type: "shorttext",
    req: true,
    quick: true,
    q: "What is the name of your organisation?",
    hint: "Used on the cover page. You can hide it from vendors later.",
    placeholder: "e.g. Meridian Motors (Pvt) Ltd",
  },

  {
    id: "industry",
    sec: "background",
    type: "single",
    req: true,
    quick: true,
    q: "Which industry are you in?",
    hint: "This drives the process list and the localisation checks.",
    options: [
      {
        v: "auto",
        l: "Automotive & mobility",
        s: "OEM, assembly, CKD/CBU, dealers",
      },
      {
        v: "disc",
        l: "Discrete manufacturing",
        s: "Machinery, electronics, components",
      },
      {
        v: "proc",
        l: "Process & chemicals",
        s: "Batch, formula, recipe-driven",
      },
      {
        v: "retail",
        l: "Retail & distribution",
        s: "Wholesale, FMCG distribution, POS",
      },
      { v: "pharma", l: "Pharma & healthcare", s: "GxP, batch traceability" },
      {
        v: "epc",
        l: "Construction & EPC",
        s: "Project-driven, milestone billing",
      },
      {
        v: "svc",
        l: "Services & professional",
        s: "Billable projects, no inventory",
      },
      { v: "other", l: "Something else" },
    ],
  },

  {
    id: "revenue",
    sec: "background",
    type: "single",
    quick: true,
    q: "Roughly what is your annual revenue?",
    hint: "Vendors size the team from this. A band is enough.",
    options: [
      { v: "a", l: "Under $10m" },
      { v: "b", l: "$10m – $50m" },
      { v: "c", l: "$50m – $250m" },
      { v: "d", l: "$250m – $1bn" },
      { v: "e", l: "Over $1bn" },
      { v: "x", l: "Prefer not to say" },
    ],
  },

  {
    id: "headcount",
    sec: "background",
    type: "single",
    q: "How many people does the organisation employ?",
    options: [
      { v: "a", l: "Under 100" },
      { v: "b", l: "100 – 500" },
      { v: "c", l: "500 – 2,000" },
      { v: "d", l: "2,000 – 10,000" },
      { v: "e", l: "Over 10,000" },
    ],
  },

  {
    id: "entities",
    sec: "background",
    type: "numbers",
    req: true,
    quick: true,
    q: "How many legal entities are in scope?",
    hint: "Company codes in SAP terms. Count only what this project covers.",
    fields: [
      { k: "legal", l: "Legal entities", d: 1 },
      { k: "ccy", l: "Currencies used", d: 1 },
    ],
  },

  {
    id: "intercompany",
    sec: "background",
    type: "single",
    showIf: (a) => (numberAnswer(a, "entities", "legal") || 1) > 1,
    q: "Do these entities trade with each other?",
    hint: "Intercompany design is one of the biggest cost drivers in a multi-entity build.",
    options: [
      {
        v: "heavy",
        l: "Yes — routinely",
        s: "Sales, stock transfers, shared services",
      },
      { v: "light", l: "Occasionally", s: "A few transactions a month" },
      { v: "no", l: "No — they operate independently" },
    ],
  },

  {
    id: "countries",
    sec: "background",
    type: "multi",
    req: true,
    quick: true,
    q: "Which countries will the system operate in?",
    hint: "Each country adds statutory localisation and testing effort.",
    options: [
      { v: "pk", l: "Pakistan" },
      { v: "ae", l: "UAE" },
      { v: "sa", l: "Saudi Arabia" },
      { v: "qa", l: "Qatar" },
      { v: "om", l: "Oman" },
      { v: "bh", l: "Bahrain" },
      { v: "uk", l: "United Kingdom" },
      { v: "other", l: "Elsewhere" },
    ],
  },

  /* --- 2 objectives --- */
  {
    id: "drivers",
    sec: "objectives",
    type: "multi",
    req: true,
    quick: true,
    q: "Why are you doing this now?",
    hint: "Pick everything that applies. Vendors read this section first.",
    options: [
      { v: "eol", l: "Legacy system is end-of-life" },
      { v: "group", l: "Group or parent company mandate" },
      { v: "growth", l: "Growth — current system will not scale" },
      { v: "comp", l: "Statutory or regulatory compliance" },
      { v: "vis", l: "No real-time visibility or reliable reporting" },
      { v: "cost", l: "Cost reduction" },
      { v: "ma", l: "Merger or acquisition integration" },
      { v: "manual", l: "Too much runs on spreadsheets" },
    ],
  },

  {
    id: "complianceDriver",
    sec: "objectives",
    type: "multi",
    showIf: (a) => listAnswer(a, "drivers").includes("comp"),
    q: "Which compliance requirement is driving it?",
    options: [
      { v: "einv", l: "Digital / e-invoicing mandate" },
      { v: "tax", l: "Tax authority integration" },
      { v: "ifrs", l: "IFRS or group reporting standard" },
      { v: "audit", l: "Audit findings to close" },
      { v: "ind", l: "Industry-specific regulation" },
    ],
  },

  {
    id: "success",
    sec: "objectives",
    type: "multi",
    req: true,
    q: "What would make this project a success?",
    hint: "These become the acceptance themes vendors are measured against.",
    options: [
      { v: "sot", l: "One source of truth across entities" },
      { v: "close", l: "Faster and cleaner month-end close" },
      { v: "inv", l: "Accurate, real-time inventory" },
      { v: "otc", l: "Shorter order-to-cash cycle" },
      { v: "audit", l: "Audit-ready without manual reconciliation" },
      { v: "self", l: "Self-service reporting for management" },
      { v: "mob", l: "Mobile access for field and plant staff" },
    ],
  },

  /* --- 3 scope --- */
  {
    id: "modules",
    sec: "scope",
    type: "multi",
    req: true,
    quick: true,
    q: "Which business areas are in scope?",
    hint: "Not sure of the SAP names? Pick by what the team does.",
    options: [
      { v: "FI", l: "Finance & accounting", s: "FI" },
      { v: "CO", l: "Costing & profitability", s: "CO" },
      { v: "MM", l: "Purchasing & inventory", s: "MM" },
      { v: "SD", l: "Sales & billing", s: "SD" },
      { v: "LE", l: "Warehouse & logistics", s: "LE / EWM" },
      { v: "PP", l: "Production planning", s: "PP" },
      { v: "QM", l: "Quality management", s: "QM" },
      { v: "PM", l: "Plant maintenance", s: "PM / EAM" },
      { v: "PS", l: "Project systems", s: "PS" },
      { v: "HR", l: "HR & payroll", s: "SuccessFactors" },
      { v: "AN", l: "Analytics & dashboards", s: "Embedded / SAC" },
    ],
  },

  {
    id: "mfgType",
    sec: "scope",
    type: "single",
    showIf: (a) => listAnswer(a, "modules").includes("PP"),
    q: "What kind of manufacturing is it?",
    options: [
      { v: "disc", l: "Discrete", s: "Assembled from a bill of materials" },
      { v: "proc", l: "Process", s: "Recipes, batches, co-products" },
      { v: "rep", l: "Repetitive", s: "High volume, continuous line" },
      { v: "x", l: "Not sure" },
    ],
  },

  {
    id: "channels",
    sec: "scope",
    type: "multi",
    showIf: (a) => listAnswer(a, "modules").includes("SD"),
    q: "How do you sell?",
    options: [
      { v: "b2b", l: "Direct B2B" },
      { v: "dealer", l: "Dealer / distributor network" },
      { v: "retail", l: "Own retail & POS" },
      { v: "ecom", l: "E-commerce" },
      { v: "export", l: "Export" },
      { v: "proj", l: "Project / contract sales" },
    ],
  },

  {
    id: "deployment",
    sec: "scope",
    type: "single",
    req: true,
    quick: true,
    q: "How do you want SAP deployed?",
    hint: "If you are unsure, say so — vendors will propose and justify.",
    help: {
      t: "Which deployment model?",
      b: "RISE private cloud gives you a dedicated S/4HANA system you can still modify, hosted by SAP. RISE public cloud (Cloud ERP) is cheaper and upgraded automatically, but limits custom code to extensions. On-premise means you own the servers and the upgrade cycle.",
    },
    options: [
      {
        v: "rise_priv",
        l: "RISE — private cloud",
        s: "Dedicated, still customisable",
      },
      {
        v: "rise_pub",
        l: "RISE — public cloud",
        s: "Standardised, auto-upgraded",
      },
      { v: "onprem", l: "On-premise", s: "Our own or partner data centre" },
      { v: "x", l: "Not sure — vendor to advise" },
    ],
  },

  {
    id: "rollout",
    sec: "scope",
    type: "single",
    req: true,
    quick: true,
    q: "How should it be rolled out?",
    help: {
      t: "Big bang or phased?",
      b: "Big bang cuts over everything at once — shorter overall, higher risk on go-live weekend. Phased spreads risk but means running two systems in parallel and building temporary interfaces, which adds 15–25% to cost.",
    },
    options: [
      { v: "bang", l: "Big bang", s: "Everything live on one date" },
      { v: "entity", l: "Phased by entity" },
      { v: "module", l: "Phased by module" },
      { v: "pilot", l: "Pilot entity, then template rollout" },
      { v: "x", l: "Not sure — vendor to advise" },
    ],
  },

  {
    id: "licences",
    sec: "scope",
    type: "single",
    q: "Who is buying the SAP licences?",
    hint: "This must be explicit or you cannot compare quotes.",
    options: [
      { v: "client", l: "We buy direct from SAP" },
      { v: "vendor", l: "Vendor to include licences in their quote" },
      { v: "advise", l: "Vendor to advise, priced separately" },
    ],
  },

  /* --- 4 landscape --- */
  {
    id: "currentErp",
    sec: "landscape",
    type: "single",
    req: true,
    quick: true,
    q: "What runs the business today?",
    options: [
      { v: "ecc", l: "SAP ECC" },
      { v: "b1", l: "SAP Business One" },
      { v: "oracle", l: "Oracle" },
      { v: "dyn", l: "Microsoft Dynamics" },
      { v: "local", l: "Local or custom-built system" },
      { v: "sheets", l: "Spreadsheets and standalone apps" },
      { v: "none", l: "Nothing formal" },
    ],
  },

  {
    id: "integrations",
    sec: "landscape",
    type: "multi",
    req: true,
    quick: true,
    q: "What must SAP talk to?",
    hint: "Every interface is a line item vendors will price. Be complete.",
    options: [
      { v: "wms", l: "Warehouse system (WMS)" },
      { v: "crm", l: "CRM" },
      { v: "hr", l: "HR / payroll" },
      { v: "bank", l: "Banking & payments" },
      { v: "pos", l: "Retail POS" },
      { v: "ecom", l: "E-commerce platform" },
      { v: "dealer", l: "Dealer or customer portal" },
      { v: "tax", l: "Tax authority portal" },
      { v: "mes", l: "Shop floor / MES" },
      { v: "bi", l: "BI or reporting tool" },
      { v: "3pl", l: "3PL / logistics provider" },
      { v: "none", l: "Nothing — SAP stands alone" },
    ],
  },

  {
    id: "migrationObjects",
    sec: "landscape",
    type: "multi",
    req: true,
    q: "What data has to move into SAP?",
    hint: "Migration is where projects slip. Naming it early is worth real money.",
    options: [
      { v: "coa", l: "Chart of accounts" },
      { v: "gl", l: "GL opening balances" },
      { v: "arap", l: "Open AR / AP" },
      { v: "cust", l: "Customer master" },
      { v: "vend", l: "Vendor master" },
      { v: "mat", l: "Material master" },
      { v: "bom", l: "BOMs & routings" },
      { v: "po", l: "Open purchase orders" },
      { v: "so", l: "Open sales orders" },
      { v: "stock", l: "Inventory balances" },
      { v: "fa", l: "Fixed assets" },
      { v: "hist", l: "Historical transactions" },
    ],
  },

  {
    id: "historyYears",
    sec: "landscape",
    type: "single",
    showIf: (a) => listAnswer(a, "migrationObjects").includes("hist"),
    q: "How many years of history?",
    hint: "Historical data migration is often the single most underestimated task.",
    options: [
      { v: "1", l: "1 year" },
      { v: "2", l: "2 years" },
      { v: "3", l: "3 or more years" },
      { v: "x", l: "Not decided" },
    ],
  },

  /* --- 5 volumetrics --- */
  {
    id: "users",
    sec: "volumetrics",
    type: "single",
    req: true,
    quick: true,
    q: "How many people will use SAP?",
    hint: "Named users, not concurrent. Include occasional approvers.",
    options: [
      { v: "a", l: "Under 25" },
      { v: "b", l: "25 – 75" },
      { v: "c", l: "75 – 200" },
      { v: "d", l: "200 – 500" },
      { v: "e", l: "Over 500" },
    ],
  },

  {
    id: "txnVolume",
    sec: "volumetrics",
    type: "single",
    req: true,
    q: "Roughly how many documents do you process a month?",
    hint: "Invoices, orders, goods movements — all together.",
    options: [
      { v: "a", l: "Under 1,000" },
      { v: "b", l: "1,000 – 10,000" },
      { v: "c", l: "10,000 – 50,000" },
      { v: "d", l: "50,000 – 200,000" },
      { v: "e", l: "Over 200,000" },
    ],
  },

  {
    id: "masterData",
    sec: "volumetrics",
    type: "numbers",
    req: true,
    q: "How big is your master data?",
    hint: "Approximate active record counts. Vendors price migration from these.",
    fields: [
      { k: "mat", l: "Material / SKU records", d: 5000 },
      { k: "cust", l: "Customers", d: 800 },
      { k: "vend", l: "Vendors", d: 400 },
    ],
  },

  {
    id: "sites",
    sec: "volumetrics",
    type: "numbers",
    req: true,
    quick: true,
    q: "How many physical locations?",
    fields: [
      { k: "plant", l: "Plants / factories", d: 1 },
      { k: "wh", l: "Warehouses", d: 2 },
      { k: "office", l: "Sales offices / branches", d: 3 },
    ],
  },

  {
    id: "ricefw",
    sec: "volumetrics",
    type: "single",
    q: "How much custom development do you expect?",
    hint: 'Reports, interfaces, conversions, enhancements, forms and workflows — "RICEFW" objects.',
    help: {
      t: "How many custom objects is normal?",
      b: "A clean-core implementation aims to stay in standard SAP. In practice every project has some: statutory forms, interfaces to local systems, and a handful of reports the business will not give up.",
    },
    options: [
      { v: "a", l: "Under 20", s: "Near-standard" },
      { v: "b", l: "20 – 50", s: "Typical mid-market" },
      { v: "c", l: "50 – 100", s: "Heavily tailored" },
      { v: "d", l: "Over 100" },
      { v: "x", l: "No idea — set a sensible ceiling" },
    ],
  },

  /* --- 6 compliance --- */
  {
    id: "localisation",
    sec: "compliance",
    type: "multi",
    req: true,
    q: "Which statutory requirements must be met?",
    hint: "Pre-selected from the countries you chose. Add anything missing.",
    dynamic: "localisation",
  },

  {
    id: "audit",
    sec: "compliance",
    type: "multi",
    q: "Any audit or security requirements?",
    options: [
      { v: "sod", l: "Segregation of duties" },
      { v: "trail", l: "Full audit trail on financial postings" },
      { v: "sox", l: "SOX-style internal controls" },
      { v: "res", l: "Data residency in-country" },
      { v: "iso", l: "ISO 27001 alignment" },
      { v: "none", l: "Nothing beyond standard" },
    ],
  },

  /* --- 7 timeline --- */
  {
    id: "golive",
    sec: "timeline",
    type: "single",
    req: true,
    quick: true,
    q: "When do you want to be live?",
    options: [
      { v: "6", l: "Within 6 months" },
      { v: "9", l: "6 – 9 months" },
      { v: "12", l: "9 – 12 months" },
      { v: "18", l: "12 – 18 months" },
      { v: "x", l: "Flexible — advise us" },
    ],
  },

  {
    id: "deadlineDriver",
    sec: "timeline",
    type: "single",
    q: "Is anything forcing that date?",
    hint: "A real deadline changes how vendors staff the project.",
    options: [
      { v: "fy", l: "Start of our fiscal year" },
      { v: "contract", l: "Legacy licence or contract expiry" },
      { v: "group", l: "Group mandate" },
      { v: "launch", l: "A plant or product launch" },
      { v: "none", l: "No hard deadline" },
    ],
  },

  /* --- 8 commercials --- */
  {
    id: "pricingModel",
    sec: "commercials",
    type: "single",
    req: true,
    quick: true,
    q: "How do you want to be quoted?",
    help: {
      t: "Fixed price or time & materials?",
      b: "Fixed price transfers risk to the vendor — but only works if your scope is tight, and every gap becomes a change request. Time & materials is honest about uncertainty but needs strong governance from you. Milestone-based fixed price per phase is the common middle ground.",
    },
    options: [
      { v: "fixed", l: "Fixed price for the whole project" },
      { v: "phase", l: "Fixed price per phase, milestone-linked" },
      { v: "tm", l: "Time & materials against a rate card" },
      { v: "x", l: "Not sure — show us the options" },
    ],
  },

  {
    id: "budget",
    sec: "commercials",
    type: "single",
    q: "Do you have a budget band in mind?",
    hint: "Sharing a band filters out bids you would never accept. It is optional.",
    options: [
      { v: "a", l: "Under $100k" },
      { v: "b", l: "$100k – $300k" },
      { v: "c", l: "$300k – $750k" },
      { v: "d", l: "$750k – $2m" },
      { v: "e", l: "Over $2m" },
      { v: "x", l: "Prefer not to disclose" },
    ],
  },

  {
    id: "ams",
    sec: "commercials",
    type: "single",
    req: true,
    q: "What support do you need after go-live?",
    options: [
      { v: "hyper", l: "Hypercare only", s: "4 – 8 weeks post go-live" },
      { v: "12", l: "Hypercare + 12 months AMS" },
      { v: "24", l: "Hypercare + 24 months AMS" },
      { v: "sep", l: "Quote AMS separately" },
      { v: "none", l: "We will support it internally" },
    ],
  },

  {
    id: "weights",
    sec: "commercials",
    type: "sliders",
    req: true,
    q: "How will you score the bids?",
    hint: "Publishing your weightings raises the quality of what you get back.",
    fields: [
      { k: "fit", l: "Functional fit", d: 30 },
      { k: "team", l: "Team quality", d: 20 },
      { k: "method", l: "Methodology", d: 15 },
      { k: "refs", l: "References", d: 15 },
      { k: "price", l: "Commercials", d: 20 },
    ],
  },

  /* --- 9 governance --- */
  {
    id: "internalTeam",
    sec: "governance",
    type: "single",
    req: true,
    q: "What can your own team commit?",
    hint: "Honest answers here stop the biggest cause of overrun.",
    options: [
      { v: "full", l: "Dedicated PM and full-time SMEs" },
      { v: "part", l: "Part-time SMEs alongside their day jobs" },
      { v: "thin", l: "Very limited — the vendor must lead" },
      { v: "x", l: "Not decided yet" },
    ],
  },

  {
    id: "workingModel",
    sec: "governance",
    type: "single",
    q: "Where should the team work from?",
    options: [
      { v: "onsite", l: "Mostly onsite with us" },
      { v: "hybrid", l: "Hybrid — onsite for workshops" },
      { v: "remote", l: "Remote-first" },
    ],
  },

  {
    id: "vendorReqs",
    sec: "governance",
    type: "multi",
    req: true,
    quick: true,
    q: "What must a vendor prove to be considered?",
    options: [
      { v: "partner", l: "SAP certified partner status" },
      { v: "local", l: "Local legal entity or office" },
      { v: "indref", l: "References in our industry" },
      { v: "geo", l: "References in our country" },
      { v: "five", l: "At least five comparable projects" },
      { v: "cv", l: "Named CVs for all key roles" },
      { v: "fin", l: "Audited financial statements" },
    ],
  },
];
