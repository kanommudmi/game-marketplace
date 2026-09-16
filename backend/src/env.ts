if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in production");
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "dev-only-secret-change-me",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  isProd: (process.env.NODE_ENV ?? "development") === "production",
};
