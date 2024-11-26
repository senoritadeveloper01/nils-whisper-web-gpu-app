import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  standalone: true,
  imports: [TranslatePipe],
})
export class AudioPlayerComponent {
  audioUrl = input.required<string>();
}
