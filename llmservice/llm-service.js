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




app.post('/askWithImageViaPrompt', async (req, res) => { 
  
  let originalImageUrl = req.body.imageUrl;
  let processedUrl;

  try {
    console.log('Using Gemini API Key:', process.env.GEMINI_API_KEY ? '***' + process.env.GEMINI_API_KEY.slice(-4) : 'MISSING');
    validateRequiredFields(req, ['question', 'imageUrl']);

    const { question } = req.body;
    originalImageUrl = req.body.imageUrl;

    //Procesamiento y Correccion de URL
    if (originalImageUrl.includes('wiki/Special:FilePath/')) {
        let filenamePart = originalImageUrl.split('wiki/Special:FilePath/')[1];
        try { filenamePart = decodeURIComponent(filenamePart); } catch (e) { console.warn("Could not decode filename part:", filenamePart, e.message); }
        const filename = encodeURIComponent(filenamePart).replace(/%2F/g, "/");
        processedUrl = `https://upload.wikimedia.org/wikipedia/commons/${filename}`;
    } else {
        try { processedUrl = encodeURI(decodeURI(originalImageUrl)); } catch(e) { console.warn("Could not decode/re-encode non-wiki URL:", originalImageUrl, e.message); processedUrl = originalImageUrl; }
    }

    console.log('Processed URL to include in prompt:', processedUrl);

    //Validacion de API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key is missing.' });
    }

    //configuración de Gemini
    const config = llmConfigs.gemini;
    const geminiApiUrl = config.url(apiKey);

    //crear el prompt con la URL
    const combinedPrompt = `${question}\n\nPor favor, analiza la imagen que se encuentra en la siguiente URL para dar la pista: ${processedUrl}`;

    
    const requestData = {
      contents: [{
        parts: [
          { text: combinedPrompt }
        ]
      }]
    };

    console.log('Sending request to Gemini API (URL in prompt):', {
      prompt_start: combinedPrompt.substring(0, 100) + (combinedPrompt.length > 100 ? '...' : '')
    });

    //Envío a Gemini
    const response = await axios.post(geminiApiUrl, requestData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 
    });

    //respuesta de Gemini
    const answer = config.transformResponse(response);
    res.json({ answer });

  } catch (error) {
     
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


