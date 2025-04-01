const movieQuery = `
    SELECT DISTINCT ?itemLabel (SAMPLE(?pic) AS ?pic) WHERE {
    ?item wdt:P31 wd:Q11424;
    wdt:P577 ?publication_date;
    wdt:P18 ?pic.

    FILTER (?publication_date >= "2000-00-00T00:00:00Z"^^xsd:dateTime)

    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }

    GROUP BY ?item ?itemLabel
`;

const actorQuery = `
    SELECT DISTINCT ?characterLabel ?performerLabel ?filmTitle (SAMPLE(?pic) AS ?pic) WHERE {
    ?character wdt:P31 wd:Q15773347;
    wdt:P175 ?performer;
    wdt:P1441 ?work;
    wdt:P18 ?pic.

    ?work wdt:P31 wd:Q11424;
    wdt:P1476 ?filmTitle;

    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }

    GROUP BY ?characterLabel ?performerLabel ?filmTitle
`;

module.exports = { movieQuery, actorQuery };
