export interface Env {
  PORT: number;
  CLIENT_URL: string;

  JWT_SECRET: string;

  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
}
