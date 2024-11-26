import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class TranscriberConfigStorage {
  samplingRate = 16000;
  model = 'onnx-community/whisper-base';
  subtask = 'transcribe';
  language = 'english';
  isMultilingual = true;

  constructor(private deviceDetectorService: DeviceDetectorService) {
    // isMobileOrTablet
    this.model = this.deviceDetectorService.isDesktop() ? 'onnx-community/whisper-base' : 'onnx-community/whisper-tiny';
  }
}
