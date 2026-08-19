import type { PageObjectResponse } from "@notionhq/client";

export function getTitle(page: PageObjectResponse, propertyName: string): string {
  const prop = page.properties[propertyName];
  if (!prop || prop.type !== "title") return "";
  return prop.title.map((t) => t.plain_text).join("");
}

export function getRichText(page: PageObjectResponse, propertyName: string): string {
  const prop = page.properties[propertyName];
  if (!prop || prop.type !== "rich_text") return "";
  return prop.rich_text.map((t) => t.plain_text).join("");
}

export function getSelect(page: PageObjectResponse, propertyName: string): string | null {
  const prop = page.properties[propertyName];
  if (!prop || prop.type !== "select") return null;
  return prop.select?.name ?? null;
}

export function getMultiSelect(page: PageObjectResponse, propertyName: string): string[] {
  const prop = page.properties[propertyName];
  if (!prop || prop.type !== "multi_select") return [];
  return prop.multi_select.map((t) => t.name);
}

export function getDate(page: PageObjectResponse, propertyName: string): string | null {
  const prop = page.properties[propertyName];
  if (!prop || prop.type !== "date") return null;
  return prop.date?.start ?? null;
}
