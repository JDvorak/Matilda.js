/* Matilda.js
 * Gibbs Sampling for Latent Dirichlet Allocation
 */

 // var model = new Model({model: "LDA", engine: "Gibbs"})
 //
 // model.readDirectory("../Training") <-- Thing to be Done To
 //      .iterate(10, callback)  <-- Run Model (This is done to it)
 //      .swapEngine("VB")
 //      .iterate({perplexity: 0.4}, callback) <-- Run Model, give object for case
 //      .readDirectory("../Test")
 //        .sortBy.Topic(callback)
 //        .listWordsBy.Topic(callback)


function Model(params) {

  var topics            = [],
      numberOfTopics    = 0,   
      topicWeights      = {},    
      documents         = [], 
      numberOfDocuments = 0, 
      wordCount         = 0,
      numberOfWords     = 0,
      beta              = 0,
      alpha             = 0,    
      words             = {};

  this.toString = function() {
    console.log(topics, topicWeights, documents, words);
  };

  this.train = function(callback) {
    documents.forEach(function(currentDoc, i) {
      for (var w = 0; w < currentDoc.wordCount; w++) {
        var curWord = currentDoc.bagOfWords[w];
        _shelf(curWord, currentDoc, 'pull')

        var sum = 0;
        for (var t = 0; t < numberOfTopics; t++) {
          topicWeights[t]  = (beta + currentDoc.topicsCounts[t])  // ALL DOCUMENTS
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
                          total: 0
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



  this.wordsByTopics = function(){

  };

  this.iterate = function(n){
    for (var i = 0; i < n; i++) {
      this.train();
    };
  }

  this.topicCorrelations = function(){
    var correlationMatrix = _emptyMatrix(numberOfTopics),
        meanLogLikelihood = [],
        logLikelihoodOfDoc = [],
        normalizer = 1.0 / (numberOfDocuments - 1),
        standardDeviations = [];

        debugger;
    for (var t = 0; t < numberOfTopics; t++) {
      meanLogLikelihood[t] = 0.0;
    }

    documents.forEach(function(currentDoc, i) {
      var bagOfWordsLength = currentDoc.bagOfWords.length

      logLikelihoodOfDoc[i] = [];
      for (var t = 0; t < numberOfTopics; t++) {
        logLikelihoodOfDoc[i][t] = Math.log((currentDoc.topicsCounts[t] + beta) /
                                          (bagOfWordsLength + numberOfTopics * beta))
        meanLogLikelihood[t] += logLikelihoodOfDoc[i][t];
      }
    });

    for (var t = 0; t < numberOfTopics; t++) {
      meanLogLikelihood[t] /= numberOfDocuments;
    }

    for (var d = 0; d < numberOfDocuments; d++) {      
      _matrixEach(correlationMatrix, function(t1, t2){
        correlationMatrix[t1][t2] +=  (logLikelihoodOfDoc[d][t1] - meanLogLikelihood[t1]) *
                                      (logLikelihoodOfDoc[d][t2] - meanLogLikelihood[t2])
      }, this);
    }

    _matrixEach(correlationMatrix, function(t1, t2) {
      correlationMatrix[t1][t2] *= normalizer
    }, this);

    //Set standardDeviations
    for (var t = 0; t < numberOfTopics; t++) {
      standardDeviations[t] = Math.sqrt(correlationMatrix[t][t]);
    }

    _matrixEach(correlationMatrix, function(t1, t2){
      correlationMatrix[t1][t2] /= (standardDeviations[t1] * standardDeviations[t2]);
    }, this);

    return correlationMatrix;
  };


  //Helpers

  var _emptyMatrix = function(height, width) {
    var height = height,
        width = width || height, //Make as Square
        newMatrix = []; 

    for (var t1 = 0; t1 < height; t1++) {
      newMatrix[t1] = [];
      for (var t2 = 0; t2 < width; t2++) {
        newMatrix[t1][t2] = 0.0;
      }
    }

    return newMatrix;
  }


  var _matrixEach = function(matrix, callback, context) {
    var len = matrix.length-1;
    for (var t1 = 0; t1 < len; t1++) {
      for (var t2 = 0; t2 < len; t2++) {
        callback.call(context, t1, t2, matrix)
      }  
    }
  }

  var _shelf = function(curWord, currentDoc, direction) {
    var move = 0;
    if (direction === 'put') {
      move = 1;
    } else if (direction === 'pull') {
      move = -1;
    }

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
    if (params.numberOfTopics) numberOfTopics = params.numberOfTopics;
    if (params.documents) documents = params.documents;
    if (params.words) words = params.words;
    if (params.alpha) alpha = params.alpha;
    if (params.beta) beta = params.beta;
    if (params.model) setModel(model);
  }; 

  _readParams(params);
  _initializeTopics();
};
