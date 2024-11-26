import { Component } from '@angular/core';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CommonModule } from '@angular/common';
import { TranscriberSettingsModalComponent } from '@routes/components/transcriber-settings-modal/transcriber-settings-modal.component';
import { LanguageComponent } from '@shared/components/language/language.component';
import { AudioRecorderComponent } from '@routes/components/audio-recorder/audio-recorder.component';
import { AudioPlayerComponent } from '@routes/components/audio-player/audio-player.component';
import { TranscriberComponent } from '@routes/components/transcriber/transcriber.component';
import { LoggerService } from '@service/logger.service';

@Component({
  selector: 'app-audio-manager',
  templateUrl: './audio-manager.component.html',
  standalone: true,
  imports: [CommonModule, ModalModule, LanguageComponent, AudioRecorderComponent, AudioPlayerComponent, TranscriberComponent, TranslatePipe],
  providers: [BsModalService],
})
export class AudioManagerComponent {
  IS_WEBGPU_AVAILABLE = !!(navigator as any).gpu;
  isTranscribeEnabled = false;
  isTranscriptionInProgress = false;
  audioUrl?: string;
  audioBlob?: Blob;
  progress = 0;

  constructor(
    private modalService: BsModalService,
    protected deviceDetectorService: DeviceDetectorService
  ) {}

  onRecordingStarted(): void {
    LoggerService.logInfo('hello');
    this.reset();
  }

  onRecordingComplete(data: { audioBuffer: Blob; audioUrl: string }): void {
    this.audioUrl = data.audioUrl;
    this.audioBlob = data.audioBuffer;
  }

  clearCurrentRecording(): void {
    this.audioUrl = '';
    this.audioBlob = undefined;
  }

  openSettings(): void {
    this.modalService.show(TranscriberSettingsModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  transcribe(): void {
    this.isTranscribeEnabled = true;
  }

  reset(): void {
    this.isTranscribeEnabled = false;
    this.clearCurrentRecording();
  }

  setTranscriptionInProgress(isTranscriptionInProgress: boolean) {
    this.isTranscriptionInProgress = isTranscriptionInProgress;
  }
}
