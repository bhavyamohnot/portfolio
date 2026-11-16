// ─────────────────────────────────────────────────────────────────────────────
// ALL SITE TEXT LIVES HERE. Edit this file to change what the portfolio says.
// (Charts read their numbers from data.js, generated from the real project outputs.)
// ─────────────────────────────────────────────────────────────────────────────

window.CONFIG = {
  name: "Bhavya Mohnot",
  email: "bhavyamohnot@gmail.com",
  linkedin: "https://www.linkedin.com/in/bhavya-mohnot-52769a217/",
  github: "https://github.com/bhavyamohnot",
  resume: "assets/Bhavya_Mohnot_Resume.pdf",
  // Contact form: paste your free Web3Forms access key here (web3forms.com).
  // Left empty, the form opens the visitor's email app instead.
  web3formsKey: "",
};

window.PROJECTS = [
  {
    id: "feedback",
    code: "SPEC-01",
    title: "AI Feedback Analyst",
    subtitle: "Voice of Customer for Notion vs. Evernote",
    cats: ["AI", "Product"],
    tags: ["LLMs", "RAG", "n8n", "Evals", "Python"],
    hook: "Star ratings don't tell a PM what to fix. So I built an LLM pipeline that does.",
    metric: { value: "17%", label: "of Notion reviews were speed & crash complaints: the #1 thing to fix" },
    problem:
      "Star ratings say how users feel, not what to fix. I wanted a tool that turns thousands of app reviews into a ranked fix list a PM can act on, with the evidence attached.",
    did: [
      "Pulled 12 months of Play Store reviews for Notion and rival Evernote: 5,495 raw, <b>4,108 after cleaning</b>.",
      "Built an LLM pipeline that splits every review into topic-level praise, complaints and requests, each backed by an <b>exact quote</b>, plus churn and competitor-switching signals.",
      "Hand-labelled 100 reviews and compared <b>4 LLMs</b> on them before trusting any. Chosen model: <b>84% sentiment accuracy, 100% churn recall</b>.",
      "Shipped a live dashboard, a RAG Q&amp;A that cites its sources, an n8n AI agent and a weekly digest that flags complaint spikes.",
    ],
    result: [
      "Speed &amp; crashes led Notion's complaints: <b>17% of reviews, 53% high severity, 2.29 stars</b>.",
      "Reviews mentioning mobile averaged <b>2.65 vs 3.72 stars</b>.",
      "Wrote a PRD with a north star: cut speed complaints from <b>17% to under 10%</b>.",
      "Evernote: <b>34%</b> of reviewers say they're leaving; ads and pricing each show up in ~36% of reviews.",
    ],
    links: [
      { label: "Live app", url: "https://ai-feedback-analyst.streamlit.app/" },
      { label: "GitHub", url: "https://github.com/bhavyamohnot/ai-feedback-analyst" },
      { label: "PRD", url: "https://spectacled-toad-d7b.notion.site/PRD_Notion_Android_Performance-41917bc3a83780ff8221e786cdcc06f4" },
    ],
    demo: "feedback",
  },
  {
    id: "tradelens",
    code: "SPEC-02",
    title: "TradeLens",
    subtitle: "AI-built monthly trade review for retail F&O traders",
    cats: ["AI", "Fintech", "Product"],
    tags: ["Product", "Claude Code", "TypeScript", "Evals"],
    hook: "P&L reports show how much you lost. TradeLens names the habits that lost it.",
    metric: { value: "95%", label: "recall@3 on unseen traders, with only 3% false alarms" },
    problem:
      "87.7% of individual F&amp;O traders lost money in FY26 (SEBI). Broker P&amp;L reports show how much was lost, not what to change. Built as a take-home case for a PM internship.",
    did: [
      "Weighed a P&amp;L dashboard, a trade journal and an AI chat, and chose an <b>opinionated monthly review</b> that names costly habits.",
      "Built and deployed a live web app with Claude Code that rebuilds trades from raw broker fills and runs <b>9 habit checks</b>.",
      "Set the ship bar before building: <b>91 unit tests and 22 fixed cases</b> had to pass.",
      "Defined adoption, a ₹-saved north star and a <i>\"this is wrong\"</i> trust metric for every habit card.",
    ],
    result: [
      "On a 388-fill test month it found <b>all 3 planted habits</b>, led by expiry-day options costing <b>₹30,131</b>.",
      "Seeded sweeps hit <b>95% recall@3 with 3% false alarms</b> on unseen traders.",
      "Names the <b>top 3 habits by ₹ cost</b>, not a wall of charts.",
    ],
    links: [
      { label: "Live app", url: "https://trade-lens-omega.vercel.app" },
      { label: "GitHub", url: "https://github.com/bhavyamohnot/TradeLens" },
    ],
    demo: "tradelens",
  },
  {
    id: "olist",
    code: "SPEC-03",
    title: "E-commerce Retention & Delivery",
    subtitle: "Olist marketplace · 100k orders · SQL",
    cats: ["Analytics"],
    tags: ["SQL", "BigQuery", "Tableau", "Cohorts", "RFM & CLV"],
    hook: "Why don't shoppers come back? 100k orders of SQL to find out.",
    metric: { value: "3.0%", label: "repeat rate: ~97% of a customer's value is their first order" },
    problem:
      "Olist, a Brazilian marketplace: where does revenue come from, why don't customers return, and where should retention money go?",
    did: [
      "Reconciled items to payments (<b>99.6%</b> of delivered orders match to the cent) and wrote a metric dictionary.",
      "Built a monthly revenue bridge with window functions: the Nov 2017 <b>+53.6%</b> Black Friday spike was <b>97% new customers</b>.",
      "Ran cohort retention, RFM segments and 12-month CLV in BigQuery SQL.",
      "Published a 2-page Tableau dashboard.",
    ],
    result: [
      "Sized a <b>13.9k at-risk, high-value segment</b> for a cashback win-back that breaks even at <b>~R$22</b> per redeemer.",
      "8.1% of 96k orders arrived late, and ratings fall from <b>4.3 to 1.7 stars</b> at 8+ days late.",
      "Prioritized São Paulo and Rio (<b>52% of late orders</b>): volume, not the worst state's rate, should set fix priority.",
    ],
    links: [
      { label: "Dashboard", url: "https://public.tableau.com/views/OlistRevenueRetention/RevenueRetention" },
      { label: "GitHub", url: "https://github.com/bhavyamohnot/olist-revenue-retention" },
    ],
    demo: "olist",
  },
  {
    id: "starbucks",
    code: "SPEC-04",
    title: "Starbucks Rewards: Which Offers Paid Off?",
    subtitle: "Offer incrementality & ROI · MySQL + Google Sheets",
    cats: ["Analytics", "Growth"],
    tags: ["MySQL", "Google Sheets", "Diff-in-diff", "CRM"],
    hook: "Did the offer make people spend more, or did we pay people who'd buy anyway?",
    metric: { value: "30%", label: "of reward money ($49k of $165k) went to people who never opened the offer" },
    problem:
      "Apps keep sending discounts and cashback. Which offers actually change behaviour? 17,000 customers, 10 offers, ~306k app events over 30 days (Starbucks' simulated dataset).",
    did: [
      "Cleaned messy JSON event data in MySQL and matched every view and completion to the right offer window.",
      "Flagged <b>wasted rewards</b>: offers completed without ever being opened.",
      "Measured extra spend against each customer's own baseline, viewers vs non-viewers (difference-in-differences), then ROI per $1 of reward.",
      "Built a Google Sheets dashboard with pivots, a slicer and a COUNTIF/SUMIF check table: <b>all 5 checks matched SQL</b>.",
    ],
    result: [
      "Discounts returned <b>$4.08</b> of extra spend per $1 vs <b>$1.92</b> for BOGO.",
      "Best offer: $2 off $10, 10 days, all channels: <b>~$9.8 per $1</b>.",
      "Recommended: reward only after the offer is opened, move budget from BOGO to discounts, stop $5-off-$20, keep a 10% holdout.",
    ],
    links: [
      { label: "Dashboard", url: "https://docs.google.com/spreadsheets/d/1u8Cxzp9UZckH8TFnugbVR53qthWQaBC6Ei03_UrN2CQ/edit?usp=sharing" },
      { label: "GitHub", url: "https://github.com/bhavyamohnot/Starbucks-offer-evaluation" },
    ],
    demo: "starbucks",
  },
  {
    id: "whatsapp",
    code: "SPEC-05",
    title: "WhatsApp Pay: Teardown & PRD",
    subtitle: "Why 500M users didn't become UPI share",
    cats: ["Strategy", "Fintech", "Product"],
    tags: ["Product strategy", "PRD", "Fintech", "Experiment design"],
    hook: "500M users. Under 1% of UPI. Why?",
    metric: { value: "<1%", label: "UPI share despite 500M users (PhonePe: 46.5%)" },
    problem: "WhatsApp has India's biggest chat audience, yet WhatsApp Pay barely registers in UPI payments.",
    did: [
      "Traced the gap to a <b>6-year regulatory freeze</b>, a merchant war lost to QR codes and soundboxes, and zero-MDR making each payment worth ₹0 to Meta.",
      "Tested the \"it's regulation\" story: after the user cap lifted in Dec 2024, volume grew only <b>~17% in six months</b>.",
      "Sequenced <b>4 bets</b>: wedge, habit, discoverability, moat.",
    ],
    result: [
      "Key insight: the binding constraint is <b>Meta's unwillingness to fund the merchant war</b>, not regulation or reach.",
      "PRD: Click-to-WhatsApp ads with in-chat checkout, targeting <b>+10M monthly P2M payers</b> in 24 months.",
      "Rollout: a <b>500-merchant pilot</b> gated by a randomized holdout test.",
    ],
    links: [{ label: "Case study", url: "https://spectacled-toad-d7b.notion.site/WhatsApp_Pay_Case_Study_for_Notion-41617bc3a83780a19623c65250f9e9a3" }],
    demo: "whatsapp",
  },
];

