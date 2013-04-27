/* Studious.js
 * Belief Propagation and Gibbs Sampling for Latent Dirichlet Allocation
 * Trains a Gibbs.
 * Model can be set to Relational Topic Model, Author Topic Model, and Topic Model
 */

// It should be provided an object which it 'trains on' think jquery objects

function Model(params) {

  var initialized   = false,
      perplexity    = 0,
      topic         = [],
      topicCount    = 0,   
      topicWeights  = {},    
      documentCount = 0, 
      documents     = [], 
      wordCount     = 0,
      vocabSize     = 0,
      beta          = 0,
      alpha         = 0,    
      words         = {};

  this.toString = function() {
    console.log( 
      "topics: ", topic, topicCount, "weights: ", topicWeights, 
      "count: ", documentCount, documents, "words: ", vocabSize, wordCount, words);
  }

  this.forceInitialization = function(){
    _initializeTopics();
  }

  this.addDocument = function(doc, callback){
    _initializeTopics();
    if (doc instanceof Array) {
      var token,
          newDoc = {
                    bagOfWords: [], 
                    wordCount: 0,
                    topicsCounts: [] //clarify what counts means
                   };

      for (w in doc) {
        token = doc[w];

        if (!words[token]) {
          words[token] = {
                          _id: token,
                          isTopic: 0, 
                          total: 0,
                          withWord: {}
                          }
          vocabSize++;
          _assignRandomly(words[token]);

        };
        if (!newDoc.topicsCounts[words[token].isTopic]) newDoc.topicsCounts[words[token].isTopic] = 0;
        newDoc.topicsCounts[words[token].isTopic]++;
        newDoc.wordCount++;
        console.log(words[token])
        words[token].total++;
        wordCount++;
        newDoc.bagOfWords.push(words[token]);
      }

      documents.push(newDoc);
      documentCount++;


    } else {
      throw new Error("String Tokenization Not Yet Implemented. Pre-process your data and try again.");
    };

    return this;
  }
  //Models

  this.train = function(callback) {
     if (!initialized) _initializeTopics();
     var n = 1
     documents.forEach(function(currentDoc, i) {
       for (var w = 0; w < currentDoc.wordCount; w++) {
         var curWord = currentDoc.bagOfWords[w];
         _shelf(curWord, 'pull')

         var sum = 0;
         for (var t = 0; t < topicCount; t++) {
          if (topic[t].withWord[curWord._id]) {
           topicWeights[t]  = (beta + currentDoc.topicCounts[t])  // some of these are bad names
           topicWeights[t] *= (alpha + topic[t].withWord[curWord._id]) 
           topicWeights[t] /= (vocabSize * beta + topic[t].wordTotal);
          } else { // this is hacky
           topicWeights[t]  = (beta + currentDoc.topicCounts[t]) * alpha 
           topicWeights[t] /= (vocabSize * beta + topic[t].wordTotal);
          }                  
           sum += topicWeights[t]
         }

         curWord.isTopic = _weightedRandom(topicWeights, sum)
         _shelf(curWord, 'put')
       n++
       }
     });

     return this;
   };


   //Helpers
   var _shelf = function(curWord, direction) {
     var move = 0;
     if (direction === 'put') {
       move = 1;
     } else if (direction === 'pull') {
       move = -1;
     }

    topic[curWord.isTopic].withWord[curWord._id] += move;
    topic[curWord.isTopic].docTotal += move;
    topic[curWord.isTopic].wordTotal += move;
   }

   var _initializeTopics = function(){
     for (var k = 0; k < topicCount; k++) {
       topicWeights[k] = (1/k);
       topic[k] = {
                  _id:       k,
                  withWord:  {}, 
                  wordTotal: 0, 
                 };
     };
     for (w in words) {_assignRandomly(words[w])};
   };

  var _assignRandomly = function(word) {
    var random = Math.floor(Math.random() * topicCount);
    console.log(random)
    word.isTopic = random;
    if (!topic[random].withWord[word._id]) topic[random].withWord[word._id] = 0;
    topic[random].withWord[word._id]++;
    topic[random].wordTotal++;
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
    if (params.topicCount)     topicCount = params.topicCount;
    if (params.documents)       documents = params.documents;
    if (params.words)               words = params.words;
    if (params.alpha)               alpha = params.alpha;
    if (params.beta)                 beta = params.beta;
  }; 



  _readParams(params);
};
