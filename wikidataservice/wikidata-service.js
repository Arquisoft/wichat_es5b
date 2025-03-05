const axios = require('axios');

const query = `
SELECT DISTINCT ?item ?itemLabel (SAMPLE(?pic) AS ?pic) (SAMPLE(?publication_date) AS ?publication_date) WHERE {
  ?item wdt:P31 wd:Q11424;
  wdt:P577 ?publication_date;
  wdt:P18 ?pic.
  
   FILTER (?publication_date >= "2000-00-00T00:00:00Z"^^xsd:dateTime)

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
GROUP BY ?item ?itemLabel
`

async function executeSparqlQuery() {
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
      console.debug(response.data);
      return response.data;
    } catch (error) {
      console.error('Se ha producido un error al ejecutar la query de SPARQL:', error.message);
      throw error;
    }
}

module.exports = { executeSparqlQuery };