import type { StandardSchemaV1 } from "@standard-schema/spec";
import z from "zod";

export const envSchema = z.object({
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
export async function checkEnv<T extends StandardSchemaV1>(
  schema: T,
  env: Record<string, unknown>,
): Promise<StandardSchemaV1.InferOutput<T>> {
  const result = await schema["~standard"].validate(env);
  if (result.issues) {
    throw new EnvValidationError(result.issues);
  }
  return result.value;
}

export class EnvValidationError extends Error {
  constructor(public readonly issues: readonly StandardSchemaV1.Issue[]) {
    super("Invalid environment variables");
    this.name = "EnvValidationError";
  }
}
