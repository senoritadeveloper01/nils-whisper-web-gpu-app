import { Component, ElementRef, output, ViewChild } from '@angular/core';
import { NotificationService } from '@service/notification.service';
import { webmFixDuration } from 'app/utils/blob-fix';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  standalone: true,
  imports: [TranslatePipe],
})
export class AudioRecorderComponent {
  isRecording = false;
  private mediaRecorder?: MediaRecorder;
  private canvasCtx!: CanvasRenderingContext2D;
  @ViewChild('soundClips') soundClips!: ElementRef<HTMLDivElement>;
  @ViewChild('visualizer') visualizer!: ElementRef<HTMLCanvasElement>;
  recordingStarted = output<boolean>();
  recordingComplete = output<{ audioBuffer: Blob; audioUrl: string }>();

  constructor(private notificationService: NotificationService) {}

  getMimeType(): string | undefined {
    const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/aac'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  }

  async startRecording(): Promise<void> {
    this.isRecording = true;
    this.recordingStarted.emit(true);

    const audioChunks: Blob[] = [];

    try {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.visualize(stream);

        const startTime = Date.now();
        const mimeType = this.getMimeType();
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType,
        });

        this.mediaRecorder.ondataavailable = async event => {
          if (event.data.size === 0) {
            // Ignore empty data
            return;
          }
          audioChunks.push(event.data);
          const duration = Date.now() - startTime;

          // Received a stop event
          let audioBlob = new Blob(audioChunks, { type: mimeType });
          if (this.mediaRecorder?.state === 'inactive') {
            if (mimeType === 'audio/webm') {
              audioBlob = await webmFixDuration(audioBlob, duration, audioBlob.type);
            }
            this.completeRecording(audioBlob);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: mimeType });
          this.completeRecording(audioBlob);
        };

        this.mediaRecorder.start();
      });
    } catch (error) {
      this.notificationService.showError('Error accessing microphone');
      console.error(error);
      this.isRecording = false;
      this.recordingStarted.emit(false);
    }
  }

  private visualize(stream: MediaStream): void {
    this.setupCanvas();

    const audioCtx = new AudioContext();

    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    this.draw(analyser, bufferLength, dataArray);
  }

  private setupCanvas() {
    if (this.visualizer) {
      this.canvasCtx = this.visualizer.nativeElement.getContext('2d')!;
      window.onresize = () => (this.visualizer.nativeElement.width = this.soundClips.nativeElement.offsetWidth);
      window.dispatchEvent(new Event('resize'));
    }
  }

  private draw(analyser: AnalyserNode, bufferLength: number, dataArray: Uint8Array) {
    const canvas = this.visualizer.nativeElement;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const drawVisualizer = () => {
      requestAnimationFrame(drawVisualizer);
      analyser.getByteTimeDomainData(dataArray);
      this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      this.canvasCtx.lineWidth = 2;
      this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      this.canvasCtx.beginPath();

      let x = 0;
      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;
        if (i === 0) this.canvasCtx.moveTo(x, y);
        else this.canvasCtx.lineTo(x, y);
        x += sliceWidth;
      }
      this.canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      this.canvasCtx.stroke();
    };

    drawVisualizer();
  }

  stopRecording(): void {
    this.isRecording = false;
    this.mediaRecorder?.stop();
  }

  private completeRecording(audioBlob: Blob): void {
    this.isRecording = false;

    const audioUrl = URL.createObjectURL(audioBlob);
    this.recordingComplete.emit({ audioBuffer: audioBlob, audioUrl: audioUrl });
  }
}
