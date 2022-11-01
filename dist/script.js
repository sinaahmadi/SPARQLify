
// https://www.wikidata.org/wiki/Help:Wikimedia_language_codes/lists/all
var languages_wiki = {
  "en": "Q1860",
  "fr": "Q150",
  "es": "Q1321",
  "pt": "Q5146",
  "de": "Q188",
  "it": "Q652"
};

var languages_dbnary = {
  "en": "en",
  "fr": "fr",
  "es": "es",
  "pt": "pt",
  "de": "de",
  "it": "it"
};

var posTags = {
  "Noun": "Q1084",
  "Adjective": "Q34698",
  "Adverb": "Q380057",
  "Verb": "Q24905"
};

// Queries for Wikidata
var values = "\n\tVALUES ?word {'book'@GLWSSA}";

var queryBasicWiki = "SELECT * WHERE {VALUESTOBEADDEDHERE\n\t?l a ontolex:LexicalEntry ;\n\t\tdct:language wd:LNGCDE ;\n\t\tontolex:lexicalForm ?form ;\n\t\twikibase:lexicalCategory wd:POSTAG ;\n\t\twikibase:lemma ?lemma .\n\t?form ontolex:representation ?word .\n}";

var querySensesWiki = "SELECT * WHERE {VALUESTOBEADDEDHERE\n\t?l a ontolex:LexicalEntry ;\n\t\tdct:language wd:LNGCDE ;\n\t\tontolex:lexicalForm ?form ;\n\t\twikibase:lexicalCategory wd:POSTAG ;\n\t\twikibase:lemma ?lemma ;\n\t\tontolex:sense ?sense .\n\t?form ontolex:representation ?word .\n}";

var queryDefWiki = "SELECT * WHERE {VALUESTOBEADDEDHERE\n\t?l a ontolex:LexicalEntry ;\n\t\tdct:language wd:LNGCDE ;\n\t\twikibase:lemma ?lemma ;\n\t\tontolex:lexicalForm ?form ;\n\t\twikibase:lexicalCategory ?category ;\n\t\tontolex:sense ?sense .\n\t?form ontolex:representation ?word .\n\t?language wdt:P218 \"GLWSSA\" .\n\t?sense skos:definition ?gloss .\n\tFILTER EXISTS {?l ontolex:sense ?sense }\n\tFILTER(LANG(?gloss) = \"GLWSSA\")\n}";

var queryExamplesWiki = "SELECT * WHERE {VALUESTOBEADDEDHERE\n\t?l a ontolex:LexicalEntry ;\n\t\tdct:language wd:LNGCDE ;\n\t\twikibase:lemma ?lemma ;\n\t\tontolex:lexicalForm ?form ;\n\t\twikibase:lexicalCategory ?category ;\n\t\tontolex:sense ?sense .\n\t\t?language wdt:P218 \"GLWSSA\" .\n\t?form ontolex:representation ?word .\n\t?sense skos:definition ?gloss .\n\tOPTIONAL{\n\t\t?l p:P5831 ?statement .\n\t\t?statement ps:P5831 ?example .\n\t}\n\tFILTER EXISTS {?l ontolex:sense ?sense }\n\tFILTER(LANG(?gloss) = \"GLWSSA\")\n}";

var queryTranslationWiki = "SELECT DISTINCT * WHERE {\n\t?sourec dct:language wd:LNGCDE;\n\t\twikibase:lemma ?sourceLemma;\n\t\tontolex:sense [ wdt:P5137 ?sense ].\n\t?target dct:language wd:LNGCDETRG;\n\t\twikibase:lemma ?targetLemma;\n\t\tontolex:sense [ wdt:P5137 ?sense ].\n}\nORDER BY ASC(UCASE(str(?sourceLemma)))\nLIMIT 100 ";

var queryTranslationWikiLemma = "SELECT DISTINCT * WHERE {VALUESTOBEADDEDHERE\n\t?source dct:language wd:LNGCDE;\n\t\twikibase:lemma ?sourceLemma;\n\t\tontolex:lexicalForm ?form ;\n\t\twikibase:lexicalCategory wd:POSTAG ;\n\t\tontolex:sense [ wdt:P5137 ?sense ].\n\t?target dct:language wd:LNGCDETRG;\n\t\twikibase:lemma ?targetLemma;\n\t\tontolex:sense [ wdt:P5137 ?sense ].\n\t?form ontolex:representation ?word .\n}\nORDER BY ASC(UCASE(str(?sourceLemma))) ";

