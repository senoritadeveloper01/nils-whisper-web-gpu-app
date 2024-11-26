import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '@shared/model/language';
import { LocalSettingsKey } from '@shared/types/local-settings';

@Injectable({
  providedIn: 'root',
})
export class TranslatorService {
  private defaultLanguages: Language[] = [
    { code: 'tr', text: 'SELECT_TR' },
    { code: 'en', text: 'SELECT_EN' },
  ];

  constructor(private translateService: TranslateService) {}

  getDefaultLanguages(): Language[] {
    return this.defaultLanguages;
  }

  getUsersSelectedLanguage(): string {
    return localStorage.getItem(LocalSettingsKey.TRANSLATE) || 'en';
  }

  setDefaultLanguage(): void {
    const selectedLanguage = this.getUsersSelectedLanguage();
    localStorage.setItem(LocalSettingsKey.TRANSLATE, selectedLanguage);
    this.translateService.setDefaultLang(selectedLanguage);
  }

  useLanguage(language: string): void {
    localStorage.setItem(LocalSettingsKey.TRANSLATE, language);
    this.translateService.use(language);
  }

  getLanguage(languageCode: string): Language | undefined {
    return this.defaultLanguages.find(language => languageCode === language.code);
  }
}