// Stations on the assembly line, oldest first.
window.EXPERIENCE = [
  {
    id: "honda",
    org: "Honda Motorcycle & Scooter India",
    short: "Honda (HMSI)",
    role: "Product Operations Intern",
    dates: "May 2024 – Jul 2024",
    line: "Took apart end-of-line defects on 2 scooter assembly lines.",
    bullets: [
      "<b>Problem framing:</b> Ran a 6-week DMAIC study on end-of-line defects across 2 assembly lines and 4 scooter models. The assembly frame drove <b>30–35% of all defects</b>, and <b>65–75%</b> of its appearance defects were scratches.",
      "<b>Root cause:</b> Pareto analysis narrowed scratches to body covers (<b>45–55%</b>) and the vehicle-quality receiving zone (<b>60–70%</b>); mapped <b>8 root causes</b> across loading, conveyors, unloading and vehicle movement.",
      "<b>Recommendation:</b> Presented prioritized countermeasures to senior management, each planned as a small-scale PDCA test.",
    ],
    tags: ["DMAIC", "Pareto", "Root cause", "Stakeholders"],
  },
  {
    id: "180dc",
    org: "180 Degrees Consulting, BITS Goa",
    short: "180 Degrees Consulting",
    role: "Senior Consultant",
    dates: "Jun 2025 – Nov 2025",
    line: "Market sizing and unit economics behind a $2.5M raise.",
    bullets: [
      "Built a Series-A deck for <b>Everyday Diamonds</b>: sized the Indian lab-grown diamond market and assessed unit economics, margins and working capital for an omnichannel expansion, supporting a <b>$2.5M raise</b> that funded its first Bengaluru flagship store.",
      "Drove <b>3x project pipeline growth</b> by streamlining operations, upskilling team members and building external partnerships.",
    ],
    tags: ["Market sizing", "Unit economics", "Pitch decks"],
  },
  {
    id: "coincodecap",
    org: "CoinCodeCap",
    short: "CoinCodeCap",
    role: "Product Analyst Intern",
    dates: "Nov 2025 – Jan 2026",
    line: "Tore down 15+ products on UX, pricing and product-market fit.",
    bullets: [
      "<b>Product teardowns:</b> Evaluated <b>15+ products</b> across UI, UX, onboarding, pricing, target audience and product-market fit to find each one's gaps, strengths and customer pain points, published as structured reviews.",
      "<b>Competitive intelligence:</b> Built feature-by-feature comparison matrices to map positioning and differentiation and spot gaps across the category.",
      "<b>Execution:</b> Tracked the review pipeline in Jira and WordPress with cross-functional teams, keeping releases on schedule.",
    ],
    tags: ["Teardowns", "Competitive analysis", "UX", "Jira"],
  },
  {
    id: "kanishk",
    org: "Kanishk Aluminium India Ltd.",
    short: "Kanishk Aluminium",
    role: "Quality Control Intern",
    dates: "Jul 2026 – Present",
    line: "Pareto on extrusion rejections: two defects drive over half the loss.",
    bullets: [
      "<b>Discovery:</b> Mapped the end-to-end aluminium extrusion workflow on the shop floor with production and quality teams, studying how alloy, die, shift and process conditions drive recurring defects and material loss.",
      "<b>Prioritization:</b> Pareto analysis on rejection data across alloys, dies and shifts: <b>die lines (40%) and surface scratches (15%)</b> drove over half of all rejections; ranked fixes by impact on material loss.",
      "<b>Stakeholder alignment:</b> Recommended die-condition, handling and monitoring fixes to plant teams and improved defect traceability.",
    ],
    tags: ["Discovery", "Pareto", "Prioritization"],
  },
];

