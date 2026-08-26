process.loadEnvFile(".env");
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  DATABASE_URL: z.string().trim().min(1),
  DATABASE_USER: z.string().trim().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().trim().min(1),
  DATABASE_HOST: z.string().trim().min(1),
  DATABASE_PORT: z.string().trim().min(1),
  ENABLE_REACT_ROUTER_DEVTOOLS: z.enum(["true", "false"]),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export function initEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      "Invalid environment variables:",
      z.prettifyError(parsed.error),
    );

    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}
