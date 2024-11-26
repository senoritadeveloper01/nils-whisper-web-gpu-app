import { Injectable, signal, WritableSignal } from '@angular/core';
import { TranscriberConfigStorage } from '@storage/transcriber-config.storage';
import { PipelineFactory } from '@model/pipeline-factory';
import { WhisperTextStreamer } from '@huggingface/transformers';
import { ModelProgressItem } from '@model/model-progress-item';
import { TranscriberData } from '@model/transcriber-data';
import { LoggerService } from '@service/logger.service';

@Injectable()
export class TranscriberService {
  private transcriber: any;
  private streamer: any;

  // transcription process
  public isBusySignal: WritableSignal<boolean> = signal<boolean>(false);
  public errorSignal: WritableSignal<any> = signal<any>(null);
  public transcriptSignal: WritableSignal<TranscriberData | null> = signal<TranscriberData | null>(null);

  // downloading model files process
  public isModelLoadingSignal: WritableSignal<boolean> = signal<boolean>(false);
  public progressItemsSignal: WritableSignal<ModelProgressItem[]> = signal<ModelProgressItem[]>([]);

  constructor(private transcriberConfigStorage: TranscriberConfigStorage) {}

  // Getters for accessing signals in templates or codes
  get transcript() {
    return this.transcriptSignal();
  }

  get isBusy() {
    return this.isBusySignal();
  }

  get isModelLoading() {
    return this.isModelLoadingSignal();
  }

  get progressItems() {
    return this.progressItemsSignal();
  }

  get error() {
    return this.errorSignal();
  }

  async startTranscription(audioBuffer: AudioBuffer): Promise<void> {
    this.transcriptSignal.set(null);
    this.errorSignal.set(null);
    this.isBusySignal.set(true);

    const audio = this.getAudio(audioBuffer);
    const transcript = await this.transcribe(audio);

    this.transcriptSignal.set(transcript);
    this.isBusySignal.set(false);
  }

  private getAudio(audioBuffer: AudioBuffer): any {
    let audio;
    if (audioBuffer.numberOfChannels === 2) {
      const SCALING_FACTOR = Math.sqrt(2);

      const left = audioBuffer.getChannelData(0);
      const right = audioBuffer.getChannelData(1);

      audio = new Float32Array(left.length);
      for (let i = 0; i < audioBuffer.length; ++i) {
        audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
      }
    } else {
      // If the audio is not stereo, we can just use the first channel:
      audio = audioBuffer.getChannelData(0);
    }
    return audio;
  }

  async transcribe(audio: any): Promise<TranscriberData | null> {
    await this.initializePipelineFactory();

    await this.createTranscriber();

    this.createStreamer();

    try {
      const chunkLengthInSeconds = this.transcriberConfigStorage.model.startsWith('distil-whisper/') ? 20 : 30;
      const strideLengthInSeconds = this.transcriberConfigStorage.model.startsWith('distil-whisper/') ? 3 : 5;

      const output = await this.transcriber(audio, {
        top_k: 0,
        do_sample: false,
        chunk_length_s: chunkLengthInSeconds,
        stride_length_s: strideLengthInSeconds,
        language: this.transcriberConfigStorage.language,
        task: this.transcriberConfigStorage.subtask,
        return_timestamps: true,
        force_full_sequences: false,
        streamer: this.streamer,
      });
      return { tps: this.streamer.tps, ...output };
    } catch (error) {
      this.errorSignal.set((error as any)?.message);
      LoggerService.logError('Transcription error');
      console.error(error);
      return null;
    }
  }

  private async initializePipelineFactory(): Promise<void> {
    const p = PipelineFactory;
    if (p.model !== this.transcriberConfigStorage.model) {
      // Invalidate model if different
      p.model = this.transcriberConfigStorage.model;

      if (p.instance !== null) {
        (await p.getInstance()).dispose();
        p.instance = null;
      }
    }
  }

  private async createTranscriber(): Promise<void> {
    const transcriber = await PipelineFactory.getInstance(data => {
      switch (data.status) {
        case 'progress': {
          // Model file progress: update one of the progress items.
          this.progressItemsSignal.update(items =>
            items.map(item => (item.file === (data.file as string) ? { ...item, progress: data.progress } : item))
          );
          break;
        }
        case 'initiate': {
          // Model file start load: add a new progress item to the list.
          this.isModelLoadingSignal.set(true);
          this.progressItemsSignal.update(items => [...items, data]);
          break;
        }
        case 'ready': {
          this.isModelLoadingSignal.set(false);
          break;
        }
        case 'done': {
          // Model file loaded: remove the progress item from the list.
          this.progressItemsSignal.update(items => items.filter(item => item.file !== (data.file as string)));
          break;
        }
      }
    });
    this.transcriber = transcriber;
  }

  private createStreamer(): void {
    const isDistilWhisper = this.transcriberConfigStorage.model.startsWith('distil-whisper/');
    const chunkLengthInSeconds = isDistilWhisper ? 20 : 30;
    const strideLengthInSeconds = isDistilWhisper ? 3 : 5;
    const timePrecision = this.transcriber.processor.feature_extractor.config.chunk_length / this.transcriber.model.config.max_source_positions;

    const chunks: { text: string; offset: number; timestamp: [number, number | null]; finalised: boolean }[] = [];
    let chunkCount = 0;
    let startTime;
    let numTokens = 0;
    let tps: any;

    this.streamer = new WhisperTextStreamer(this.transcriber.tokenizer, {
      time_precision: timePrecision,
      on_chunk_start: (x: any) => {
        const offset = (chunkLengthInSeconds - strideLengthInSeconds) * chunkCount;
        chunks.push({
          text: '',
          offset: offset,
          timestamp: [offset + x, null],
          finalised: false,
        });
      },
      token_callback_function: () => {
        startTime ??= performance.now();
        if (numTokens++ > 0) {
          tps = (numTokens / (performance.now() - startTime)) * 1000;
        }
      },
      callback_function: (x: any) => {
        if (chunks.length === 0) return;
        chunks[chunks.length - 1].text += x;

        this.transcriptSignal.set({
          isBusy: true,
          text: '', // No need to send full text yet
          chunks: chunks,
          tps: tps,
        });
        this.isBusySignal.set(true);
      },
      on_chunk_end: x => {
        const current = chunks[chunks.length - 1];
        if (current) {
          current.timestamp[1] = x + current.offset;
          current.finalised = true;
        }
      },
      on_finalize: () => {
        startTime = null;
        numTokens = 0;
        ++chunkCount;
      },
    });
  }
}
