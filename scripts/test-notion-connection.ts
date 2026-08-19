import { Client } from "@notionhq/client";

async function main() {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    console.error("NOTION_API_KEY 또는 NOTION_DATABASE_ID가 설정되지 않았습니다. .env.local을 확인하세요.");
    process.exit(1);
  }

  const notion = new Client({ auth: apiKey });

  const database = await notion.databases.retrieve({ database_id: databaseId });
  const title = "title" in database ? database.title.map((t) => t.plain_text).join("") : "(제목 없음)";

  console.log(`✅ Notion 연결 성공: "${title}"`);
}

main().catch((error) => {
  console.error("❌ Notion 연결 실패:", error.message ?? error);
  process.exit(1);
});
