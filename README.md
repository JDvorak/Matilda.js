# Matilda.js
v0.0.1
=======


Matilda is a webscale inference toolkit. 

This Javascript library makes it easy and convenient to perform inference on statistical topic models in both the browser and on the server. 
It presently performs Latent Dirichlet Allocation by way of Markov Chain Monte Carlo (MCMC).

## Supported Techniques
* Latent Dirichlet Allocation
  - Sparse Gibbs Sampling

## Project Maturity
This project is alpha. 
This is __not__ a production library. 
Expect the interface and functionality to change drastically from week to week.  
__Proceed at your own risk.__

## Dependencies
This is a standalone library. 

## Usage

Matilda is a fluently structured toolkit styled after d3.js. 

#### Step 1. Instantiate a Model
The basic unit of Matilda is a Matilda model.

      var mM = new Matilda.Model();

A model has two core components. An engine, and a model. 
By default, the engine is a Simplified Gibbs Sampler (siGS), and the model is a Latent Dirichlet Allocation (LDA) based Topic Model. 
At present, this is the only model and only engine available.

#### Step 2. Add Documents

To train a Matilda model, you must first addDocuments. 
The method addDocuments takes an array of words.
But they need not be strings, they can also be numbers.
They represent the features that the model will be trained on.

    mM.addDocument(["Cats", "Dogs", "Parrots", "Fish"]) 
      .addDocument(["Fish", "Sharks", "Parrots", "Green"])
      .addDocument(["Tables", "Poker", "Green", "Sharks"]);

But it also takes an array of arrays.

    mM.addDocument([["Cats", "Dogs", "Parrots", "Fish"], 
                    ["Fish", "Sharks", "Parrots", "Green"],
                    ["Tables", "Poker", "Green", "Sharks"]])  

And it also takes a callback.
When sending multiple documents via addDocument, the callback is run after
every individual document is inserted into the object.
The callback receives an object containing model data, and the current document

    mM.addDocument(["Cats", "Dogs", "Parrots", "Fish"], 
                    function(dataObject, curDoc) {
                      console.log(dataObject.vocab)
                      console.log(dataObject.topics)
                      console.log(dataObject.documents)
                    }) 

For natural word pre-rocessing [NaturalNode](https://github.com/NaturalNode/natural) is highly recommended.

#### Step 3. Train

Now that the documents have been added, you can train your model.
By default models are set to five topics.
You can overide this defaults by using the setNumberOfTopics method.

    mM.setNumberOfTopics(3);

It looks like everything is good to go. 
Time to train.
Train is a method which takes a number which represents the number of iterations.
It is recommended that at least 50 iterations be made, but for this simple example 5 will do. 

    mM.train(5);

__WARNING:__ Setting the Model's Topic Count _after_ training will erase all training.

But that's not all, the train method also takes a callback which is called after every iteration of the training. 
The callback receives an object containing the topics, vocabulary, and document data of the model.

    mM.train(5, function(modelData){ 
      console.log(modelData.vocab)
      console.log(modelData.topics)
      console.log(modelData.documents)
    })

#### Step 4. Enjoy

There are a number of features that can be drawn from the training.
A Topic by Topic matrix of correlations may be obtained by calling the topicCorrelations method. 

    mM.topicCorrelations();

You can get back the documents containing their respective features, and their topic proportions.

    mM.getDocuments();

You can get an object containing all the Topics, and their words.

    mM.getTopics();

You can even look over the words themselves and their topic memberships.

    mM.getVocabulary();

#### Also Chains!
Don't forget, this is a fluent library. You can chain things.

    mM.setNumberOfTopics(3)
      .addDocument([["Cats", "Dogs", "Parrots", "Fish"], 
                    ["Fish", "Sharks", "Parrots", "Green"],
                    ["Tables", "Poker", "Green", "Sharks"]],
                    function(dataObject) {
                      console.log(modelData.vocab)
                      console.log(modelData.topics)
                      console.log(modelData.documents)
                    });  
    
    var topicMatrix = mM.train(5).topicCorrelations();

### Where is α and β?

The smoothing factors of LDA are at present automated.

## Roadmap
* v0.0.2
  - Saving to JSON
  - Loading from JSON
  - Read from files
  - Simplified Belief Propagation
* v0.0.3
  - Fast Gibbs Sampling
  - Online Fast Gibbs Sampling
* v0.0.4
  - Fast Belief Propagation
  - Online Fast Belief Propagation
* v0.0.5
  - Relational Topic Model (RTM)
  - Author Topic Model (ATM)
  - Topic User Community Model (TUCM)
* v0.1.0
  - Natural Language Processing
* v1.0.0
  - Full Support for Markov Logic, and Graphical Models


## Acknowledgements
Matilda.js is based on [LDAjs](https://github.com/mimno/jsLDA), [Gensim](http://radimrehurek.com/gensim/), and [Mallet](http://mallet.cs.umass.edu/), and inspired by the works of [David Mimno](http://www.cs.princeton.edu/~mimno/), [Ted Underwood](http://tedunderwood.com/), [David Blei](http://www.cs.princeton.edu/~blei/), [Roald Dahl](http://www.roalddahl.com/), and [Sir John Carden](http://www.tankmuseum.org/ixbin/indexplus?_IXSS_=_IXMENU_%3dVehicles%26ALL%3dmatilda%26_IXACTION_%3dsummary%26%252asform%3d%252fsearch_form%252fbovtm_combined%26_IXSESSION_%3d3N23FDeXD_4%26TYPE%3darticle%26_IXFPFX_%3dtemplates%252fsummary%252f&_IXFIRST_=12&_IXSPFX_=templates/full/tvod/t&_IXMAXHITS_=1&submit-button=summary&_IXSESSION_=3N23FDeXD_4&_IXMENU_=Vehicles).
