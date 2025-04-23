const axios = require('axios');
const express = require('express');

const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(express.json());
// Load enviornment variables
require('dotenv').config();

// Define configurations for different LLM APIs
const llmConfigs = {

  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    transformResponse: (response) => response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No pude generar una respuesta"
  },

  /*
  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    transformRequest: (question) => ({
      contents: [{ parts: [{ text: question }] }]
    }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text
  }, */

  /*
  gemini: {
    url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    transformRequest: (question, imageUrl) => ({
      contents: [{
        parts: [
          { text: question },
          ...(imageUrl ? [{
            file_data: {
              mime_type: "image/jpeg",
              file_uri: imageUrl
            }
          }] : [])
        ]
      }]
    }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text || "No pude generar una respuesta"
  }, */

  empathy: {
    url: () => 'https://empathyai.prod.empathy.co/v1/chat/completions',
    transformRequest: (question) => ({
      model: "mistralai/Mistral-7B-Instruct-v0.3", //con Qwen: qwen/Qwen2.5-Coder-7B-Instruct
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question }
      ]
    }),
    transformResponse: (response) => response.data.choices[0]?.message?.content,
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  },

  empathyQwen: {
    url: () => 'https://empathyai.prod.empathy.co/v1/chat/completions',
    transformRequest: (question) => ({
      model: "qwen/Qwen2.5-Coder-7B-Instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question }
      ]
    }),
    transformResponse: (response) => response.data.choices[0]?.message?.content,
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    })
  }

};

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

// Generic function to send questions to LLM
async function sendQuestionToLLM(question, apiKey, model = 'gemini') {
  try {
    const config = llmConfigs[model];
    if (!config) {
      throw new Error(`Model "${model}" is not supported.`);
    }

    const url = config.url(apiKey);
    const requestData = config.transformRequest(question);

    const headers = {
      'Content-Type': 'application/json',
      ...(config.headers ? config.headers(apiKey) : {})
    };

    const response = await axios.post(url, requestData, { headers });

    return config.transformResponse(response);

  } catch (error) {
    console.error(`Error sending question to ${model}:`, error.message || error);
    return null;
  }
}

app.post('/ask', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['question', 'model']);

    const { question, model } = req.body;
    //load the api key from an environment variable
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is missing.' });
    }
    const answer = await sendQuestionToLLM(question, apiKey, model);
    res.json({ answer });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
