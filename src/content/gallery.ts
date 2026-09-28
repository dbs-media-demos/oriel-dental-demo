import { img, type Img } from "./images";

export type CaseType = "whitening" | "veneers" | "aligners" | "implants";

export const caseTabs: { id: CaseType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "whitening", label: "Whitening" },
  { id: "veneers", label: "Veneers" },
  { id: "aligners", label: "Aligners" },
  { id: "implants", label: "Implants" },
];

export type SmileCase = {
  id: string;
  type: CaseType;
  title: string;
  detail: string;
  visits: string;
  before: Img;
  after: Img;
};

/*
 * Every pair is the SAME stock photo with a digitally simulated tooth shade, so they
 * explain a treatment without pretending to be a real patient's result. The UI labels
 * each one "Illustrative".
 */
export const smileCases: SmileCase[] = [
  {
    id: "c1",
    type: "whitening",
    title: "In-office whitening",
    detail: "Three 15-minute rounds, one afternoon",
    visits: "1 visit",
    before: img.smileBa1Before,
    after: img.smileBa1After,
  },
  {
    id: "c2",
    type: "veneers",
    title: "Six porcelain veneers",
    detail: "Hand-layered porcelain, upper front teeth",
    visits: "3 visits · 3 weeks",
    before: img.smileBa3Before,
    after: img.smileBa3After,
  },
  {
    id: "c3",
    type: "aligners",
    title: "Clear aligners + whitening finish",
    detail: "Mild crowding, take-home whitening at the end",
    visits: "9 months",
    before: img.smileBa5Before,
    after: img.smileBa5After,
  },
  {
    id: "c4",
    type: "whitening",
    title: "Take-home whitening trays",
    detail: "Custom trays, 30 minutes a day for two weeks",
    visits: "2 visits",
    before: img.smileBa2Before,
    after: img.smileBa2After,
  },
  {
    id: "c5",
    type: "veneers",
    title: "Eight veneers, smile redesign",
    detail: "Try-in worn for a week before final porcelain",
    visits: "3 visits · 4 weeks",
    before: img.smileBa4Before,
    after: img.smileBa4After,
  },
  {
    id: "c6",
    type: "implants",
    title: "Single implant + shade match",
    detail: "Guided implant, crown matched after whitening",
    visits: "4 months",
    before: img.smileBa7Before,
    after: img.smileBa7After,
  },
  {
    id: "c7",
    type: "whitening",
    title: "Whitening after years of coffee",
    detail: "In-office start, take-home touch-ups",
    visits: "1 visit + home",
    before: img.smileBa6Before,
    after: img.smileBa6After,
  },
];
