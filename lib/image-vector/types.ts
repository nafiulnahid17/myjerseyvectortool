export type PatternId = 'production-black' | 'transparent-layout';
export type QualityId = 'standard' | 'hd' | '4k-pro' | 'production-vector';
export type AspectRatioId = '4:3' | '1:1' | '9:16' | '16:9';
export type StudioPhase = 'setup' | 'generating' | 'result' | 'customize' | 'preview' | 'download';
export type ExportFormat = 'svg' | 'ai' | 'pdf' | 'png' | 'jpeg';
export type ExportQuality = '4k' | 'high' | 'medium' | 'low';

export type PatternPreset = {
  id: PatternId;
  title: string;
  subtitle: string;
  preview: string;
  defaultAspect: AspectRatioId;
  background: 'opaque' | 'transparent';
};

export type GenerationPayload = {
  pattern: PatternId;
  quality: QualityId;
  aspectRatio: AspectRatioId;
  customizationPrompt?: string;
  mode: 'generate' | 'edit';
};

export type GenerationResponse = {
  configured: boolean;
  imageDataUrl?: string;
  message: string;
  prompt?: string;
  provider?: string;
  model?: string;
};
