import { AppConfig } from './app.config.model';

export const environment: Partial<AppConfig> = {
  production: true,
  language: {
    preferred: 'en',
    fallback: 'en',
  },
} as AppConfig;
