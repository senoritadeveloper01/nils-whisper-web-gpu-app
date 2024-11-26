export interface AppConfig {
  production: boolean;
  language: {
    fallback: string;
    preferred: string;
  };
}
