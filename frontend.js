

var makeTestFiles = function(topicCount, wordCount, docCount) {
  var generator = {},
      test = {},
      normal = 0, 
      temp, tempWord, tempTopic, t, w, tw, td, count;

  // Generate Topic Distribution
  generator.topics = [];
  for (var i = 0; i < topicCount; i++) {
    temp = Math.random();
    normal += temp;
    generator.topics[i] = {likelihood: temp, words: {}, docs: {}};
  }
  for (var i = 0; i < topicCount; i++) {
    generator.topics[i].likelihood /= normal;
  }

  // Generate Vocab
  generator.words = {count: 0};
  for (var i = 0; i < wordCount; i++) {
    temp = Math.random();
    tempTopic = "" + Math.floor(Math.random() * topicCount);
    tempWord = "Word: " + i;
    generator.words[i] = {word: tempWord, count: 0, topic: tempTopic}
  }

  //Generate Word Topic Distribution
  for (t in generator.topics) {
    normal = 0;
    for (w in generator.words) {
      if (w === "count" || w == null) continue;
      if (generator.words[w].topic !== t) continue;
      temp = Math.random();
      generator.topics[t].words[w] = {likelihood: temp};
      normal += temp; 
    }
    for (tw in generator.topics[t].words) {
      generator.topics[t].words[tw].likelihood /= normal;
    }
  }
  //Generate Test Documents

  test.docs = [];
  test.words = generator.words;

  for (var oneDoc=0; oneDoc < docCount; oneDoc++) {
    normal = 0;

    var documentLength    = (Math.floor(Math.random() * 200) + 100);
    
    test.docs[oneDoc] = { title: "Title: " + oneDoc,
                     count: documentLength,
                     topicDistribution: [],
                     words: {} };

    //generate topic distribution
    for (t in generator.topics) {
          temp = Math.random() * 10;
          test.docs[oneDoc].topicDistribution[t] = {likelihood: temp};
          normal += temp;
    }

    for (td in test.docs[oneDoc].topicDistribution) {
          test.docs[oneDoc].topicDistribution[td].likelihood /= normal;
    } 

    //generate words
    while (documentLength--) { 
          // pull topic from document's topic distribution
          currentTopic = weightedRandom(test.docs[oneDoc].topicDistribution);
          if (currentTopic == null) continue;
          // pull a word from topic's word distribution
          temp = weightedRandom(generator.topics[currentTopic].words);
          if (temp == null) continue;
          if (!test.docs[oneDoc].words[temp]) { 
            test.docs[oneDoc].words[temp] = {wordId: temp, count: 0}
          };
          if (!test.words[temp]) {
            test.words[temp] = {wordId: temp, count: 0};
          }
          test.docs[oneDoc].words[temp].count += 1;

          test.words[temp].count += 1;
          test.words.count += 1;
    }
  }

  for (d in test.docs) {
    for (w in test.words) {
      if (test.docs[d].words[w] == null) test.docs[d].words[w] = {count: 0};
    }
  }

  return {TestSet: test, Generator: generator};
}

// / /  / / //
  // / /  / / //
// / /  / / //
  // / /  / / //
// / /  / / //
  // / /  / / //
// / /  / / //

var initialize = function(data, k) {



  var messages = {},
      docs = data.docs,
      vocab = data.words,
      topics = [],
      normal = 0;

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



var bpsLDA = function(data, k, trials, alpha, beta) {
  var cap       = 5e-32;    
  var data      = initialize(data, k);
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
      Topics[t].docs[d].likelihood /= Topics[t].likelihood;         
    }  
    for (w in Topics[t].words) {
      Topics[t].words[w].likelihood /= Topics[t].likelihood;
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



var testBPS = function(topicCount, wordCount, docCount) {
  var generatedData = makeTestFiles(topicCount, wordCount, docCount),
      testData = generatedData.TestSet;

  var results = bpsLDA(testData, 2, 50, (50 / topicCount), (200 / wordCount));

  console.log(results, generatedData)
  window.results = results;
  window.generated = generatedData

}

testBPS(3,3,100)



