/* Studious.js
 * Belief Propagation and Gibbs Sampling for Latent Dirichlet Allocation
 * Trains a Gibbs.
 * Model can be set to Relational Topic Model, Author Topic Model, and Topic Model
 */

// It should be provided an object which it 'trains on' think jquery objects

function Model(params) {

  var initialized       = false,
      perplexity        = 0,
      topics            = [],
      numberOfTopics    = 0,   
      topicWeights      = {},    
      numberOfDocuments = 0, 
      documents         = [], 
      wordCount         = 0,
      numberOfWords     = 0,
      beta              = 0,
      alpha             = 0,    
      words             = {};

  this.toString = function() {
    console.log( 
      "topics: ", topics, numberOfTopics, "weights: ", topicWeights, 
      "count: ", numberOfDocuments, documents, "words: ", numberOfWords, wordCount, words);
  }

  this.addDocument = function(doc, callback){
    if (doc instanceof Array) {
      var token,
          newDoc = {
                    bagOfWords: [], 
                    wordCount: 0,
                    topicsCounts: []
                   };
      for (t in topics) {
        newDoc.topicsCounts[t] = 0;
      };

      for (w in doc) {
        token = doc[w];

        if (!words[token]) {
          words[token] = {
                          _id: token,
                          isTopic: 0, 
                          total: 0,
                          withWord: {}
                         };

          for (t in topics) {
            topics[t].withWord[token] = 0;
          }

          numberOfWords++;
        };

        _assignRandomly(words[token]);
        if (!newDoc.topicsCounts[words[token].isTopic]) newDoc.topicsCounts[words[token].isTopic] = 0;
        newDoc.topicsCounts[words[token].isTopic]++;
        newDoc.wordCount++;
        words[token].total++;
        wordCount++;
        newDoc.bagOfWords.push(words[token]);
      }

      documents.push(newDoc);
      numberOfDocuments++;


    } else {
      throw new Error("String Tokenization Not Yet Implemented. Pre-process Your Data and Try Again.");
    };

    return this;
  }
  //Models

  this.train = function(callback) {
    debugger

    documents.forEach(function(currentDoc, i) {
      for (var w = 0; w < currentDoc.wordCount; w++) {
        var curWord = currentDoc.bagOfWords[w];
        _shelf(curWord, currentDoc, 'pull')

        var sum = 0;
        for (var t = 0; t < numberOfTopics; t++) {
          topicWeights[t]  = (beta + currentDoc.topicsCounts[t])  // some of these are bad names
          topicWeights[t] *= (alpha + topics[t].withWord[curWord._id]) 
          topicWeights[t] /= (numberOfWords * beta + topics[t].wordTotal);               
          sum += topicWeights[t]
        }

        curWord.isTopic = _weightedRandom(topicWeights, sum)
        _shelf(curWord, currentDoc, 'put')
      }
    });

    return this;
  };


   //Helpers
   var _shelf = function(curWord, currentDoc, direction) {
     var move = 0;
     if (direction === 'put') {
       move = 1;
     } else if (direction === 'pull') {
       move = -1;
     }

    // topics[curWord.isTopic].docTotal += move;
    topics[curWord.isTopic].withWord[curWord._id] += move;
    currentDoc.topicsCounts[curWord.isTopic] += move;
    topics[curWord.isTopic].wordTotal += move;
   }

   var _initializeTopics = function(){
     for (var k = 0; k < numberOfTopics; k++) {
       topicWeights[k] = (1/numberOfTopics);
       topics[k] = {
                  _id:       k,
                  withWord:  {}, 
                  wordTotal: 0, 
                 };
     };
     for (w in words) {_assignRandomly(words[w])};
   };

  var _assignRandomly = function(word) {
    var random = Math.floor(Math.random() * numberOfTopics);
    word.isTopic = random;
    if (!topics[random].withWord[word._id]) topics[random].withWord[word._id] = 0;
    topics[random].withWord[word._id]++;
    topics[random].wordTotal++;
   }

  var _weightedRandom = function(weights, sum) {
    var sample = sum * Math.random(),
             i = 0;

    sample -= weights[i];

    while (sample > 0.0) {
      i++;
      sample -= weights[i];
    }

    return i;
  };

  var _readParams = function(params) {
    if (params.topicWeights) topicWeights = params.topicWeights;
    if (params.numberOfTopics)     numberOfTopics = params.numberOfTopics;
    if (params.documents)       documents = params.documents;
    if (params.words)               words = params.words;
    if (params.alpha)               alpha = params.alpha;
    if (params.beta)                 beta = params.beta;
  }; 



  _readParams(params);
  _initializeTopics();

};