app.post('/askWithImage', async (req, res) => {
  let imageUrl; // Declaramos aquí para usarla en el catch
  
  try {
    console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING');
    validateRequiredFields(req, ['question', 'imageUrl']);
    
    // Procesamiento de la URL
    let { question, imageUrl: originalUrl } = req.body;
    imageUrl = originalUrl;
    
    // Transformar y codificar URL correctamente
    if (imageUrl.includes('wiki/Special:FilePath/')) {
      const filename = encodeURIComponent(
        imageUrl.split('wiki/Special:FilePath/')[1]
      );
      imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${filename}`;
    } else {
      // Codificar caracteres especiales para URLs no-Wikimedia
      imageUrl = encodeURI(imageUrl);
    }

    console.log('Processed Image URL:', imageUrl);

    // Validación de API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key is missing.' });
    }

    // Configuración de Gemini
    const config = llmConfigs.gemini;
    const url = config.url(apiKey);
    const requestData = {
      contents: [{
        parts: [
          { text: question },
          {
            file_data: {
              mime_type: "image/jpeg",
              file_uri: imageUrl
            }
          }
        ]
      }]
    };

    console.log('Request to Gemini:', {
      question: question.substring(0, 50),
      imageUrl: imageUrl.substring(0, 50)
    });

    // Envío a Gemini
    const response = await axios.post(url, requestData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    // Procesar respuesta
    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                 || "No pude generar una respuesta";
    
    res.json({ answer });

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      url: imageUrl,
      apiError: error.response?.data?.error
    });

    res.status(500).json({ 
      error: 'Error processing image',
      details: error.response?.data?.error?.message || error.message,
      processedUrl: imageUrl
    });
  }
}); */

app.post('/askWithImage', async (req, res) => {
  let originalImageUrl = req.body.imageUrl; // Guardar la URL original para logging
  let processedUrl; // URL que intentaremos descargar

  try {
    console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING');
    validateRequiredFields(req, ['question', 'imageUrl']);

    const { question } = req.body;
    originalImageUrl = req.body.imageUrl; // Aseguramos que esté asignada

    // 1. Procesamiento y Corrección de URL
    if (originalImageUrl.includes('wiki/Special:FilePath/')) {
      // Decodifica COMPLETAMENTE la parte del nombre del archivo primero
      let filenamePart = originalImageUrl.split('wiki/Special:FilePath/')[1];
      try {
          filenamePart = decodeURIComponent(filenamePart);
      } catch (e) {
          console.warn("Could not fully decode filename part, proceeding anyway:", filenamePart);
      }
      // Vuelve a codificar SÓLO los componentes necesarios para una URL válida
      const filename = encodeURIComponent(filenamePart).replace(/%2F/g, "/"); // Codifica todo, pero restaura slashes si los hubiera en el nombre
      processedUrl = `https://upload.wikimedia.org/wikipedia/commons/${filename}`;

    } else {
        // Para otras URLs, una codificación estándar suele ser suficiente
        // Evita doble codificación tratando de decodificar primero
        try {
            processedUrl = encodeURI(decodeURI(originalImageUrl));
        } catch(e) {
            console.warn("Could not decode/re-encode non-wikimedia URL, using original:", originalImageUrl);
            processedUrl = originalImageUrl; // Usar original si falla la decodificación/recodificación
        }
    }

    console.log('Processed URL for download:', processedUrl); // Cambiado el mensaje de log

    // Validación de API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Es mejor devolver aquí que seguir y fallar más tarde
      return res.status(400).json({ error: 'Gemini API key is missing.' });
    }

    // 2. Descargar la imagen
    let imageBase64, mimeType;
    try {
      const imageResponse = await axios.get(processedUrl, {
        responseType: 'arraybuffer', // ¡Importante para obtener datos binarios!
        timeout: 20000 // Timeout para la descarga de la imagen (ej: 20 segundos)
      });

      if (imageResponse.status !== 200) {
          throw new Error(`Failed to download image. Status: ${imageResponse.status}`);
      }

      // 3. Codificar en Base64 y obtener MIME type
      imageBase64 = Buffer.from(imageResponse.data, 'binary').toString('base64');
      mimeType = imageResponse.headers['content-type'];

      // Validar MIME type (básico)
      if (!mimeType || !mimeType.startsWith('image/')) {
          console.warn(`Invalid or missing Content-Type '${mimeType}' from URL. Attempting to guess or default.`);
          // Intenta adivinar por extensión (simple) o usa un default
          const extension = processedUrl.split('.').pop().toLowerCase();
          if (['jpg', 'jpeg'].includes(extension)) mimeType = 'image/jpeg';
          else if (extension === 'png') mimeType = 'image/png';
          else if (extension === 'webp') mimeType = 'image/webp';
          else if (extension === 'gif') mimeType = 'image/gif';
          else mimeType = 'image/jpeg'; // Último recurso
          console.log(`Using inferred/default MIME type: ${mimeType}`);
      }

      console.log(`Image downloaded successfully. Size: ~${Math.round(imageBase64.length * 3 / 4 / 1024)} KB. MIME Type: ${mimeType}`);

    } catch (downloadError) {
        console.error('Error downloading image:', {
            message: downloadError.message,
            url: processedUrl,
            status: downloadError.response?.status,
            axiosCode: downloadError.code // Código de error de Axios (e.g., ETIMEDOUT)
        });
        // Devuelve un error específico para la descarga
        return res.status(500).json({
            error: 'Failed to download image for processing',
            details: downloadError.message,
            url: processedUrl
        });
    }

    // Configuración de Gemini
    const config = llmConfigs.gemini;
    const geminiApiUrl = config.url(apiKey);

    // 4. Crear el payload para Gemini con inline_data
    const requestData = {
      contents: [{
        parts: [
          { text: question },
          {
            inline_data: { // <--- Cambio Clave: usar inline_data
              mime_type: mimeType,     // Usar el MIME type detectado
              data: imageBase64        // Usar los datos en Base64
            }
          }
        ]
      }]
    };

    console.log('Sending request to Gemini:', {
      question: question.substring(0, 80) + '...', // Loguea solo una parte
      image_mime_type: mimeType,
      // No loguear imageBase64 completo por su tamaño
      image_data_length: imageBase64.length
    });

    // 5. Envío a Gemini
    const response = await axios.post(geminiApiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // Timeout para la llamada a la API de Gemini (ej: 30 segundos)
    });

    // 6. Procesar respuesta
    const answer = config.transformResponse(response);
    res.json({ answer });

  } catch (error) {
     // Manejo de Errores Mejorado
     console.error('Error in /askWithImage endpoint:', {
       message: error.message,
       statusCode: error.statusCode, // Si lo definimos antes (e.g., validación)
       requestBody: { question: req.body.question, imageUrl: originalImageUrl }, // Loguea la entrada original
       processedUrl: processedUrl, // Loguea la URL que se intentó usar
       isAxiosError: error.isAxiosError,
       apiResponseStatus: error.response?.status,
       apiResponseData: error.response?.data, // Loguea el error específico de Gemini si existe
       // stack: error.stack // Descomentar para trace completo si es necesario
     });

     // Determinar el código de estado a devolver
     const status = error.response?.status || error.statusCode || 500;
     res.status(status).json({
       error: 'Error processing request with image',
       details: error.response?.data?.error?.message || error.message, // Mensaje de error de Gemini o el error general
       processedUrl: processedUrl // Informar qué URL se intentó procesar
     });
  }
});




