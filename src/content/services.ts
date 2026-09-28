import { img, type Img } from "./images";

export type ServiceCategory = "everyday" | "cosmetic" | "restorative" | "comfort";

export const categories: { id: ServiceCategory | "all"; label: string }[] = [
  { id: "all", label: "All treatments" },
  { id: "everyday", label: "Everyday care" },
  { id: "cosmetic", label: "Cosmetic" },
  { id: "restorative", label: "Restorative" },
  { id: "comfort", label: "Comfort & urgent" },
];

export type Service = {
  slug: string;
  name: string;
  /** Short name for tight spaces (cards, menus). */
  short: string;
  category: ServiceCategory;
  image: Img;
  /** Secondary image used further down the detail page. */
  detailImage: Img;
  tagline: string;
  summary: string;
  duration: string;
  /** 1 = you'll feel it, 5 = most people nap. */
  comfort: 1 | 2 | 3 | 4 | 5;
  comfortNote: string;
  price: string;
  insurance: string;
  intro: string[];
  forYou: string[];
  steps: { title: string; body: string }[];
  included: string[];
  faqs: { q: string; a: string }[];
  related: string[];
  cosmetic?: boolean;
  keywords: string[];
};

export const comfortLabels: Record<Service["comfort"], string> = {
  1: "You'll feel it",
  2: "Some pressure",
  3: "Gentle",
  4: "Very gentle",
  5: "Nap-worthy",
};

