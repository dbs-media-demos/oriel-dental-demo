export type InsuranceStatus = "in-network" | "out-of-network" | "medicaid";

export type Insurer = { name: string; status: InsuranceStatus; note?: string; aliases?: string[] };

/** Plans a typical Uptown Dallas practice sees. Statuses are fictional (demo). */
export const insurers: Insurer[] = [
  { name: "Delta Dental PPO", status: "in-network", aliases: ["delta"] },
  { name: "Delta Dental DeltaCare USA (DHMO)", status: "out-of-network", note: "HMO plans require an assigned office; we can help you switch or see you as a member.", aliases: ["delta hmo", "deltacare"] },
  { name: "Cigna Dental PPO", status: "in-network", aliases: ["cigna"] },
  { name: "MetLife PDP", status: "in-network", aliases: ["metlife", "met life"] },
  { name: "Aetna Dental PPO", status: "in-network", aliases: ["aetna"] },
  { name: "Guardian Dental", status: "in-network", aliases: ["guardian"] },
  { name: "United Concordia", status: "in-network", aliases: ["concordia", "tricare"] },
  { name: "UnitedHealthcare Dental", status: "in-network", aliases: ["uhc", "united healthcare"] },
  { name: "Blue Cross Blue Shield of Texas", status: "in-network", aliases: ["bcbs", "blue cross"] },
  { name: "Humana Dental", status: "in-network", aliases: ["humana"] },
  { name: "Ameritas", status: "in-network" },
  { name: "Principal Financial", status: "in-network", aliases: ["principal"] },
  { name: "Sun Life", status: "in-network", aliases: ["sunlife"] },
  { name: "Lincoln Financial", status: "in-network", aliases: ["lincoln"] },
  { name: "Careington", status: "in-network" },
  { name: "GEHA Connection Dental", status: "in-network", aliases: ["geha", "federal"] },
  { name: "Anthem Dental", status: "out-of-network", aliases: ["anthem"] },
  { name: "Spirit Dental", status: "out-of-network", aliases: ["spirit"] },
  { name: "Renaissance Dental", status: "out-of-network", aliases: ["renaissance"] },
  { name: "Superior Dental", status: "out-of-network" },
  { name: "Liberty Dental Plan", status: "out-of-network", aliases: ["liberty"] },
  { name: "Texas CHIP (children)", status: "medicaid", aliases: ["chip"] },
  { name: "Texas Medicaid – DentaQuest (children)", status: "medicaid", aliases: ["medicaid", "dentaquest"] },
  { name: "Texas Medicaid – MCNA (children)", status: "medicaid", aliases: ["mcna"] },
  { name: "Medicare Advantage dental", status: "out-of-network", note: "Coverage varies a lot by plan. Call us with your member ID and we'll check your benefits.", aliases: ["medicare"] },
];

export const statusCopy: Record<InsuranceStatus, { label: string; body: string }> = {
  "in-network": {
    label: "In-network",
    body: "Great news: we're in network with your plan. Most plans cover cleanings and exams at 100%, and we'll send you an estimate for anything else before treatment.",
  },
  "out-of-network": {
    label: "We'll file for you",
    body: "We're not in network with this plan, but we'll file your claims and many patients are reimbursed for most of their visit. We'll give you an estimate first.",
  },
  medicaid: {
    label: "Accepted for kids",
    body: "We welcome children covered by this plan with Dr. Delgado. Adults with Texas Medicaid can join our membership plan for affordable care.",
  },
};

export const membership = {
  adult: { name: "Adult", monthly: 29, yearly: 349 },
  child: { name: "Child (under 14)", monthly: 21, yearly: 249 },
  gum: { name: "Gum care", monthly: 42, yearly: 499 },
  /** Standard fees the plan replaces, per person per year. */
  valueAdult: [
    { item: "2 cleanings", fee: 290 },
    { item: "2 exams", fee: 190 },
    { item: "Full set of x-rays", fee: 180 },
    { item: "1 emergency exam", fee: 125 },
  ],
  valueChild: [
    { item: "2 kids' cleanings", fee: 190 },
    { item: "2 exams", fee: 190 },
    { item: "2 fluoride treatments", fee: 80 },
    { item: "Bitewing x-rays", fee: 75 },
  ],
  perks: [
    "Two cleanings, two exams and x-rays every year",
    "One emergency exam included",
    "15% off fillings, crowns, implants and cosmetic work",
    "$100 off whitening",
    "No deductibles, no waiting periods, no claim forms",
  ],
};
