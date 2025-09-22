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
          "blocks.item.images.*"          // Evitar la relación circular: NO incluir "blocks.item.items.block_inspiration"
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
    [
      {
        directus_files_id: {
          id: "94576c34-e0df-4611-ba90-69177014d77e",
          storage: "s3",
          filename_disk: "94576c34-e0df-4611-ba90-69177014d77e.webp",
          filename_download: "1Dp4pXYvnP7CM14hdliSZ0mi8RwBgbtBwOhmbpAU.webp",
          title: "1 Dp4p X Yvn P7 C M14hdli S Z0mi8 Rw Bgbt Bw Ohmbp Au",
          type: "image/webp",
          folder: "ece7bab9-5433-4a63-b9f7-bde8b517d6d9",
          uploaded_by: "10085d59-a7af-4ae5-82f1-4f04560df9d6",
          created_on: "2025-09-22T16:17:21.285Z",
          modified_by: null,
          modified_on: "2025-09-22T16:17:21.457Z",
          charset: null,
          filesize: "409276",
          width: 1920,
          height: 1279,
          duration: null,
          embed: null,
          description: null,
          location: null,
          tags: null,
          metadata: {
          },
          focal_point_x: null,
          focal_point_y: null,
          tus_id: null,
          tus_data: null,
          uploaded_on: "2025-09-22T16:17:21.454Z",
        },
      },
      {
        directus_files_id: {
          id: "ff3d3a16-0d11-4e87-b7bb-062aa76974eb",
          storage: "s3",
          filename_disk: "ff3d3a16-0d11-4e87-b7bb-062aa76974eb.webp",
          filename_download: "96Vuz1YzaCaksfrmkiAcLVoIwpAbsocjWlsRz2Pk (2).webp",
          title: "96 Vuz1 Yza Caksfrmki Ac L Vo Iwp Absocj Wls Rz2 Pk (2)",
          type: "image/webp",
          folder: "ece7bab9-5433-4a63-b9f7-bde8b517d6d9",
          uploaded_by: "10085d59-a7af-4ae5-82f1-4f04560df9d6",
          created_on: "2025-09-22T16:17:22.582Z",
          modified_by: null,
          modified_on: "2025-09-22T16:17:22.704Z",
          charset: null,
          filesize: "795414",
          width: 1920,
          height: 1279,
          duration: null,
          embed: null,
          description: null,
          location: null,
          tags: null,
          metadata: {
          },
          focal_point_x: null,
          focal_point_y: null,
          tus_id: null,
          tus_data: null,
          uploaded_on: "2025-09-22T16:17:22.702Z",
        },
      },
      {
        directus_files_id: {
          id: "04adec8f-4373-45d3-a6dd-5333adc43a1a",
          storage: "s3",
          filename_disk: "04adec8f-4373-45d3-a6dd-5333adc43a1a.webp",
          filename_download: "outRsObFuSZHq2FNZbBMjLeQdrE7CdpT7jl3zlSf (1).webp",
          title: "Out Rs Ob Fu Sz Hq2 Fn Zb B Mj Le Qdr E7 Cdp T7jl3zl Sf (1)",
          type: "image/webp",
          folder: "ece7bab9-5433-4a63-b9f7-bde8b517d6d9",
          uploaded_by: "10085d59-a7af-4ae5-82f1-4f04560df9d6",
          created_on: "2025-09-22T16:17:21.270Z",
          modified_by: null,
          modified_on: "2025-09-22T16:17:21.425Z",
          charset: null,
          filesize: "355556",
          width: 1920,
          height: 1440,
          duration: null,
          embed: null,
          description: null,
          location: null,
          tags: null,
          metadata: {
          },
          focal_point_x: null,
          focal_point_y: null,
          tus_id: null,
          tus_data: null,
          uploaded_on: "2025-09-22T16:17:21.424Z",
        },
      },
      {
        directus_files_id: {
          id: "70a8e42c-85b3-4f0d-8ab3-d9131089794e",
          storage: "s3",
          filename_disk: "70a8e42c-85b3-4f0d-8ab3-d9131089794e.webp",
          filename_download: "zOA942RQGJgxNkIXiGsO8IUErCRajYZk1iSpHgds.webp",
          title: "Z O A942 Rqg Jgx Nk I Xi Gs O8 Iu Er C Raj Y Zk1i Sp Hgds",
          type: "image/webp",
          folder: "ece7bab9-5433-4a63-b9f7-bde8b517d6d9",
          uploaded_by: "10085d59-a7af-4ae5-82f1-4f04560df9d6",
          created_on: "2025-09-22T16:17:21.275Z",
          modified_by: null,
          modified_on: "2025-09-22T16:17:21.447Z",
          charset: null,
          filesize: "346672",
          width: 1920,
          height: 1279,
          duration: null,
          embed: null,
          description: null,
          location: null,
          tags: null,
          metadata: {
          },
          focal_point_x: null,
          focal_point_y: null,
          tus_id: null,
          tus_data: null,
          uploaded_on: "2025-09-22T16:17:21.431Z",
        },
      },
    ]
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
          "items.*",
          "items.page.permalink"
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
