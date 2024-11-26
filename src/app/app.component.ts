import { Component, OnInit } from '@angular/core';
import { TranslatorService } from '@service/translator/translator.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'nils-whisper-web-gpu-app';

  constructor(private translateService: TranslatorService) {}

  ngOnInit() {
    this.translateService.setDefaultLanguage();
  }
}
