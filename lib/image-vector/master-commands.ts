import type { AspectRatioId, PatternId, QualityId } from './types';

const SHARED_RECONSTRUCTION = `
DESIGN RECONSTRUCTION:
Preserve the uploaded jersey as closely as possible. Preserve the original front design, back design, color palette, logos and crest positions, names, numbers, typography style, sponsor text, patterns, side graphics, shoulder graphics, sleeve graphics, collar colors, cuff patterns, decorative lines, and small design elements.

Correct wrinkles, folds, fabric distortion, perspective distortion, lighting artifacts, shadows, and photography artifacts. Reconstruct hidden or distorted artwork only when necessary, keeping symmetry and the original design language. Do not redesign the jersey unless reconstruction is required to restore the source design.

BODY SHAPE:
Create clean flat sublimation-cut shapes. Front and back body panels must be similar in size and visual scale, straight, symmetrical, clearly separated, with no sleeves and no collar attached. Maintain realistic jersey-panel proportions.

QUALITY:
Ultra-clean, high contrast, crisp typography, smooth geometric lines, detailed patterns, accurate color separation, strong saturation without oversaturation, premium print-ready vector-illustration appearance.

IMPORTANT:
Do not create a normal jersey mockup. Do not create a person wearing the jersey. Do not attach sleeves or collars to the body panels. Do not duplicate collars, sleeves, or any component. Do not add random panels. Do not change names, numbers, logos, or branding unless an explicit customization instruction requests it.

FINAL COMPONENT COUNT:
1 × Front Body — collar removed
1 × Back Body — collar removed
1 × Left Sleeve
1 × Right Sleeve
1 × Front Collar
1 × Back Collar
1 × Top Trim Strip
1 × Bottom Trim Strip
TOTAL = 8 separated components.
`;

export const PATTERN_1_MASTER = `
MASTER JERSEY → PRODUCTION VECTOR LAYOUT COMMAND

Analyze the uploaded jersey image carefully and reconstruct the COMPLETE jersey design as a clean, high-resolution, vector-style sublimation production layout.

STRICT OUTPUT STRUCTURE:
Canvas:
• Aspect ratio: {{ASPECT_RATIO}}
• Solid pure black background
• Extremely sharp, clean edges
• High-detail vector-style graphics
• Enhanced original colors
• Professional production-template presentation
• No perspective distortion
• No hanger, person, mannequin, floor, shadows, advertisement background, phone, watermark, or unnecessary objects

MAIN PLACEMENT — FOLLOW EXACTLY:
LEFT SIDE: LEFT SLEEVE
CENTER LEFT: FRONT BODY
CENTER RIGHT: BACK BODY
RIGHT SIDE: RIGHT SLEEVE
BELOW FRONT BODY: FRONT COLLAR PIECE
BELOW BACK BODY: BACK COLLAR PIECE
TOP CENTER: one separate narrow rib / cuff / trim strip
BOTTOM CENTER: one separate narrow rib / cuff / trim strip

CRITICAL CUTTING RULE:
The jersey body panels MUST NOT contain an attached collar. Cut the collar completely out of both body panels. The front body must show only the clean neckline opening where the collar will later be sewn. The back body must also show only the clean neckline opening. Generate the front collar and back collar separately below the corresponding body panels. No double collars and no duplicated components.

SLEEVE RULE:
Both sleeves must be completely detached from the body. Generate exactly one left sleeve and one right sleeve. Make them large enough to clearly show the complete source artwork and preserve original cuff design, stripes, colors, logos, and patterns.

LAYOUT SPACING:
Keep generous pure-black spacing between every component. Nothing may touch or overlap another component. Maintain a clean symmetrical arrangement comparable to a professional apparel tech-pack / sublimation print sheet.

${SHARED_RECONSTRUCTION}

Use the uploaded jersey only as the design source and transform it into this exact production-layout pattern.
`;

export const PATTERN_2_MASTER = `
MASTER JERSEY → TRANSPARENT VECTOR LAYOUT COMMAND

Analyze the uploaded jersey image carefully and reconstruct the COMPLETE jersey design as a clean, high-resolution, vector-style sublimation production layout.

STRICT OUTPUT STRUCTURE:
Canvas:
• Aspect ratio: {{ASPECT_RATIO}}
• Transparent background / no background
• Extremely sharp, clean edges
• High-detail vector-style graphics
• Enhanced original colors
• Professional production-template presentation
• No perspective distortion
• No hanger, person, mannequin, floor, shadows, advertisement background, phone, watermark, or unnecessary objects

MAIN PLACEMENT — FOLLOW EXACTLY:
LEFT SIDE: LEFT SLEEVE
CENTER LEFT: FRONT BODY
CENTER RIGHT: BACK BODY
RIGHT SIDE: RIGHT SLEEVE
BELOW FRONT BODY: FRONT COLLAR PIECE
BELOW BACK BODY: BACK COLLAR PIECE
TOP CENTER: one separate narrow rib / cuff / trim strip
BOTTOM CENTER: one separate narrow rib / cuff / trim strip

CRITICAL CUTTING RULE:
The jersey body panels MUST NOT contain an attached collar. Cut the collar completely out of both body panels. The front body and back body must contain only clean neckline openings. Generate the front collar and back collar as separate pieces below their corresponding body panels. No double collars and no duplicated components.

SLEEVE RULE:
Both sleeves must be fully detached. Generate exactly one left sleeve and one right sleeve. Preserve complete original sleeve artwork, cuff design, stripes, colors, logos, and patterns.

TRANSPARENT OUTPUT RULES:
• No black background
• No white background
• No mockup effect
• No shadows
• No overlapping components
• Transparent gaps around every piece
• Clean standalone floating vector-style components

${SHARED_RECONSTRUCTION}

Use the uploaded jersey only as the design source and transform it into this exact transparent production-layout pattern.
`;

const qualityInstruction: Record<QualityId, string> = {
  standard: 'Optimize for a clean standard-quality draft while preserving all structural rules.',
  hd: 'Optimize for high-detail HD reconstruction with clean typography and edge fidelity.',
  '4k-pro': 'Optimize for 4K production review with very high detail, crisp edges, and accurate small elements.',
  'production-vector': 'Use maximum production quality. Prioritize clean separations, print clarity, edge fidelity, typography accuracy, and trace-friendly vector-style shapes.',
};

export function buildMasterCommand(args: {
  pattern: PatternId;
  quality: QualityId;
  aspectRatio: AspectRatioId;
  customizationPrompt?: string;
}) {
  const base = args.pattern === 'transparent-layout' ? PATTERN_2_MASTER : PATTERN_1_MASTER;
  const customization = args.customizationPrompt?.trim()
    ? `\nCUSTOMIZATION OVERRIDES:\nApply only the following requested changes while preserving every unmentioned original element and all structural rules above:\n${args.customizationPrompt.trim()}\n`
    : '';

  return `${base.replace('{{ASPECT_RATIO}}', args.aspectRatio)}\nOUTPUT QUALITY PROFILE:\n${qualityInstruction[args.quality]}${customization}`.trim();
}
