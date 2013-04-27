

var express = require('express'),
	  	fs 		= require('fs'),
	  	natural = require('natural'),
	  	db 		= require('mongodb');
		  
var loadDirectory = function(path){
	var files = fs.readdirSync(path),
			masterVocab;

	for (var i = 0; len = files.length; i++) {
		fs.readFileSync(files[i], {encoding: 'String'}, function (err, data) {
		  if (err) throw err;
		  process(data, vocabSize);
		});
	}
}

var process = function(docs, n, percentage) {
	var processedDocs = {};
			 wordBag      = {},
				 vocab     = {},
				 words   = [],
				   cut  = 0,
				 	 len = 0,
					   n = 0;

	tfidf  = new natural.TfIdf;

	for (d in docs) {
		wordBags[n] = natural.PorterStemmer.tokenizeAndStem(d);
		tfidf.addDocument(wordBags[n]);

		len = tfidf.listTerms(n).length-1;
		cut = (1-percentage)/2;
		words = tfidf.listTerms(n).slice(cut, (len-cut));
		
		for (w in words) {
			if (!!vocab[words[w].term]) continue;
			vocab[words[w].term] = {word: words[w].term, count: 0};
		}

		n = 0;

		for (d in docs) {
			processDocs[n]
			
			n++;
		}

		n++;
	}

	

};


//// Don't for the, life of god, touch any of the following:

var initializeData = function(data, k) {

  var messages = {},
      docs = data.docs,
      vocab = data.words,
      topics = [];

  //make messages
  for (var t = 0; t < k; t++) {
    messages[t] = {};
    normal = 0;
    
    for (w in vocab) {
      if (w === "count" || w == null) continue;
      temp = 0;
      if ((t) % (w) === 0) {
        temp = 1;
      } 
      messages[t][w] = temp; 
      normal += temp;
    }
    for (w in vocab) {
      if (w === "count" || messages[t][w] === 0 || w == null) continue;
      messages[t][w] /= normal;
    }
  }
  for (var t = 0; t < k; t++) { 
    topics.push({likelihood: 0, words: {}, docs: {}})
    for (w in vocab) {
      if (w === "count" || w == null) continue;
      if (!topics[t].words[w]) topics[t].words[w] = {likelihood: 0}
      topics[t].words[w].likelihood += vocab[w].count * messages[t][w];
      topics[t].likelihood += vocab[w].count * messages[t][w];
    }
    for (d in docs) {
      var sum = 0;
      if (!topics[t].docs[d]) topics[t].docs[d] = {likelihood: 0}
      for (w in docs[d].words) {
        if (w === "count") continue;
        sum += docs[d].words[w].count * messages[t][w];
      }
      topics[t].docs[d].likelihood += sum;
    }
  }

  return {messages: messages, 
            topics: topics, 
             words: vocab, 
              docs: docs}
}

var bpsLDA = function(data, k, trials, alpha, beta, beenChewed) {
  var data      = beenChewed ? data : initializeData(data, k);

  var Messages  = data.messages, 
      Topics    = data.topics,
      Words     = data.words,
      Docs      = data.docs,
      perplexity, count,
      normal, dnormal;

 

  while (trials--) {

    shuffle(Docs)
    normal = 0;
    
    for (d in Docs) {
        for (t in Topics) {
          for (w in Topics[t].words) {
            Topics[t].words[w].likelihood -= Messages[t][w] * Docs[d].words[w].count;
            Topics[t].likelihood          -= Messages[t][w] * Docs[d].words[w].count;
            Topics[t].docs[d].likelihood  -= Messages[t][w] * Docs[d].words[w].count;       

            Messages[t][w] =  (Topics[t].words[w].likelihood + Docs[d].words[w].count + beta) /
                             (Topics[t].docs[d].likelihood + Docs[d].words[w].count + alpha) *
                             (Topics[t].likelihood + Docs[d].words[w].count + (Words.count * beta));

            normal += Messages[t][w];
  			}
  			for (t in Topics) {
          for (w in Topics[t].words) {

            Messages[t][w] /= normal;
            Topics[t].words[w].likelihood += Messages[t][w] * Docs[d].words[w].count;
            Topics[t].likelihood          += Messages[t][w] * Docs[d].words[w].count;
            Topics[t].docs[d].likelihood  += Messages[t][w] * Docs[d].words[w].count;
            
          }
        }
  		}
  	}
  }

  var normal = 0;
    for (t in Topics) {
     normal += Topics[t].likelihood;
    for (d in Topics[t].docs) {
      Topics[t].docs[d].likelihood /= Topics[t].likelihood ;         
    }  
    for (w in Topics[t].words) {
      Topics[t].words[w].likelihood /= Topics[t].likelihood
    }
  }
  for (t in Topics) {
    Topics[t].likelihood /= normal;
  }


  return {messages: Messages,
  				topics: Topics,
  			  words: Words,
  			  docs: Docs}
}

var shuffle = function (array, random) {
  var i = array.length, j, swap;
  while (--i) {
    j = (random ? random() : Math.random()) * (i + 1) | 0;
    swap = array[i];
    array[i] = array[j];
    array[j] = swap;
  }
  return array;
}