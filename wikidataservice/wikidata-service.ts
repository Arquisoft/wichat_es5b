import axios from 'axios';
const express = require('express');

const app = express();
const port = 8004;

app.use(express.json());

export async function executeSparqlQuery(query: string) {
    try {
      const response = await axios.get('https://query.wikidata.org/sparql', {
        headers: {
          'User-Agent': 'Your User Agent',
          'Accept': 'application/json',
        },
        params: {
          query: query,
          format: 'json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Se ha producido un error al ejecutar la query de SPARQL:', error);
      throw error;
    }
}

app.post("/query", async (req: any, res: any) => {
  const query = req.body.query; // Recoge el parámetro del cuerpo
  console.log("Query recibido:", query);
  res.status(200).json(await executeSparqlQuery(query));
})

// Start the wikidata service
const server = app.listen(port, () => {
  console.log(`Wikidata Service listening at http://localhost:${port}`);
});

module.exports = server
