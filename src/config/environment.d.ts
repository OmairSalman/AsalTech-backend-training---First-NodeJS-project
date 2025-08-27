declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: number;
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    GRAVATAR_API_KEY: string;
  }
}