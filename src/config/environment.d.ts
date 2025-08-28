declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    GRAVATAR_API_KEY: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
  }
}