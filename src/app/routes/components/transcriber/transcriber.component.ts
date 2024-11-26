import { Component, effect, input, model, OnInit, output } from '@angular/core';
import { NotificationService } from '@service/notification.service';
import { TranscriberService } from '@service/transcriber/transcriber.service';
import { TranscriberConfigStorage } from '@storage/transcriber-config.storage';
import { NgClass, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transcriber',
  templateUrl: './transcriber.component.html',
  standalone: true,
  imports: [NgClass, DecimalPipe, TranslatePipe],
  providers: [TranscriberService],
})
export class TranscriberComponent implements OnInit {
  protected audioProgress: number | undefined = 0;
  audioBlob = input.required<Blob>();
  isTranscriptionInProgress = output<boolean>();

  constructor(
    private notificationService: NotificationService,
    public transcriberService: TranscriberService,
    private transcriberConfigStorage: TranscriberConfigStorage
  ) {
    effect(() => {
      this.isTranscriptionInProgress.emit(this.transcriberService.isBusy);
    });
  }

  ngOnInit(): void {
    if (!this.transcriberService.isBusy && this.audioBlob()) {
      this.startTranscription();
    }
  }

  async startTranscription(): Promise<void> {
    const audioBuffer = await this.setAudioFromRecording();
    if (audioBuffer) {
      this.notificationService.showInfo('Transcription started');
      await this.transcriberService.startTranscription(audioBuffer);
      this.notificationService.showInfo('Transcription ended');
    }
  }

  async setAudioFromRecording(): Promise<AudioBuffer | undefined> {
    return new Promise<AudioBuffer | undefined>(resolve => {
      this.audioProgress = 0;
      const fileReader = new FileReader();
      fileReader.onprogress = event => {
        this.audioProgress = event.loaded / event.total || 0;
      };
      fileReader.onloadend = async () => {
        try {
          const audioCtx = new AudioContext({
            sampleRate: this.transcriberConfigStorage.samplingRate,
          });
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          this.audioProgress = undefined;
          resolve(audioBuffer);
        } catch (error) {
          this.notificationService.showError('Error occurred reading file');
          console.log(error);
          resolve(undefined);
        }
      };
      fileReader.readAsArrayBuffer(this.audioBlob());
    });
  }

  formatAudioTimestamp(time: number): string {
    const hours = (time / (60 * 60)) | 0;
    time -= hours * (60 * 60);
    const minutes = (time / 60) | 0;
    time -= minutes * 60;
    const seconds = time | 0;
    return `${hours ? this.padTime(hours) + ':' : ''}${this.padTime(minutes)}:${this.padTime(seconds)}`;
  }

  padTime(time: number): string {
    return String(time).padStart(2, '0');
  }
}