// Bill of materials. "used" ids point at PROJECTS (spec) or EXPERIENCE (station).
window.SKILLS = [
  { group: "Product", items: [
    { name: "PRDs & user stories", used: ["feedback", "whatsapp"] },
    { name: "Problem framing", used: ["feedback", "tradelens", "honda"] },
    { name: "Prioritization (RICE, impact-effort, volume × severity)", used: ["feedback", "kanishk", "olist"] },
    { name: "North-star & success metrics", used: ["feedback", "tradelens", "whatsapp"] },
    { name: "Competitive teardowns", used: ["coincodecap", "whatsapp", "feedback"] },
    { name: "Root-cause analysis (DMAIC, Pareto)", used: ["honda", "kanishk"] },
    { name: "Experiment design (holdout tests)", used: ["starbucks", "whatsapp"] },
    { name: "Market sizing & unit economics", used: ["180dc"] },
    { name: "Jira", used: ["coincodecap"] },
  ]},
  { group: "Data", items: [
    { name: "SQL (BigQuery, MySQL): joins, CTEs, window functions", used: ["olist", "starbucks"] },
    { name: "Excel & Google Sheets (pivots, SUMIF/COUNTIF)", used: ["starbucks"] },
    { name: "Tableau & Looker Studio", used: ["olist"] },
    { name: "Python (pandas)", used: ["feedback"] },
    { name: "Cohort, RFM & CLV analysis", used: ["olist"] },
    { name: "Incrementality testing (diff-in-diff)", used: ["starbucks"] },
    { name: "Anomaly checks (z-scores) & reconciliation", used: ["olist"] },
    { name: "Git & GitHub", used: ["feedback", "tradelens", "olist", "starbucks"] },
  ]},
  { group: "AI", items: [
    { name: "LLM pipelines (Gemini API, structured outputs)", used: ["feedback"] },
    { name: "Prompt design", used: ["feedback", "tradelens"] },
    { name: "RAG (embeddings, semantic search, citations)", used: ["feedback"] },
    { name: "AI agents & automation (n8n)", used: ["feedback"] },
    { name: "Evals (labelled test sets, precision, recall, F1)", used: ["feedback", "tradelens"] },
    { name: "Streamlit", used: ["feedback"] },
    { name: "Claude Code", used: ["tradelens", "feedback"] },
  ]},
];

window.GEARS = {
  discover: {
    title: "Discover",
    text: "Get close to the workflow and the data before forming an opinion. On the Kanishk shop floor I mapped the extrusion line end to end; for Notion I read 4,108 reviews through an LLM, quote by quote.",
  },
  prioritize: {
    title: "Prioritize",
    text: "Rank by volume × severity, not gut feel. Pareto at Honda and Kanishk, volume × severity for Notion, and São Paulo + Rio first for Olist because volume beats the worst rate.",
  },
  ship: {
    title: "Ship",
    text: "A PRD with a north star, an eval bar set before building, and a working build. TradeLens shipped with 91 tests; the Feedback Analyst ships a live dashboard, RAG and a weekly digest.",
  },
};
