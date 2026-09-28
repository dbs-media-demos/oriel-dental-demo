export type Faq = { q: string; a: string };

export const faqGroups: { title: string; items: Faq[] }[] = [
  {
    title: "First visits",
    items: [
      {
        q: "What happens at my first appointment?",
        a: "About 90 minutes: a relaxed conversation, a full exam, a 3D scan of your teeth, low-dose digital x-rays and a gentle cleaning if there's time. You leave with a written plan and prices. Nothing is done without your say-so.",
      },
      {
        q: "How much is a new-patient visit without insurance?",
        a: "$99 for the exam, 3D scan, x-rays and a standard cleaning. If you need a deeper cleaning, we'll explain why and quote it before starting.",
      },
      {
        q: "Can I fill in forms before I arrive?",
        a: "Yes. After you book, we text you a secure link to your health history and consent forms. They take about eight minutes on your phone.",
      },
      {
        q: "Do you have evening and weekend hours?",
        a: "We're open until 7 pm Monday to Thursday, and 8 am to 2 pm on Saturdays. Early birds can book from 7:30 am on weekdays.",
      },
    ],
  },
  {
    title: "Comfort & anxiety",
    items: [
      {
        q: "I'm really nervous about the dentist. Can you help?",
        a: "It's what we do best. Start with a no-chair meet & greet over coffee, pick from our comfort menu (weighted blanket, headphones, shows on the ceiling) and agree a stop signal. Nitrous oxide and oral sedation are available if you'd like them.",
      },
      {
        q: "Will it hurt?",
        a: "We numb the gum with gel before any injection, use a slow, computer-controlled delivery, and check you're comfortable before starting. Most patients say it's the gentlest visit they've had.",
      },
      {
        q: "Can I bring someone with me?",
        a: "Of course. A friend or family member is welcome in the room, and parents always stay with their kids.",
      },
    ],
  },
  {
    title: "Insurance & payment",
    items: [
      {
        q: "Do you take my insurance?",
        a: "We're in network with most major PPO plans, including Delta Dental, Cigna, MetLife, Aetna, Guardian and United Concordia, and we file claims for out-of-network plans too. Use the insurance checker or call us to confirm.",
      },
      {
        q: "What if I don't have insurance?",
        a: "Our Oriel Membership is $29 a month for adults. It covers two cleanings, exams, x-rays and an emergency visit each year, plus 15% off everything else.",
      },
      {
        q: "Do you offer payment plans?",
        a: "Yes: 0% financing for up to 12 months on treatment over $500, and longer plans through our lending partners. We'll show you the monthly amount before you decide.",
      },
    ],
  },
  {
    title: "Treatment",
    items: [
      {
        q: "Do you see dental emergencies the same day?",
        a: "Yes. Call before 3 pm on weekdays or early on Saturday and we'll see you the same day, whether or not you're already a patient.",
      },
      {
        q: "Do you offer Invisalign-style clear aligners?",
        a: "We offer clear aligner treatment planned from a 3D scan, with a preview of your final smile at your consult. For complex cases we refer to an orthodontist we trust.",
      },
      {
        q: "Are your before-and-after photos real patients?",
        a: "The images in our online smile gallery are illustrative simulations on stock photography, shown to explain treatments. We're happy to show real case photos, with patient permission, at your consultation. Results vary.",
      },
    ],
  },
];

export const allFaqs: Faq[] = faqGroups.flatMap((g) => g.items);
export const homeFaqs: Faq[] = [allFaqs[0], allFaqs[4], allFaqs[7], allFaqs[8], allFaqs[10]];
