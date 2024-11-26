import { pipeline } from '@huggingface/transformers';
// Define model factories
// Ensures only one model is created of each type
export class PipelineFactory {
  static task: any = 'automatic-speech-recognition';
  static model: string | null = null;
  static instance: any = null;

  static async getInstance(progressCallback?: (data: any) => void) {
    if (this.instance === null && this.model) {
      this.instance = pipeline(this.task, this.model, {
        dtype: {
          encoder_model: this.model === 'onnx-community/whisper-large-v3-turbo' ? 'fp16' : 'fp32',
          decoder_model_merged: 'q4', // or 'fp32' ('fp16' is broken)
        },
        device: 'webgpu',
        progress_callback: progressCallback,
      });
    }

    return this.instance;
  }
}
