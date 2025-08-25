declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: number;
    DATABASE_NAME: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    GRAVATAR_API_KEY: string;
  }
}