//---------------------------------------------------------------------------------

app.post('/askWithImageViaPrompt', async (req, res) => { // Cambiado nombre para claridad
  let originalImageUrl = req.body.imageUrl;
  let processedUrl;

  try {
    console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING');
    validateRequiredFields(req, ['question', 'imageUrl']);

    const { question } = req.body;
    originalImageUrl = req.body.imageUrl;

    // 1. Procesamiento y Corrección de URL (igual que en la Opción 1)
    //    Necesitamos la URL bien formateada para ponerla en el prompt.
    if (originalImageUrl.includes('wiki/Special:FilePath/')) {
        let filenamePart = originalImageUrl.split('wiki/Special:FilePath/')[1];
        try { filenamePart = decodeURIComponent(filenamePart); } catch (e) { console.warn("Could not decode filename part:", filenamePart, e.message); }
        const filename = encodeURIComponent(filenamePart).replace(/%2F/g, "/");
        processedUrl = `https://upload.wikimedia.org/wikipedia/commons/${filename}`;
    } else {
        try { processedUrl = encodeURI(decodeURI(originalImageUrl)); } catch(e) { console.warn("Could not decode/re-encode non-wiki URL:", originalImageUrl, e.message); processedUrl = originalImageUrl; }
    }

    console.log('Processed URL to include in prompt:', processedUrl);

    // Validación de API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key is missing.' });
    }

    // --- NO HAY DESCARGA DE IMAGEN ---

    // Configuración de Gemini
    const config = llmConfigs.gemini;
    const geminiApiUrl = config.url(apiKey);

    // 2. Crear el prompt combinado incluyendo la URL
    //    Instruye explícitamente a Gemini para que use la URL.
    const combinedPrompt = `${question}\n\nPor favor, analiza la imagen que se encuentra en la siguiente URL para dar la pista: ${processedUrl}`;

    // 3. Crear el payload para Gemini (SOLO TEXTO)
    const requestData = {
      contents: [{
        parts: [
          { text: combinedPrompt } // Solo enviamos el texto combinado
        ]
      }]
    };

    console.log('Sending request to Gemini API (URL in prompt):', {
      prompt_start: combinedPrompt.substring(0, 100) + (combinedPrompt.length > 100 ? '...' : '')
    });

    // 4. Envío a Gemini
    const response = await axios.post(geminiApiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // Puede ser suficiente ya que no procesa datos de imagen complejos
    });

    // 5. Procesar respuesta de Gemini
    const answer = config.transformResponse(response);
    res.json({ answer });

  } catch (error) {
     // Manejo de Errores (similar, pero sin errores de descarga)
     console.error('Error in /askWithImageViaPrompt endpoint:', {
       message: error.message,
       statusCode: error.statusCode,
       isAxiosError: error.isAxiosError,
       apiResponseStatus: error.response?.status,
       apiResponseData: error.response?.data,
       requestBody: { question: req.body.question, imageUrl: originalImageUrl },
       processedUrl: processedUrl,
     });

     const status = error.response?.status || error.statusCode || 500;
     res.status(status).json({
       error: 'Error processing request with image URL in prompt',
       details: error.response?.data?.error?.message || error.message,
       processedUrl: processedUrl
     });
  }
});

const server = app.listen(port, () => {
  console.log(`LLM Service listening at http://localhost:${port}`);
});

module.exports = server


