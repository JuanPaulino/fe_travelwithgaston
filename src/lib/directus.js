/// <reference types="vite/client" />
import { createDirectus, readItems, createItem, rest, staticToken } from "@directus/sdk";

const DIRECTUS_URL = import.meta.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN || 'bxgS89n_EZlT2TZ8XNEvLX-0Tt_pPmfi';

// Cliente para operaciones de solo lectura (sin autenticación)
const client = createDirectus(DIRECTUS_URL).with(rest());

// Cliente autenticado para operaciones de escritura
const authenticatedClient = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

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
          "blocks.item.form.*",
          "blocks.item.form.fields.*",
          // Evitar la relación circular: NO incluir "blocks.item.items.block_inspiration"
        ],
        filter: {
          permalink: {
            _eq: slug,
          },
          status: {
            _eq: "published",
          },
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
          "items.children.*",
          "items.page.permalink",
          "items.children.page.permalink"
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

export async function getFooterNavigation() {
  try {
    const navigation = await client.request(
      readItems("navigation", {
        fields: [
          "id",
          "title", 
          "is_active",
          "items.*"
        ],
        filter: {
          is_active: {
            _eq: true
          },
          id: {
            _starts_with: "footer"
          }
        }
      })
    );

    return {
      data: navigation,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch footer navigation data:', error);
    return {
      data: null,
      error: 'Failed to fetch footer navigation data. Please try again later.',
    };
  }
}

/**
 * Envía un formulario a Directus creando una submission y sus valores
 * @param {string} formId - ID del formulario
 * @param {Object} formData - Datos del formulario {fieldName: value}
 * @param {Array} fields - Array de campos del formulario con sus metadatos
 * @returns {Promise<Object>} - Resultado del envío
 */
export async function submitForm(formId, formData, fields) {
  try {
    console.log('DIRECTUS_URL', DIRECTUS_URL);
    console.log('Using authenticated client with token:', DIRECTUS_TOKEN);
    
    // 1. Crear la submission principal usando el cliente autenticado
    const submission = await authenticatedClient.request(
      createItem("form_submissions", {
        form: formId,
        timestamp: new Date().toISOString()
      })
    );

    // 2. Crear los valores de cada campo
    const submissionValues = [];
    
    for (const field of fields) {
      const value = formData[field.name];
      
      // Solo procesar campos que tienen valor
      if (value !== null && value !== undefined && value !== '') {
        // Manejar arrays (checkbox groups)
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            submissionValues.push({
              form_submission: submission.id,
              field: field.id,
              value: item.toString(),
              sort: index + 1
            });
          });
        } else {
          submissionValues.push({
            form_submission: submission.id,
            field: field.id,
            value: value.toString(),
            sort: field.sort || 1
          });
        }
      }
    }

    // 3. Crear todos los valores de submission usando el cliente autenticado
    if (submissionValues.length > 0) {
      await authenticatedClient.request(
        createItem("form_submission_values", submissionValues)
      );
    }

    return {
      success: true,
      submissionId: submission.id,
      message: "Formulario enviado correctamente"
    };

  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      error: error.message || "Error al enviar el formulario"
    };
  }
}

/**
 * Obtiene un formulario con sus campos
 * @param {string} formId - ID del formulario
 * @returns {Promise<Object>} - Formulario con campos
 */
export async function getForm(formId) {
  try {
    const forms = await client.request(
      readItems("forms", {
        fields: [
          "*",
          "fields.*"
        ],
        filter: {
          id: {
            _eq: formId
          },
          is_active: {
            _eq: true
          }
        },
        limit: 1
      })
    );

    if (forms.length === 0) {
      throw new Error("Formulario no encontrado o inactivo");
    }

    return {
      success: true,
      data: forms[0]
    };
  } catch (error) {
    console.error('Error fetching form:', error);
    return {
      success: false,
      error: error.message || "Error al obtener el formulario"
    };
  }
}

export default client;