export const services: Service[] = [
  {
    slug: "general-family-dentistry",
    name: "General & family dentistry",
    short: "Family dentistry",
    category: "everyday",
    image: img.familyCouch,
    detailImage: img.dentistChat,
    tagline: "One calm studio for the whole family, from first tooth to first crown.",
    summary: "Checkups, fillings, crowns and honest advice for every age, with evening and Saturday appointments that fit around school and work.",
    duration: "45–60 min",
    comfort: 5,
    comfortNote: "Numbing gel before anything that needs a shot, and a hand signal to pause any time.",
    price: "$95 exam · fillings from $185",
    insurance: "Preventive visits are usually covered 100% by PPO plans.",
    intro: [
      "Good family dentistry is mostly unglamorous: catching small things early, explaining them clearly and never rushing. We book longer appointments than most practices so there's time for questions, and we show you every photo and x-ray on the ceiling screen as we go.",
      "Parents can book back-to-back family blocks, so everyone is seen in one trip. Dr. Delgado sees our youngest patients and speaks Spanish, and our Saturday mornings exist for families who can't do weekdays.",
    ],
    forYou: [
      "You want one dentist for the whole family",
      "It's been a while and you'd like a fresh, judgment-free start",
      "You need a filling, crown or a second opinion on a treatment plan",
      "You'd like appointments before work, after school or on Saturday",
    ],
    steps: [
      { title: "A proper look", body: "Exam, 3D scan and low-dose digital x-rays, with photos you can see on the screen above the chair." },
      { title: "A plain-English plan", body: "What's urgent, what can wait, and what's optional, each with a price and your insurance estimate." },
      { title: "Gentle treatment", body: "Tooth-colored fillings and same-week crowns, done with numbing gel and a comfort menu." },
      { title: "Easy follow-up", body: "Text reminders, online forms and family scheduling so the next visit is effortless." },
    ],
    included: ["Comprehensive exam", "Digital x-rays (80% less radiation than film)", "Oral cancer screening", "Gum health check", "Personal care plan with prices"],
    faqs: [
      { q: "Can my whole family book in one visit?", a: "Yes. Ask for a family block and we'll line up back-to-back appointments with two hygienists, so a family of four is usually in and out in under two hours." },
      { q: "Do you do silver fillings?", a: "No. We only place tooth-colored composite fillings. They bond to the tooth, need less drilling and look natural." },
      { q: "What if I haven't been to a dentist in years?", a: "You're in good company. We start with a no-lecture conversation, then a gentle exam. Many long-gap patients need less work than they fear." },
    ],
    related: ["cleanings-exams", "kids-dentistry", "emergency-dentistry"],
    keywords: ["family dentist Uptown Dallas", "general dentist Dallas", "dentist Saturday hours Dallas"],
  },
  {
    slug: "cleanings-exams",
    name: "Cleanings & exams",
    short: "Cleanings",
    category: "everyday",
    image: img.patientRelaxed,
    detailImage: img.suiteBright,
    tagline: "The cleaning you'll actually look forward to.",
    summary: "Unhurried hygiene visits with warm-water scaling, flavor-free polish options and a weighted blanket if you want one.",
    duration: "60 min",
    comfort: 5,
    comfortNote: "Ultrasonic scaling with warm water: no sharp scraping, and far less sensitivity.",
    price: "$145 cleaning · $95 exam",
    insurance: "Covered twice a year by most PPO plans. We file the claim for you.",
    intro: [
      "Our hygienists get a full hour with you, not the usual 40 minutes. That's time to clean gently, check your gums properly and talk through anything you've noticed, without the rushed feeling.",
      "We use warm-water ultrasonic scaling instead of heavy hand-scraping, offer a flavor-free polish, and keep noise-cancelling headphones and a streaming screen on the ceiling for every chair.",
    ],
    forYou: [
      "You're due (or overdue) for a checkup",
      "Your gums bleed when you brush or floss",
      "Cleanings have felt rough or rushed before",
      "You'd like a whiter-looking smile without whitening",
    ],
    steps: [
      { title: "Check-in, your way", body: "Online forms beforehand, then tea or sparkling water while we warm the chair." },
      { title: "Gentle cleaning", body: "Warm-water ultrasonic scaling, polish and floss, with breaks whenever you like." },
      { title: "Exam with the doctor", body: "Five to ten minutes with your dentist to review photos, x-rays and any questions." },
      { title: "Your next steps", body: "Usually nothing. If something needs attention, you get a written plan with prices." },
    ],
    included: ["Full-hour hygiene visit", "Gum measurements", "Stain polish", "Fluoride on request", "Doctor's exam", "Bite and jaw check"],
    faqs: [
      { q: "How often should I get a cleaning?", a: "Every six months suits most people. If you're prone to gum inflammation, we may suggest every three or four months for a while." },
      { q: "My gums bleed. Is a deep cleaning necessary?", a: "Not always. We measure your gums first and only recommend scaling and root planing when the measurements show it. You'll see the numbers yourself." },
      { q: "Can I get a cleaning without x-rays?", a: "Yes, you can decline. We'll explain what x-rays would show, but it's always your call." },
    ],
    related: ["general-family-dentistry", "teeth-whitening", "kids-dentistry"],
    keywords: ["teeth cleaning Uptown Dallas", "dental checkup Dallas", "gentle dental cleaning"],
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic dentistry",
    short: "Cosmetic",
    category: "cosmetic",
    image: img.smileGolden,
    detailImage: img.smileJoy,
    tagline: "Your smile, just more like you.",
    summary: "Whitening, bonding, veneers and aligners, planned around your face, not a template. You see a preview before we touch a tooth.",
    duration: "45 min consult",
    comfort: 4,
    comfortNote: "Most cosmetic work needs little or no numbing, and we preview everything digitally first.",
    price: "Consult $0 · bonding from $350",
    insurance: "Cosmetic care is rarely covered. Ask about our 0% financing and member savings.",
    intro: [
      "The best cosmetic dentistry is the kind nobody notices: people just think you look well-rested. Dr. Marsh plans every case from photos and a 3D scan of your face and teeth, then shows you a digital preview before anything is booked.",
      "Sometimes the right answer is simpler than you expect: whitening plus a little bonding can change a smile for a fraction of the cost of veneers. We'll always show you the conservative option first.",
    ],
    forYou: [
      "You hide your smile in photos",
      "Your teeth are chipped, worn, uneven or discolored",
      "You want a subtle refresh before a wedding or big event",
      "You'd like to see the result before you commit",
    ],
    steps: [
      { title: "Smile consult", body: "A relaxed conversation about what bothers you, plus photos and a 3D scan." },
      { title: "Digital preview", body: "We design your new smile on screen and, for veneers, a try-in you can wear." },
      { title: "Refine together", body: "Adjust shape, length and shade until it looks like you, just brighter." },
      { title: "Treatment & polish", body: "Whitening, bonding, veneers or aligners, with a follow-up to fine-tune." },
    ],
    included: ["Free cosmetic consultation", "Smile photography", "3D scan", "Digital smile preview", "Written options with prices"],
    faqs: [
      { q: "Will it look fake?", a: "Not if it's planned well. We match shade and shape to your skin tone, lips and face, and you approve a preview first. Results vary from person to person." },
      { q: "What's the least invasive option?", a: "Whitening and composite bonding. Neither removes healthy tooth structure, and bonding can often be done in one visit." },
      { q: "Can I finance cosmetic work?", a: "Yes: 0% financing for up to 12 months, or longer terms through our lending partners. Members also save 15%." },
    ],
    related: ["teeth-whitening", "porcelain-veneers", "clear-aligners"],
    cosmetic: true,
    keywords: ["cosmetic dentist Uptown Dallas", "smile makeover Dallas", "dental bonding Dallas"],
  },
  {
    slug: "teeth-whitening",
    name: "Teeth whitening",
    short: "Whitening",
    category: "cosmetic",
    image: img.smileSky,
    detailImage: img.smileBa1After,
    tagline: "Brighter in one afternoon. Or on your own schedule.",
    summary: "Professional in-office whitening in about 90 minutes, or custom take-home trays that fit perfectly and don't burn.",
    duration: "90 min in-office",
    comfort: 4,
    comfortNote: "Desensitizing gel before and after. Most patients feel only mild, short-lived tingling.",
    price: "$395 take-home · $650 in-office",
    insurance: "Not covered by insurance. Members save 15%, and new patients get $50 off.",
    intro: [
      "Store-bought strips whiten the flat fronts of your teeth and not much else. Professional whitening uses a stronger, dentist-controlled gel and trays shaped to your teeth, so the result is even from edge to edge.",
      "In-office whitening takes one relaxed afternoon: we protect your gums, apply the gel in three short rounds, and you can watch a show on the ceiling. Take-home trays suit sensitive teeth and busy calendars.",
    ],
    forYou: [
      "Coffee, tea or red wine has dulled your smile",
      "You want a quick lift before an event",
      "Over-the-counter strips made your teeth sensitive",
      "You're planning veneers or bonding and want a lighter base shade",
    ],
    steps: [
      { title: "Shade check", body: "We record your starting shade and make sure your gums and fillings are ready." },
      { title: "Protect & apply", body: "A gum barrier, then professional gel in three 15-minute rounds." },
      { title: "Reveal", body: "Compare your new shade in daylight. Results vary; most patients see several shades brighter." },
      { title: "Keep it", body: "Custom trays and a touch-up syringe so the result lasts." },
    ],
    included: ["Shade assessment", "Gum protection", "Desensitizing treatment", "Custom trays", "Touch-up gel"],
    faqs: [
      { q: "How long does whitening last?", a: "Typically one to three years, depending on coffee, tea, wine and smoking. A 10-minute touch-up with your trays every few months keeps it fresh." },
      { q: "Will it whiten my crowns or fillings?", a: "No. Whitening only affects natural enamel. If you have front-tooth fillings, we may suggest updating them afterwards to match." },
      { q: "Is it safe for sensitive teeth?", a: "Usually, yes. We'll suggest take-home trays with a gentler gel and a desensitizer, and you control the pace." },
    ],
    related: ["cosmetic-dentistry", "porcelain-veneers", "cleanings-exams"],
    cosmetic: true,
    keywords: ["teeth whitening Uptown Dallas", "professional whitening Dallas", "Zoom whitening Dallas"],
  },
  {
    slug: "porcelain-veneers",
    name: "Porcelain veneers",
    short: "Veneers",
    category: "cosmetic",
    image: img.smileJoy,
    detailImage: img.smileBa4After,
    tagline: "Hand-layered porcelain that catches the light like real enamel.",
    summary: "Ultra-thin porcelain veneers designed with you, tried in before they're made, and crafted by a Dallas ceramist we've worked with for a decade.",
    duration: "2–3 visits over 3 weeks",
    comfort: 3,
    comfortNote: "Numbing for the prep visit; the try-in and final visit are usually comfortable without it.",
    price: "$1,450–$2,100 per tooth",
    insurance: "Cosmetic, so rarely covered. 0% financing for 12 months is available.",
    intro: [
      "Veneers can change a smile completely, which is exactly why they should be planned carefully. We design yours digitally first, then you wear a temporary try-in so you can see, feel and live with the new shape before anything is final.",
      "Our porcelain is layered by hand by a local ceramist, not milled from a single block, so each veneer has the subtle translucency and texture of natural teeth.",
    ],
    forYou: [
      "Your front teeth are chipped, worn or uneven",
      "Stains don't respond to whitening",
      "You have small gaps you'd like to close",
      "You want a long-lasting, dramatic but natural change",
    ],
    steps: [
      { title: "Design", body: "Photos, a 3D scan and a digital smile design you can review at home." },
      { title: "Try-in", body: "A temporary mock-up of your new smile, worn for a few days, adjusted until you love it." },
      { title: "Gentle prep", body: "Minimal enamel shaping, often less than half a millimeter, and a precise scan." },
      { title: "Placement", body: "Your veneers are bonded, polished and checked for bite, with a follow-up a week later." },
    ],
    included: ["Digital smile design", "Wearable try-in", "Hand-layered porcelain", "Night guard to protect your veneers", "One-week follow-up"],
    faqs: [
      { q: "How long do veneers last?", a: "With good care, porcelain veneers commonly last 10–15 years or more. A night guard, included with every case, helps protect them." },
      { q: "Do you have to shave my teeth down?", a: "Very little. Most of our cases need 0.3–0.5 mm of enamel reduction, and some need none at all." },
      { q: "Can I see results before committing?", a: "Yes. The try-in lets you see your new smile in the mirror, in photos and in real life before the porcelain is made. Results vary by case." },
    ],
    related: ["cosmetic-dentistry", "teeth-whitening", "clear-aligners"],
    cosmetic: true,
    keywords: ["porcelain veneers Dallas", "veneers Uptown Dallas", "cosmetic dentist veneers Texas"],
  },
  {
    slug: "clear-aligners",
    name: "Clear aligners",
    short: "Aligners",
    category: "cosmetic",
    image: img.alignerHand,
    detailImage: img.alignerClear,
    tagline: "Straighter teeth, without anyone noticing you're working on it.",
    summary: "Nearly invisible aligners planned from a 3D scan, with a preview of your final smile before you start and check-ins that fit your calendar.",
    duration: "6–18 months",
    comfort: 4,
    comfortNote: "Each new tray feels snug for a day or two. No brackets, wires or cut cheeks.",
    price: "$3,800–$6,200 · from $165/mo",
    insurance: "Many plans include an orthodontic benefit of $1,000–$2,000. We'll check yours.",
    intro: [
      "Clear aligners gently move your teeth with a series of custom trays you swap every week or two. They come out for meals and brushing, so there are no food rules and nothing to fix at the dentist.",
      "Your plan starts with a 3D scan, not goopy impressions, and you'll see a simulation of your finished smile on the day of your consult. Check-ins are short and can often be virtual.",
    ],
    forYou: [
      "Your teeth are crowded, gapped or have shifted since braces",
      "You want to straighten without metal brackets",
      "You'd like whitening or veneers later and want a better base",
      "You're an adult or a teen who can wear trays about 22 hours a day",
    ],
    steps: [
      { title: "3D scan & preview", body: "A three-minute scan and a simulation of how your teeth will move." },
      { title: "Your trays arrive", body: "We fit the first set, add any small attachments and show you how to care for them." },
      { title: "Quiet progress", body: "Switch trays at home; check-ins every 8–10 weeks, some of them virtual." },
      { title: "Finish & retain", body: "Refinements if needed, a whitening touch-up, then retainers to keep it straight." },
    ],
    included: ["3D scan & simulation", "All aligner trays", "Refinement trays", "First set of retainers", "Take-home whitening"],
    faqs: [
      { q: "Are aligners as good as braces?", a: "For mild to moderate crowding, spacing and bite issues, aligners work very well. For complex cases we'll tell you honestly and refer you to an orthodontist we trust." },
      { q: "How many hours a day do I wear them?", a: "About 22. They come out for meals, coffee (anything but water) and brushing." },
      { q: "Will they affect my speech?", a: "Maybe a slight lisp for a day or two while your tongue adjusts. Most people stop noticing after the first week." },
    ],
    related: ["cosmetic-dentistry", "teeth-whitening", "porcelain-veneers"],
    cosmetic: true,
    keywords: ["clear aligners Dallas", "Invisalign alternative Uptown Dallas", "teeth straightening Dallas"],
  },
  {
    slug: "dental-implants",
    name: "Dental implants",
    short: "Implants",
    category: "restorative",
    image: img.seniorSmile,
    detailImage: img.implantModel,
    tagline: "A replacement tooth that feels like it was always yours.",
    summary: "Guided implant surgery planned in 3D, placed by Dr. Ashford in-house, with sedation available and one all-in price that includes the crown.",
    duration: "3–6 months start to finish",
    comfort: 3,
    comfortNote: "Placement is done under local anesthetic, with nitrous or oral sedation if you prefer.",
    price: "$3,900–$5,200 per tooth, crown included",
    insurance: "Many plans cover part of the crown or bone graft. We'll send a pre-estimate.",
    intro: [
      "An implant replaces the root of a missing tooth with a small titanium post, topped by a porcelain crown. It doesn't rely on neighboring teeth, doesn't slip like a denture, and helps keep your jawbone healthy.",
      "Dr. Ashford plans every implant from a 3D scan and places it with a printed surgical guide, which means smaller incisions, more precise placement and, for most patients, less swelling the next day.",
    ],
    forYou: [
      "You're missing one or more teeth",
      "A tooth is cracked or failing and can't be saved",
      "Your bridge or partial denture feels loose or uncomfortable",
      "You want a fixed option that you care for like a natural tooth",
    ],
    steps: [
      { title: "3D consult", body: "A cone-beam scan to check bone and plan the ideal position, with an all-in quote." },
      { title: "Guided placement", body: "About an hour in the chair, with sedation if you'd like. Most people work the next day." },
      { title: "Healing", body: "Eight to twelve weeks while the implant bonds to bone; a temporary tooth where it shows." },
      { title: "Your new tooth", body: "A custom porcelain crown, shade-matched and fitted for a natural bite." },
    ],
    included: ["3D cone-beam scan", "Guided surgery", "Implant, abutment and crown", "Temporary tooth (front teeth)", "All follow-up visits"],
    faqs: [
      { q: "Does getting an implant hurt?", a: "Most patients say it was easier than a tooth extraction. You'll be numb throughout, and sedation is available. Expect mild soreness for a few days." },
      { q: "How long do implants last?", a: "With good home care and regular cleanings, implants can last decades. Crowns may need replacing after 15 years or so." },
      { q: "Am I too old for an implant?", a: "Age matters less than overall health and bone. We place implants for patients in their 80s. The 3D scan tells us what's possible." },
    ],
    related: ["sedation-dentistry", "general-family-dentistry", "emergency-dentistry"],
    keywords: ["dental implants Uptown Dallas", "implant dentist Dallas", "tooth replacement Dallas"],
  },
  {
    slug: "emergency-dentistry",
    name: "Emergency dentistry",
    short: "Emergencies",
    category: "comfort",
    image: img.suiteSunlit,
    detailImage: img.scanPatient,
    tagline: "Toothache at 8 am? You'll be in a chair today.",
    summary: "Same-day appointments for pain, swelling, broken teeth and lost crowns. Call before 3 pm on weekdays and we'll see you today.",
    duration: "Same day",
    comfort: 4,
    comfortNote: "Pain relief first, decisions second. We numb you before we even look closely.",
    price: "$125 emergency exam + x-ray",
    insurance: "Emergency exams are usually covered by PPO plans. Members get one free each year.",
    intro: [
      "Dental pain doesn't wait for a convenient time, so neither do we. We hold emergency slots every weekday and Saturday morning, and our phones are answered by a real person from 7 am.",
      "Our first job is getting you out of pain. Then we explain what's going on with photos and x-rays, and give you options, from a quick temporary fix to the long-term solution, each with a price.",
    ],
    forYou: [
      "Throbbing toothache or pain when biting",
      "A chipped, cracked or knocked-out tooth",
      "A lost filling or crown",
      "Swelling in your gums, jaw or face",
    ],
    steps: [
      { title: "Call or text", body: "Tell us what's happening. We'll book you in and give first-aid advice while you travel." },
      { title: "Relief first", body: "We numb the area and ease the pain before anything else." },
      { title: "Clear diagnosis", body: "Digital x-rays and intraoral photos, explained on the screen above you." },
      { title: "Fix or stabilize", body: "Often the same visit; otherwise a comfortable temporary and a fast follow-up." },
    ],
    included: ["Same-day appointment", "Focused exam", "Digital x-rays", "Pain relief", "Written treatment options"],
    faqs: [
      { q: "What if it's after hours?", a: "Call our main number. Existing patients reach the on-call doctor. If you have swelling that affects breathing or swallowing, go straight to the ER." },
      { q: "I knocked out a tooth. What do I do?", a: "Pick it up by the crown, not the root. Rinse gently, try to place it back in the socket or keep it in milk, and call us immediately. Minutes matter." },
      { q: "Do you see emergencies for non-patients?", a: "Yes. You don't need to be an existing patient to book a same-day emergency visit." },
    ],
    related: ["general-family-dentistry", "sedation-dentistry", "dental-implants"],
    keywords: ["emergency dentist Uptown Dallas", "same day dentist Dallas", "toothache Dallas"],
  },
  {
    slug: "sedation-dentistry",
    name: "Sedation & anxiety-free dentistry",
    short: "Sedation",
    category: "comfort",
    image: img.comfortHeadphones,
    detailImage: img.comfortBlanket,
    tagline: "For everyone who'd rather be literally anywhere else.",
    summary: "A comfort menu for every appointment, plus nitrous oxide and oral sedation from a doctor trained to keep you calm and safe.",
    duration: "Any appointment",
    comfort: 5,
    comfortNote: "With oral sedation, most patients remember very little and feel like they had a long nap.",
    price: "Nitrous $75 · oral sedation $295",
    insurance: "Occasionally covered alongside surgery. Always included in our all-in implant quotes.",
    intro: [
      "Dental anxiety is common, and it's not a character flaw. Maybe a past visit hurt, or the sounds and smells take you straight back. We built Oriel around that feeling: soft light, quiet rooms, no surprises, and a doctor who stops the moment you raise a hand.",
      "For many people the comfort menu is enough. If you'd like more, nitrous oxide takes the edge off and wears off in minutes, and oral sedation lets you drift through longer visits. Dr. Ashford holds a Texas sedation permit and monitors you throughout.",
    ],
    forYou: [
      "You've been putting off the dentist for years",
      "Sounds, smells or the chair itself make you panic",
      "You have a strong gag reflex or trouble getting numb",
      "You'd like to finish a lot of treatment in one visit",
    ],
    steps: [
      { title: "A no-chair meet & greet", body: "Coffee in the lounge, no instruments, no pressure: just talk." },
      { title: "Your comfort plan", body: "Pick your comforts and sedation level; we write it into your chart for every visit." },
      { title: "Calm treatment", body: "Headphones, blanket, a signal to pause, and continuous monitoring if sedated." },
      { title: "Gentle recovery", body: "Rest in a quiet room; with oral sedation, a friend drives you home." },
    ],
    included: ["Comfort menu at every visit", "Nitrous oxide option", "Oral sedation option", "Pulse & oxygen monitoring", "Recovery room"],
    faqs: [
      { q: "Will I be unconscious?", a: "No. With nitrous or oral sedation you stay awake and able to respond, just deeply relaxed. Many people doze and remember little." },
      { q: "Can I drive home?", a: "After nitrous, yes: it wears off within minutes. After oral sedation you'll need someone to drive you and stay with you for a few hours." },
      { q: "Is sedation safe?", a: "For healthy adults it's very safe when done by a trained, permitted dentist. We review your health history and monitor oxygen and pulse the whole time." },
    ],
    related: ["dental-implants", "emergency-dentistry", "cleanings-exams"],
    keywords: ["sedation dentist Dallas", "anxiety free dentist Uptown Dallas", "nervous patient dentist Dallas"],
  },
  {
    slug: "kids-dentistry",
    name: "Kids' dentistry",
    short: "Kids",
    category: "everyday",
    image: img.kidLaugh,
    detailImage: img.kidVisit,
    tagline: "First visits that end in high-fives, not tears.",
    summary: "Happy, unhurried visits for kids from their first tooth, with Dr. Delgado (bilingual), a treasure drawer and parents always welcome in the room.",
    duration: "30–45 min",
    comfort: 5,
    comfortNote: "Tell-show-do: kids see and touch every tool before we use it. No surprises.",
    price: "First visit free under 3 · $95 exam",
    insurance: "Children's preventive care is covered by most plans, including many CHIP and Medicaid plans.",
    intro: [
      "A child's first few dental visits shape how they feel about the dentist for life. So we go slowly: a ride in the chair, counting teeth with a mirror, sunglasses for the big light, and lots of praise.",
      "Dr. Sofia Delgado sees our youngest patients and is fluent in Spanish, so every family feels at home. Parents are always welcome to sit in, and siblings can book back-to-back.",
    ],
    forYou: [
      "Your little one has their first tooth (or first birthday)",
      "Your child is nervous after a bad experience elsewhere",
      "You want sealants and fluoride to prevent cavities",
      "You'd like a Spanish-speaking dentist",
    ],
    steps: [
      { title: "Happy hello", body: "A tour, a chair ride and a chance to meet the tools before anything starts." },
      { title: "Count & clean", body: "A gentle look and a polish in their favorite flavor, with a parent close by." },
      { title: "Tips for home", body: "Real-world brushing, snacking and thumb-sucking advice, no lectures." },
      { title: "Treasure drawer", body: "Every visit ends with a prize, a sticker and a high-five." },
    ],
    included: ["Gentle exam and cleaning", "Fluoride varnish", "Sealants when needed", "Growth and bite check", "Bilingual care (English/Spanish)"],
    faqs: [
      { q: "When should my child first see a dentist?", a: "By their first birthday or within six months of the first tooth. Early visits are short, playful and mostly about getting comfortable." },
      { q: "Can I stay with my child?", a: "Always. Parents are welcome in the room for every visit." },
      { q: "Do you accept CHIP or Medicaid?", a: "We accept many Texas CHIP and children's Medicaid plans. Use our insurance checker or call us and we'll confirm." },
    ],
    related: ["general-family-dentistry", "cleanings-exams", "emergency-dentistry"],
    keywords: ["kids dentist Uptown Dallas", "pediatric dentist Dallas", "dentista para niños Dallas"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
