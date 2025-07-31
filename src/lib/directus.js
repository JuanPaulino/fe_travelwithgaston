/// <reference types="vite/client" />
import { createDirectus, readItems, rest } from "@directus/sdk";

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || 'http://localhost:8055';

const client = createDirectus(DIRECTUS_URL).with(rest());

export async function getPageData(slug) {
  try {
    const pages = await client.request(
      readItems("pages", {
        fields: [
          "*",
          "blocks.*",
          "blocks.item.*",
          "blocks.item.items.*",
          "blocks.item.items.image.*",
          // Evitar la relación circular: NO incluir "blocks.item.items.block_inspiration"
        ],
        filter: {
          permalink: {
            _eq: slug,
          },
        },
        limit: 1, // Fetch only one page
      })
    );

    if (pages.length === 0) {
      throw new Error(`Page with slug "${slug}" not found.`);
    }

    return {
      data: pages[0], // Return the first (and only) page
      error: null,
    };
  } catch (error) {
    console.error(`Failed to fetch page with slug "${slug}":`, error);
    return {
      data: null,
      error: `Failed to fetch page with slug "${slug}". Please try again later.`,
    };
  }
}

export default client;
