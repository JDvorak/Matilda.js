/* Matilda.js
 * Webscale Statistical Inference
 */

var Matilda = {};

Matilda.Model = (function () {


   // / Helpers / /    / 
  var emptyMatrix = function(height, width) {
    var height = height,
        width = width || height, 
        newMatrix = []; 

    for (var t1 = 0; t1 < height; t1++) {
      newMatrix[t1] = [];
      for (var t2 = 0; t2 < width; t2++) {
        newMatrix[t1][t2] = 0.0;
      }
    }
    return newMatrix;
  }

  var matrixEach = function(matrix, callback, context) {
    var len = matrix.length;
    for (var t1 = 0; t1 < len; t1++) {
      for (var t2 = 0; t2 < len; t2++) {
        callback.call(context, t1, t2, matrix)
      }  
    }
  }

  var weightedRandom = function(weights, sum) {
    var sample = sum * Math.random(),
             i = 0;

    sample -= weights[i];

    while (sample > 0.0) {
      i++;
      sample -= weights[i];
    }
    return i;
  };

  // / The Main Event / /    / 
  function Model(params) {
    var topics            = [], 
        numberOfTopics    = 5,   
        topicWeights      = [],    
        documents         = [], 
        numberOfDocuments = 0, 
        wordCount         = 0,
        numberOfWords     = 0,
        beta              = 0,
        alpha             = 0,    
        words             = {};

    var recalculateAlpha = function() {
      beta = numberOfTopics/50;
    }
    
    var recalculateBeta = function() {
      alpha = numberOfWords/200;
    }

    var initializeTopics = function(){
      topics = [];
      topicWeights = [];
      for (var k = 0; k < numberOfTopics; k++) {
        topicWeights[k] = (1/numberOfTopics);
        topics[k] = {
                    id:       k,
                    withWord: {}, 
                    wordTotal: 0, 
                    };
      };

      for (w in words) {assignRandomly(words[w])};
    };

    var assignRandomly = function(word) {
      var random = Math.floor(Math.random() * numberOfTopics);
      word.isTopic = random;
      if (!topics[random].withWord[word.id]) topics[random].withWord[word.id] = 0;
      topics[random].withWord[word.id]++;
      topics[random].wordTotal++;
    };

    var nowCallback = function(callback, context, whatElse) {
      if (!callback) return;
      var dataObject = {topics: topics, 
                        vocab: words,
                        documents: documents
                       };

      callback.call(context, dataObject, whatElse);
    };




    // / Methods / /    / 
    this.setNumberOfTopics = function(K) {
      numberOfTopics = K;
      recalculateAlpha();
      initializeTopics();
      return this;
    }; 

    this.addDocument = function(doc, callback, context){
      if (doc instanceof Array) {
        if (doc[0] instanceof Array) {
          for (var subDoc = 0, len = doc.length; subDoc < len; subDoc++) {
            this.addDocument(doc[subDoc]);
          }
        } else {
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
                              id: token,
                              isTopic: 0, 
                              total: 0
                             };

              for (t in topics) {
                topics[t].withWord[token] = 0;
              }

              numberOfWords++;
              recalculateBeta();
            };

            assignRandomly(words[token]);
            if (!newDoc.topicsCounts[words[token].isTopic]) newDoc.topicsCounts[words[token].isTopic] = 0;
            newDoc.topicsCounts[words[token].isTopic]++;
            newDoc.wordCount++;
            words[token].total++;
            wordCount++;
            newDoc.bagOfWords.push(words[token]);
          }

          documents.push(newDoc);
          numberOfDocuments++;

          nowCallback(callback, context, doc)
        }
      } else {
        throw new Error("Pre-process Your Data and Try Again.");
      };

      return this;
    }

    this.train = function(n, callback, context) {
      var sum, curWord;

      for (var iterations = 0; iterations < n; iterations++) {
        documents.forEach(function(currentDoc, i) {
          for (var w = 0; w < currentDoc.wordCount; w++) {
            curWord = currentDoc.bagOfWords[w];

            topics[curWord.isTopic].withWord[curWord.id]--;
            topics[curWord.isTopic].wordTotal--;
            
            sum = 0;
            
            for (var t = 0; t < numberOfTopics; t++) {
              topicWeights[t]  = (beta + currentDoc.topicsCounts[t])  
              topicWeights[t] *= (alpha + topics[t].withWord[curWord.id]) 
              topicWeights[t] /= (numberOfWords * beta + topics[t].wordTotal);               
              sum += topicWeights[t]
            }
            curWord.isTopic = weightedRandom(topicWeights, sum)

            topics[curWord.isTopic].withWord[curWord.id]++;
            topics[curWord.isTopic].wordTotal++;
          }

          for (var t = 0; t < numberOfTopics; t++) {
            topicWeights[t] /= sum;
            currentDoc.topicsCounts[t] = 0;
          };

          currentDoc.bagOfWords.forEach(function (token) {
            currentDoc.topicsCounts[token.isTopic] += 1;
          });
          
        });

        nowCallback(callback, context)
      };
      return this;
    };

    this.topicCorrelations = function(){
      var correlationMatrix = emptyMatrix(numberOfTopics),
          meanLogLikelihood = [],
          logLikelihoodOfDoc = [],
          normalizer = 1.0 / (numberOfDocuments - 1),
          standardDeviations = [];


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
        matrixEach(correlationMatrix, function(t1, t2){
          correlationMatrix[t1][t2] +=  (logLikelihoodOfDoc[d][t1] - meanLogLikelihood[t1]) *
                                        (logLikelihoodOfDoc[d][t2] - meanLogLikelihood[t2])
        }, this);
      }

      console.log(meanLogLikelihood, correlationMatrix)
      matrixEach(correlationMatrix, function(t1, t2) {
        correlationMatrix[t1][t2] *= normalizer
      }, this);

      for (var t = 0; t < numberOfTopics; t++) {
        standardDeviations[t] = Math.sqrt(correlationMatrix[t][t]);
      }

      matrixEach(correlationMatrix, function(t1, t2){
        correlationMatrix[t1][t2] /= (standardDeviations[t1] * standardDeviations[t2]);
      }, this);

      return correlationMatrix;
    };

    this.getWordsByTopics = function() {
      var tuples   = [],
          newArray = [];

      for (var t = 0; t < numberOfTopics; t++) {
        newArray = [];

        for (var w in topics[t].withWord){
          tuples.push(w, topics[t].withWord[w]);
          tuples.sort(function(a, b) { return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 });
        }
        
        newArray.push([t, [tuples]]);
        tuples = newArray;
      }

      return tuples;
    };

    this.getSimilarDocuments = function(docIndex) {
      var self = documents[docIndex].topicsCounts,
          tuples   = [],
          difference = 0,
          list = {},
          other;

      for (var i = 0; i < numberOfDocuments; i++) {
        other = documents[i].topicsCounts;

        for (var m = 0; m < other.length; m++) {
          difference += 1/(Math.abs(self[m] - other[m]) + 1)
        }        
          list[i] = difference /other.length;
          difference = 0;
      }

      for (i in list) {
          tuples.push(i, list[i]);
          tuples.sort(function(a, b) { return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0 });
        }
      // return list;
      return tuples;
    };

    this.getDocuments = function() {
      return documents;
    };

    this.getTopics = function() {
      return topics;
    };

    this.getVocabulary = function() {
      return words;
    };

    initializeTopics();
  };

  return Model;
}());
