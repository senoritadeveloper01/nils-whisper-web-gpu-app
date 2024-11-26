import { Component } from '@angular/core';
import { TranslatorConstants } from '@model/translator-constants';
import { TranscriberConfigStorage } from '@storage/transcriber-config.storage';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective } from 'ngx-bootstrap/dropdown';
import { NgClass, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-transcriber-settings-modal',
  templateUrl: './transcriber-settings-modal.component.html',
  styleUrls: ['./transcriber-settings-modal.component.scss'],
  standalone: true,
  imports: [BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective, NgClass, TitleCasePipe, KeyValuePipe, TranslatePipe],
})
export class TranscriberSettingsModalComponent {
  languages = TranslatorConstants.SUPPORTED_LANGUAGES;
  models: { name: string; size: number }[] = [];
  language = 'english';
  model = '';

  constructor(
    private bsModalRef: BsModalRef,
    public transcriberConfigStorage: TranscriberConfigStorage
  ) {
    this.filterModels();
  }

  filterModels(): void {
    this.models = Object.entries(TranslatorConstants.MODELS)
      .filter(([key]) => !this.transcriberConfigStorage.isMultilingual || !key.startsWith('/distil-'))
      .map(([key, val]) => ({ name: `${key}${this.transcriberConfigStorage.isMultilingual || key.includes('/distil-') ? '' : '.en'}`, size: val }));
  }

  applySettings(): void {
    this.cancel();
  }

  toggleIsMultilingual(): void {
    this.transcriberConfigStorage.isMultilingual = !this.transcriberConfigStorage.isMultilingual;
    this.filterModels();
  }

  setModel(model: string): void {
    this.transcriberConfigStorage.model = model;
  }

  setLanguage(language: string): void {
    this.transcriberConfigStorage.language = language;
  }

  cancel(): void {
    this.bsModalRef.hide();
  }
}