// Queries for Dbnary
  var valuesDbnary = "\n\tVALUES ?label {'book'@GLWSSA}\n\tVALUES ?pos {<http://www.lexinfo.net/ontology/2.0/lexinfo#POSTAGNM>}"; 

  var queryBasicWikiDbnary = `SELECT * WHERE {VALUESTOBEADDEDHERE
     ?lexeme a ontolex:LexicalEntry ;
       rdfs:label ?label ;
       ontolex:canonicalForm ?form ;
       lime:language ?lang ;
       lexinfo:partOfSpeech   ?pos .

  FILTER(?lang = "GLWSSA")
  }
  `
  var querySensesWikiDbnary = `SELECT * WHERE {VALUESTOBEADDEDHERE
     ?lexeme a ontolex:LexicalEntry ;
       rdfs:label ?label ;
       ontolex:canonicalForm ?form ;
       lime:language ?lang ;
       lexinfo:partOfSpeech   ?pos ;
       ontolex:sense  ?sense .

  FILTER(?lang = "GLWSSA")
  }`

  var queryDefWikiDbnary = `SELECT ?lexeme ?label ?pos ?sense ?definition
  WHERE {
     ?sense a ontolex:LexicalSense ;
       skos:definition ?def .
     ?def rdf:value ?definition .
     FILTER(lang(?definition) = "GLWSSA")
     {
        SELECT * WHERE {VALUESTOBEADDEDHERE
           ?lexeme a ontolex:LexicalEntry ;
           rdfs:label ?label ;
           ontolex:canonicalForm ?form ;
           lime:language ?lang ;
           lexinfo:partOfSpeech   ?pos ;
           ontolex:sense  ?sense .
        FILTER(?lang = "GLWSSA")
        } 
     }
  }`

  var queryExamplesWikiDbnary = `
  `

  var queryTranslationWikiDbnary = `
  `

  var queryTranslationWikiLemmaDbnary = `
  `

function generateQuery() {
  var lemma = document.getElementById("lemma").value;
  var posTag = document.getElementById("part_of_speech_tag").value;
  var sourceLanguage = document.getElementById("source_language").value;
  var translationLanguage = document.getElementById("translation_languages").value;
  var query = "";
  var formValid = false;

  if (document.getElementById('Wikidata').checked) {
    if (translationLanguage != "null") {
      if (lemma.length == 0) {
        query = queryTranslationWiki;
      } else {
        query = queryTranslationWikiLemma;
      }
    } else {
      switch (document.getElementById('information_categories').value) {
        case "1":
          query = queryBasicWiki;
          break;
        case "2":
          query = querySensesWiki;
          break;
        case "3":
          query = queryDefWiki;
          break;
        case "4":
          query = queryExamplesWiki;
          break;
        }
    }} else {
      switch (document.getElementById('information_categories').value) {
        case "1":
          query = queryBasicWikiDbnary;
          break;
        case "2":
          query = querySensesWikiDbnary;
          break;
        case "3":
          query = queryDefWikiDbnary;
          break;
      }
    }

  if (lemma.length != 0) {
    if (document.getElementById('Wikidata').checked) {
      query = query.replace("VALUESTOBEADDEDHERE", values.replace("book", lemma));
    } else {
      query = query.replace("VALUESTOBEADDEDHERE", valuesDbnary.replace("book", lemma));
    }
  } else {
    query = query.replace("VALUESTOBEADDEDHERE", "");
  }
  query = query.replace("WORD", lemma);
  query = query.replace("LNGCDE", languages_wiki[sourceLanguage]);
  query = query.replaceAll("LNGCDETRG", languages_wiki[translationLanguage]);
  query = query.replaceAll("GLWSSA", sourceLanguage);
  query = query.replace("POSTAGNM", posTag.toLowerCase());
  query = query.replace("POSTAG", posTags[posTag]);
  // query = query.replace(";;", ";").concat("\n}").replace(";\n}", ".\n}");

  if (document.getElementById('limit_100').checked) {
    query = query.concat("\nLIMIT 100");
  }

  document.getElementById("generated_sparql_query").innerHTML = query;

}

function runQuery() {
  if (document.getElementById("generated_sparql_query").value != '') {
    if (document.getElementById('Wikidata').checked) {
    window.open("https://query.wikidata.org/#".concat(encodeURIComponent(document.getElementById("generated_sparql_query").value)), '_blank'); 
  } else {
    window.open("http://kaiko.getalp.org/sparql?default-graph-uri=&query=".concat(encodeURIComponent(document.getElementById("generated_sparql_query").value)), '_blank'); 
  }
  }
}

