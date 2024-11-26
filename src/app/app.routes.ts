import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'whisper-webgpu',
    loadComponent: () => import('@routes/components/audio-manager/audio-manager.component').then(m => m.AudioManagerComponent),
  },
  { path: '**', redirectTo: 'whisper-webgpu' },
];
