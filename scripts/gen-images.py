"""Builds src/content/images.ts from public/images: dimensions, a tiny blur placeholder and alt text.

Run from the project root:  python scripts/gen-images.py
"""
import base64
import io
import os
import re

from PIL import Image

ALTS = {
    "studio-consult": "Dentist in light scrubs chatting with a smiling patient in a bright treatment room",
    "studio-consult-2": "Dentist explaining a treatment plan to a relaxed patient in the chair",
    "suite-wood": "Treatment suite with a white dental chair, oak floors and soft daylight",
    "suite-bright": "Bright, airy treatment room with a plant by the window",
    "suite-window": "White dental chair beside a tall window filled with daylight",
    "suite-detail": "Close view of a clean, modern dental unit in white",
    "suite-room": "Quiet treatment room with a reclined chair and wood floors",
    "suite-sunlit": "Sunlit treatment room with floor-to-ceiling windows",
    "reception-arches": "Sage-green reception with arched wall panels and a plant",
    "reception-desk": "Minimal reception desk in warm oak with an olive tree",
    "lounge-hall": "Calm hallway with paneled walls, framed art and a soft armchair",
    "lounge-plants": "Light-filled lounge with wooden floors and lots of plants",
    "lounge-window": "Two leather armchairs and a bird-of-paradise plant by a window",
    "lounge-tv": "Comfortable patient lounge with sofas, armchairs and a TV",
    "lobby-wood": "Welcoming lobby with oak panels, pendant lights and plants",
    "dentist-laugh": "Patient laughing in the chair while the dentist checks his teeth",
    "dentist-chat": "Smiling dentist in a white coat talking with a patient",
    "patient-relaxed": "Relaxed patient smiling during a gentle exam",
    "patient-kid": "Young girl smiling from the dental chair",
    "kid-laugh": "Little boy laughing with a big, gap-toothed grin",
    "kid-visit": "Young boy with a toy on the dental chair next to a friendly dentist",
    "family-park": "Young family laughing together outdoors",
    "family-couch": "Parents and son smiling together on a sofa",
    "senior-smile": "Older man with a warm, confident smile",
    "scan-patient": "Dentist using a digital intraoral scanner on a smiling patient",
    "scan-tablet": "3D scan of a patient's teeth on a tablet",
    "scanner": "Digital intraoral 3D scanner resting in its dock",
    "xray-review": "Dentist reviewing digital x-rays on a light panel",
    "dr-elena": "Dr. Elena Marsh smiling in scrubs in a sunlit office",
    "dr-julian": "Dr. Julian Ashford in dark scrubs, smiling",
    "dr-sofia": "Dr. Sofia Delgado in teal scrubs, arms crossed and smiling",
    "team-maya": "Maya, our lead hygienist, in navy scrubs",
    "team-marcus": "Marcus, hygienist, smiling in blue scrubs",
    "team-grace": "Grace, patient coordinator, laughing",
    "team-lena": "Lena, practice manager, smiling outdoors",
    "smile-curls": "Woman with curly hair smiling widely",
    "smile-soft": "Woman with a soft, natural smile",
    "smile-sky": "Woman laughing against a clear sky",
    "smile-lace": "Woman in a white lace top laughing in the sun",
    "smile-laugh": "Woman laughing with her eyes closed",
    "smile-golden": "Woman with golden hair smiling in warm light",
    "smile-denim": "Woman in a denim jacket laughing",
    "smile-dusk": "Woman laughing outdoors at dusk",
    "smile-joy": "Woman with natural curls laughing joyfully",
    "smile-sun": "Woman smiling with sunlight on her face",
    "smile-glow": "Woman smiling in golden-hour light",
    "smile-man": "Man with a short beard smiling",
    "smile-man-2": "Man with a beard smiling broadly",
    "smile-man-3": "Young man with a wide, easy smile",
    "comfort-headphones": "Patient relaxing with noise-cancelling headphones",
    "comfort-blanket": "Chunky knit blanket draped over a soft sofa",
    "comfort-tea": "A cup of tea resting on soft linen",
    "comfort-headphones-sage": "Sage-green headphones floating on a sage background",
    "detail-brush-sage": "Toothbrushes and dried flowers on a sage background",
    "detail-bamboo": "Bamboo toothbrushes in a glass jar with eucalyptus",
    "detail-mirror": "Dental mirror and explorer on white",
    "detail-mirror-2": "Dental mirror held up in a bright treatment room",
    "aligner-hand": "Woman placing a clear aligner on her teeth",
    "aligner-smile": "Woman pressing a clear aligner into place",
    "aligner-clear": "A clear aligner tray on a white surface",
    "aligner-model": "Hands fitting a clear aligner onto a dental model",
    "implant-model": "Dental implant model beside natural teeth models",
    "light-leaves": "Leaf shadows falling across a warm wall",
    "light-leaves-2": "Soft shadows of leaves on a plaster wall",
    "light-palm": "Palm-leaf shadow on a pale wall",
    "arch-decor": "Two cream arches with a sprig of dried flowers",
    "arch-wall": "An arched niche in a sand-colored wall",
    "dallas-skyline": "Downtown Dallas skyline under a blue sky",
    "dallas-park": "Uptown Dallas towers above a leafy park in autumn",
    "dallas-street": "Tree-lined Dallas street with high-rises",
}

ROOT = "public/images"


def camel(name: str) -> str:
    return re.sub(r"-(\w)", lambda m: m.group(1).upper(), name)


def main() -> None:
    files = [(n[:-4], f"images/{n}") for n in sorted(os.listdir(ROOT)) if n.endswith(".jpg")]
    files += [(f"smile-{n[:-4]}", f"images/smile/{n}") for n in sorted(os.listdir(f"{ROOT}/smile")) if n.endswith(".jpg")]
    out = [
        "// Generated by scripts/gen-images.py. Do not edit by hand.",
        "export type Img = { src: string; width: number; height: number; blur: string; alt: string };",
        "",
        "export const img = {",
    ]
    for name, rel in files:
        im = Image.open(f"public/{rel}").convert("RGB")
        w, h = im.size
        thumb = im.copy()
        thumb.thumbnail((16, 16))
        buf = io.BytesIO()
        thumb.save(buf, "JPEG", quality=50)
        blur = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()
        alt = "Close-up of a smile" if name.startswith("smile-ba") else ALTS.get(name, "")
        out.append(f'  {camel(name)}: {{ src: "/{rel}", width: {w}, height: {h}, blur: "{blur}", alt: "{alt}" }},')
    out += ["} satisfies Record<string, Img>;", "", "export type ImgKey = keyof typeof img;", ""]
    with open("src/content/images.ts", "w", encoding="utf-8") as f:
        f.write("\n".join(out))
    missing = [n for n, _ in files if n not in ALTS and not n.startswith("smile-ba")]
    print(len(files), "images; missing alt:", missing)


if __name__ == "__main__":
    main()
