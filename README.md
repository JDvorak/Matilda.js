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
This project is in pre-alpha. 
This is __not__ a production library. 
Expect the interface to change drastically from week to week, and the functionality and performance to flucuate wildly. 
Your code __will__ break as this project progresses. 
Proceed at your own risk.

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

#### Step 4. Wait

It isn't all magic.

#### Step 5. Enjoy

There are a number of features that can be drawn from the training.
A Topic by Topic matrix of correlations may be obtained by calling the topicCorrelations method. 

    mM.topicCorrelations();

A list of words by each Topic may be obtained by calling the wordsByTopics method.

    mM.wordsByTopics();

You can even query the words themselves!

    mM.getVocabulary();

#### Also Chains!
Don't forget, this is a fluent library. You can chain things.

    mM.setNumberOfTopics(3)
      .addDocument(["Cats", "Dogs", "Parrots", "Fish"]) 
      .addDocument(["Fish", "Sharks", "Parrots", "Green"])
      .addDocument(["Tables", "Poker", "Green", "Sharks"])
    
    var topicMatrix = mM.train(5).topicCorrelations()

### Where is α and β?

The smoothing factors of LDA are at present automated.

## Roadmap
* v0.0.1
  - Output Words by Topic
  - Read from files
* v0.0.2
  - Simplified Belief Propagation
* v0.0.3
  - Saving to JSON
  - Loading from JSON
  - Fast Gibbs Sampling
* v0.0.4
  - Fast Belief Propagation
  - Online Fast Gibbs Sampling
* v0.0.5
  - Online Fast Belief Propagation
* v0.1.0
  - Relational Topic Model (RTM)
  - Author Topic Model (ATM)
  - Topic User Community Model (TUCM)

## Acknowledgements
Matilda.js is based on [LDAjs](https://github.com/mimno/jsLDA), [Gensim](http://radimrehurek.com/gensim/), and [Mallet](http://mallet.cs.umass.edu/), and inspired by the works of [David Mimno](http://www.cs.princeton.edu/~mimno/), [Ted Underwood](http://tedunderwood.com/), [David Blei](http://www.cs.princeton.edu/~blei/), [Roald Dahl](http://www.roalddahl.com/), and [Sir John Carden](http://www.tankmuseum.org/ixbin/indexplus?_IXSS_=_IXMENU_%3dVehicles%26ALL%3dmatilda%26_IXACTION_%3dsummary%26%252asform%3d%252fsearch_form%252fbovtm_combined%26_IXSESSION_%3d3N23FDeXD_4%26TYPE%3darticle%26_IXFPFX_%3dtemplates%252fsummary%252f&_IXFIRST_=12&_IXSPFX_=templates/full/tvod/t&_IXMAXHITS_=1&submit-button=summary&_IXSESSION_=3N23FDeXD_4&_IXMENU_=Vehicles).
