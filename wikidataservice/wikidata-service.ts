import axios from 'axios';
const express = require('express');

const app = express();
const port = 8004;

const query = `
SELECT DISTINCT ?itemLabel (SAMPLE(?pic) AS ?pic) WHERE {
  ?item wdt:P31 wd:Q11424;
  wdt:P577 ?publication_date;
  wdt:P18 ?pic.
  
   FILTER (?publication_date >= "2000-00-00T00:00:00Z"^^xsd:dateTime)

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
GROUP BY ?item ?itemLabel
`

export async function executeSparqlQuery() {
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

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Wikidata Service listening at http://localhost:${port}`);
});

module.exports = server
