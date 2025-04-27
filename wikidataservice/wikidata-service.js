const axios = require('axios');
const express = require('express');
const app = express();
const port = 8004;

app.use(express.json());

const sparqlClient = axios.create({
  baseURL: 'https://query.wikidata.org/sparql',
  headers: {
    'User-Agent': 'Your User Agent',
    'Accept': 'application/json',
  },
  maxContentLength: 5 * 1024 * 1024,
});

const queryCache = new Map();

async function executeSparqlQuery(query) {
  if (queryCache.has(query)) {
    console.log('Consulta en caché');
    return queryCache.get(query);
  }

  try {
    const response = await sparqlClient.get('', {
      params: {
        query: query,
        format: 'json',
      },
    });

    queryCache.set(query, response.data);

    return response.data;
  } catch (error) {
    console.error('Error al ejecutar la query SPARQL:', error.message);
    throw error;
  }
}

app.post("/query", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query format' });
  }

  console.log("Query recibido:", query);

  try {
    const data = await executeSparqlQuery(query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'SPARQL query failed', details: error.message });
  }
});

// Start server
const server = app.listen(port, () => {
  console.log(`Wikidata Service listening at http://localhost:${port}`);
});

module.exports = { server, executeSparqlQuery };
