import { Component, OnInit } from '@angular/core';
import { TranslatorService } from '@service/translator/translator.service';
import { Language } from '@shared/model/language';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  standalone: true,
  imports: [TranslatePipe],
})
export class LanguageComponent implements OnInit {
  languages?: Language[];
  selectedLanguage?: Language;

  constructor(public translatorService: TranslatorService) {}

  ngOnInit(): void {
    this.getLanguages();
    this.setSelectedLanguage();
  }

  setSelectedLanguage(): void {
    const userLanguage = this.translatorService.getUsersSelectedLanguage() || 'en';
    this.selectedLanguage = this.translatorService.getLanguage(userLanguage);
  }

  getLanguages() {
    this.languages = this.translatorService.getDefaultLanguages();
  }

  setLanguage(value: string): void {
    this.translatorService.useLanguage(value);
    this.selectedLanguage = this.translatorService.getLanguage(value);
  }
}
