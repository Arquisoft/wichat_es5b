const movieQuery = `
    SELECT DISTINCT ?itemLabel ?pic WHERE {
      ?item wdt:P31 wd:Q11424;
            wdt:P577 ?publication_date;
            wdt:P18 ?pic.
    
      FILTER (?publication_date >= "2000-01-01T00:00:00Z"^^xsd:dateTime)
    
      SERVICE wikibase:label { bd:serviceParam wikibase:language "{{LANG}}". }
    }
    LIMIT 1000
`;

const actorQuery = `
    SELECT DISTINCT ?characterLabel ?performerLabel ?filmTitle ?pic WHERE {
      ?character wdt:P31 wd:Q15773347;
                 wdt:P175 ?performer;
                 wdt:P1441 ?work;
                 wdt:P18 ?pic.
    
      ?work wdt:P31 wd:Q11424;
            wdt:P1476 ?filmTitle.
    
      SERVICE wikibase:label { bd:serviceParam wikibase:language "{{LANG}}". }
    }
    LIMIT 1000
`;

const characterQuery = `
    SELECT DISTINCT ?characterLabel ?seriesLabel ?pic WHERE {
      ?character wdt:P31 wd:Q15773317;
                 wdt:P1441 ?series;
                 wdt:P18 ?pic.
    
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "{{LANG}}".
      }
    }
    LIMIT 1000

`;

module.exports = { movieQuery, actorQuery, characterQuery };