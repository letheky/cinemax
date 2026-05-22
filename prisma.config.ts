import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL dùng cho migrate (bypass connection pooler)
    url: process.env.DIRECT_URL!,
  },
});
