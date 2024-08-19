// types/environment.d.ts

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_NAME: string;
      APP_URL: string;
      GMAIL_USER: string;
      GMAIL_APP_PASSWORD: string;
    }
  }
}

export {};
