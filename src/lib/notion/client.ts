import { Client } from "@notionhq/client";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const notion = new Client({
  auth: requireEnv("NOTION_API_KEY"),
});

export const NOTION_DATABASE_ID = requireEnv("NOTION_DATABASE_ID");
