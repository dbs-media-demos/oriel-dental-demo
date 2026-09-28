import { img, type Img } from "./images";

export type Doctor = {
  slug: string;
  name: string;
  credentials: string;
  role: string;
  image: Img;
  short: string;
  bio: string[];
  focus: string[];
  education: string[];
  memberships: string[];
  languages: string[];
  offDuty: string;
  quote: string;
};

export const doctors: Doctor[] = [
  {
    slug: "elena-marsh",
    name: "Dr. Elena Marsh",
    credentials: "DDS, FAGD",
    role: "Founder · Cosmetic & family dentistry",
    image: img.drElena,
    short: "Opened Oriel in 2014 after a decade of watching patients white-knuckle their way through appointments.",
    bio: [
      "Elena grew up in Lakewood and spent her first years in practice at a busy Dallas group clinic, where appointments were stacked 15 minutes apart. She kept noticing the same thing: patients weren't afraid of dentistry so much as of being rushed, surprised and talked over.",
      "Oriel is her answer to that. Longer appointments, rooms full of daylight, prices before treatment, and a promise that nothing happens until you understand it. Her own specialty is cosmetic work that looks unmistakably natural, from a single bonded chip to full porcelain veneers.",
    ],
    focus: ["Porcelain veneers & bonding", "Smile design", "Whitening", "Family dentistry"],
    education: ["DDS, Texas A&M College of Dentistry, Dallas", "Fellowship, Academy of General Dentistry", "Advanced aesthetics residency, 2018"],
    memberships: ["American Dental Association", "Texas Dental Association", "Dallas County Dental Society", "American Academy of Cosmetic Dentistry"],
    languages: ["English"],
    offDuty: "Early runs on the Katy Trail, Saturday ceramics classes, and a retired racing greyhound called Pim.",
    quote: "Nobody should leave a dental visit feeling smaller than when they walked in.",
  },
  {
    slug: "julian-ashford",
    name: "Dr. Julian Ashford",
    credentials: "DMD",
    role: "Implants & sedation dentistry",
    image: img.drJulian,
    short: "Places every Oriel implant in-house with 3D-guided surgery, and holds a Texas sedation permit.",
    bio: [
      "Julian joined Oriel in 2017 after an implant fellowship and four years at a surgical practice in Houston. He's the doctor our most anxious patients ask for: calm, quietly funny, and happy to stop mid-sentence the moment you raise a hand.",
      "He plans every implant from a cone-beam scan and places it with a printed surgical guide. That means smaller incisions, fewer surprises and, for most patients, going back to work the next day.",
    ],
    focus: ["Dental implants", "Guided surgery", "Oral & nitrous sedation", "Extractions & bone grafting"],
    education: ["DMD, Tufts University School of Dental Medicine", "Implant surgery fellowship, 2016", "Texas Level 2 sedation permit"],
    memberships: ["American Dental Association", "International Congress of Oral Implantologists", "Texas Dental Association"],
    languages: ["English", "Conversational French"],
    offDuty: "Weekend brisket experiments, jazz piano (badly, he insists), and pickup basketball at Reverchon Park.",
    quote: "If you're nervous, tell me. That's not a problem; it's information I can work with.",
  },
  {
    slug: "sofia-delgado",
    name: "Dr. Sofia Delgado",
    credentials: "DDS",
    role: "Family & kids' dentistry · Se habla español",
    image: img.drSofia,
    short: "Sees our youngest patients and their families, in English or Spanish, with endless patience.",
    bio: [
      "Sofia grew up in Oak Cliff translating for her grandparents at every doctor's appointment, which is partly why she became one. She completed a hospital-based residency in pediatric and special-needs care before joining Oriel in 2020.",
      "Families love her tell-show-do approach: kids meet every tool before it's used, and parents get practical advice without the lecture. She's also our go-to for Spanish-speaking patients of every age.",
    ],
    focus: ["Kids' dentistry", "Family care", "Preventive care & sealants", "Patients with special needs"],
    education: ["DDS, Texas A&M College of Dentistry, Dallas", "General practice residency, pediatric focus", "Nitrous oxide certification"],
    memberships: ["American Dental Association", "Hispanic Dental Association", "Texas Dental Association"],
    languages: ["English", "Spanish"],
    offDuty: "Chasing her twins around Klyde Warren Park, salsa lessons in Deep Ellum, and the best tamales on her block every December.",
    quote: "A kid who leaves laughing comes back without a fight. That's half the job.",
  },
];

export const team: { name: string; role: string; image: Img; note: string }[] = [
  { name: "Maya R.", role: "Lead hygienist, RDH", image: img.teamMaya, note: "Twelve years of gentle cleanings. Known for the warm-water scaling technique patients ask for by name." },
  { name: "Marcus T.", role: "Hygienist, RDH", image: img.teamMarcus, note: "Former high-school coach. Explains gum health so well that patients actually start flossing." },
  { name: "Grace L.", role: "Patient coordinator", image: img.teamGrace, note: "Finds you an appointment, decodes your insurance, and remembers how you take your tea." },
  { name: "Lena V.", role: "Practice manager", image: img.teamLena, note: "Runs the studio so quietly you'd never guess how much she's doing. Fluent in Spanish." },
];

export const getDoctor = (slug: string) => doctors.find((d) => d.slug === slug);
