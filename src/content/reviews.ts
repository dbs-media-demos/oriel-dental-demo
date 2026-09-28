export type Review = {
  name: string;
  area: string;
  rating: 5 | 4;
  when: string;
  /** ISO date for schema.org */
  date: string;
  treatment: string;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Jessica M.",
    area: "Uptown",
    rating: 5,
    when: "2 weeks ago",
    date: "2026-09-14",
    treatment: "Cleaning",
    text: "I hadn't been to a dentist in six years because of one awful experience. Maya let me hold a stress ball, explained every step, and stopped every time I lifted my hand. I actually booked my next cleaning before I left.",
  },
  {
    name: "Carlos R.",
    area: "Oak Lawn",
    rating: 5,
    when: "1 month ago",
    date: "2026-08-27",
    treatment: "Dental implant",
    text: "Dr. Ashford replaced a molar I cracked on a pecan. The 3D planning was fascinating, the surgery took under an hour with nitrous, and I was back at work the next morning. The all-in price was exactly what I paid.",
  },
  {
    name: "Priya S.",
    area: "Victory Park",
    rating: 5,
    when: "3 weeks ago",
    date: "2026-09-05",
    treatment: "Porcelain veneers",
    text: "Six veneers with Dr. Marsh. I wore the try-in for a week and we changed the length twice. Friends keep saying I look rested, and nobody has guessed. Worth every penny.",
  },
  {
    name: "Ana & Luis G.",
    area: "State Thomas",
    rating: 5,
    when: "2 months ago",
    date: "2026-07-30",
    treatment: "Kids' dentistry",
    text: "Dr. Delgado spoke Spanish with my mom and English with our kids, all in the same appointment. Our four-year-old now asks when she can go back and pick from the treasure drawer.",
  },
  {
    name: "Tom W.",
    area: "Turtle Creek",
    rating: 5,
    when: "1 week ago",
    date: "2026-09-21",
    treatment: "Emergency visit",
    text: "Broke a crown on a Saturday morning before a wedding. Called at 8:10, was in the chair at 9:30, and walked out with a temporary that got me through the toasts. Lifesavers.",
  },
  {
    name: "Rachel K.",
    area: "Knox-Henderson",
    rating: 5,
    when: "5 days ago",
    date: "2026-09-23",
    treatment: "Clear aligners",
    text: "Seven months of aligners and my teeth are finally straight again after I stopped wearing my retainer in college. Most check-ins were ten minutes on my lunch break.",
  },
  {
    name: "Marcus L.",
    area: "Downtown",
    rating: 5,
    when: "1 month ago",
    date: "2026-08-19",
    treatment: "Sedation dentistry",
    text: "I'm the guy who cancels dentist appointments. Oral sedation with Dr. Ashford meant I got four fillings and a crown done in one visit and barely remember it. Wish I'd done this ten years ago.",
  },
  {
    name: "Emily H.",
    area: "Highland Park",
    rating: 5,
    when: "3 months ago",
    date: "2026-06-24",
    treatment: "Teeth whitening",
    text: "In-office whitening before my engagement photos. The desensitizing gel worked, I watched a movie on the ceiling, and the result looks like me on a very good day.",
  },
  {
    name: "David N.",
    area: "Uptown",
    rating: 4,
    when: "2 months ago",
    date: "2026-07-15",
    treatment: "Crown",
    text: "Great care and the nicest waiting room in Dallas. Parking in the garage took a minute to figure out the first time, but they validate it and the front desk walked me through it.",
  },
  {
    name: "Samantha B.",
    area: "Oak Lawn",
    rating: 5,
    when: "4 weeks ago",
    date: "2026-08-31",
    treatment: "New patient visit",
    text: "The $99 first visit was genuinely thorough: 3D scan, x-rays, cleaning and a long talk with Dr. Marsh. I got a written plan with prices and zero pressure to do anything that day.",
  },
];

export const ratingBreakdown = [
  { stars: 5, share: 0.93 },
  { stars: 4, share: 0.05 },
  { stars: 3, share: 0.01 },
  { stars: 2, share: 0.005 },
  { stars: 1, share: 0.005 },
];
