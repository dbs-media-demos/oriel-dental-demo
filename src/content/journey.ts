import { img } from "./images";
import type { Chapter } from "@/components/sections/Journey";

export const journey: Chapter[] = [
  {
    kicker: "Book",
    title: "Book online in about a minute.",
    body: "Pick a time that suits you, including evenings and Saturdays. Your forms arrive by text, and a real person confirms your insurance before you ever sit down.",
    points: ["Evenings until 7 pm", "Saturday mornings", "Forms on your phone"],
    image: img.receptionArches,
  },
  {
    kicker: "Welcome",
    title: "A warm welcome, not a waiting room.",
    body: "Tea or sparkling water in the lounge, then choose your comforts: a weighted blanket, noise-cancelling headphones, your show on the ceiling, a warm neck pillow.",
    points: ["Weighted blankets", "Headphones", "Streaming on the ceiling", "Lavender tea"],
    image: img.comfortBlanket,
  },
  {
    kicker: "Exam",
    title: "A gentle exam with a 3D scan.",
    body: "No goopy impressions. A three-minute 3D scan and low-dose digital x-rays show us everything, and we show it all to you on the screen above the chair.",
    points: ["3D intraoral scan", "80% less radiation", "See what we see"],
    image: img.scanPatient,
  },
  {
    kicker: "Plan",
    title: "A clear plan, with prices.",
    body: "What's urgent, what can wait, and what's purely optional, each with a price and your insurance estimate. You take it home and decide. No pressure, ever.",
    points: ["Written options", "Insurance estimate", "0% financing"],
    image: img.studioConsult2,
  },
  {
    kicker: "Gift",
    title: "And a little something to take home.",
    body: "Every new patient leaves with our Oriel kit: a bamboo brush, silk floss, a lip balm we love, and $50 toward professional whitening.",
    points: ["Bamboo brush", "Silk floss", "$50 whitening credit"],
    image: img.detailBamboo,
  },
];
