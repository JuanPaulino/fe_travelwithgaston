/// <reference types="vite/client" />
import { createDirectus, readItems, rest } from "@directus/sdk";

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || 'http://localhost:8055';

const client = createDirectus(DIRECTUS_URL).with(rest());

export async function getPageData(slug) {
  try {
    if (!slug.startsWith("/")) {
      slug = `/${slug}`;
    }
    const pages = await client.request(
      readItems("pages", {
        fields: [
          "*",
          "blocks.*",
          "blocks.item.*",
          "blocks.item.items.*",
          "blocks.item.items.image.*",
          "blocks.item.pricing_cards.*",
          // Evitar la relación circular: NO incluir "blocks.item.items.block_inspiration"
        ],
        filter: {
          _and: [
            {
              permalink: {
                _eq: slug,
              },
            },
            {
              status: {
                _eq: "published",
              },
            },
          ],
        },
        limit: 1, // Fetch only one page
      })
    );

    if (pages.length === 0) {
      throw new Error(`Page with slug "${slug}" not found or not published.`);
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

export async function getNavigationData() {
  try {
    const navigation = await client.request(
      readItems("navigation", {
        fields: [
          "id",
          "title", 
          "is_active",
          "items.*",
          "items.children.*"
        ],
        filter: {
          is_active: {
            _eq: true
          }
        }
      })
    );

    return {
      data: navigation,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch navigation data:', error);
    return {
      data: null,
      error: 'Failed to fetch navigation data. Please try again later.',
    };
  }
}

export default client;
