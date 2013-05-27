# Matilda.js
  v0.0.2
=======

Matilda is a webscale inference toolkit. 

This Javascript library makes it easy to perform inference on statistical topic models anywhere.
At present, Matilda performs Latent Dirichlet Allocation by way of Markov Chain Monte Carlo (MCMC).

## Supported Techniques
* Latent Dirichlet Allocation
  - Sparse Gibbs Sampling

## Project Maturity
This project is alpha. 
This is __not__ a production library. Do not rely on it.
The interface and functionality will change drastically from week to week.  
__Proceed at your own risk.__

## Dependencies
This is a standalone library. 

## Usage

Matilda is a fluently structured toolkit styled after d3.js. 

#### Step 1. Instantiate a Model
The basic unit of Matilda is a Matilda model.

      var mM = new Matilda.Model();

#### Step 2. Add Documents

To train a Matilda model, you must first addDocuments. 
The method addDocuments takes an array of words.
But they need not be strings. 
A Matilda model is representation agnostic.
So long as they are in an array everything will work out.
All the items in the array are are the features that the model will be trained on.

    mM.addDocument(['Matilda','said','Never','do','anything','by','halves',
                    'if','you','want','to','get','away','with','it',
                    'Be','outrageous','Go','the','whole','hog','Make',
                    'sure','everything','you','do','is','so','completely',
                    'crazy','it','s','unbelievable']);    
    
    mM.addDocument(['When','the','earlier','Infantry','Tank','Mark','I',
                    'which','was','also','known','as','Matilda','was',
                    'removed','from','service','the','Infantry',
                    'Tank','Mk','II','became','known','simply','as','the','Matilda' ]);
    
    mM.addDocument(['When','war','was','recognised','as','imminent','production','of','the',
                    'Matilda','II','was','ordered','and','that','of','the','Matilda',
                    'I','curtailed','The','first','order','was','placed','shortly','after',
                    'trials','were','completed','with','140','ordered','from','Vulcan',
                    'Foundry','in','mid','1938' ]);

    mM.addDocument([ 'So','Matilda','s','strong','young','mind','continued','to',
                    'grow','nurtured','by','the','voices',
                    'of','all','those','authors','who',
                    'had','sent','their','books','out',
                    'into','the','world','like','ships','on','the','sea',
                    'These','books','gave','Matilda','a','hopeful',
                    'and','comforting','message','You','are','not','alone' ]);

But a model can also take an array of arrays.

    var document3 = ['Matilda','said','Never','do','anything','by','halves',
                    'if','you','want','to','get','away','with','it',
                    'Be','outrageous','Go','the','whole','hog','Make',
                    'sure','everything','you','do','is','so','completely',
                    'crazy','it','s','unbelievable'];   

    mM.addDocument([document1, document2, document3]])  

Callbacks are also supported.

When sending multiple documents via addDocument, the callback is run after
every individual document is inserted into the object.
The callback receives an object containing model data, and the current document

    var arrayOfArrays = [document1, document2, document3]

    mM.addDocument(arrayOfArrays, 
                    function(dataObject, curDoc) {
                      console.log(dataObject.vocab);
                      console.log(dataObject.topics);
                      console.log(dataObject.documents);
                    });

For natural word pre-processing [NaturalNode](https://github.com/NaturalNode/natural) is highly recommended.

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

__WARNING:__ Do not call setNumberOfTopics after training. 
Setting the Model's Topic Count _after_ training will erase all training.

The train method also takes a callback which is called after every iteration of the training. 
The callback receives an object containing the topics, vocabulary, and document data of the model.

    mM.train(5, function(modelData){ 
      console.log(modelData.vocab);
      console.log(modelData.topics);
      console.log(modelData.documents);
    });

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

But maybe you want your data more structured. 
You can get back your words organized by topic, and sorted by frequency.

    mM.getWordsByTopics();

Or maybe you need to organize your documents by similarity. 
Just call getSimilarDocuments and pass in one of the documents you've already added to the collection. 
In return you'll see all the documents similar to it.

    mM.getSimilarDocuments(docIndex);

#### Step 5. Mix and Match

Matilda has been made as modular and unopinionated as possible, and works well with Node libraries and client-side libraries alike.

Combine Matilda with MongoDB and maintain an index of entries sorted by topical similarity. 
Mix mM.topicCorrelations() with a static blogging engine and compose a topical map of your blog every regeneration.
Plug in the Google Analytics API and cluster your customers by behavioral traits.
Match it with an email service and fight spam in a whole new way, or just organize your inbox by subject.
Feed your forum into a Matilda Model and find out what your community is talking about.

And that's just the beginning. 

There are big plans.

### Where is α and β?

The smoothing factors of LDA are at present automated.
## Roadmap
* v0.0.3
  - File System Support
* v0.0.4
  - Convert to Belief Propagation
  - Online Fast Belief Propagation
* v0.0.5
  - Correlated Topic Model (CTM)
  - Relational Topic Model (RTM)
  - Author Topic Model (ATM)
  - Topic User Community Model (TUCM)
* v0.1.0
  - Hierarchical Pitman–Yor
  - Pachinko Allocation
* v0.2.0
  - Named Entity Recognition
  - Grasshopper


## Acknowledgements
Matilda.js is based on [LDAjs](https://github.com/mimno/jsLDA), [Gensim](http://radimrehurek.com/gensim/), and [Mallet](http://mallet.cs.umass.edu/), and inspired by the works of [David Mimno](http://www.cs.princeton.edu/~mimno/), [Ted Underwood](http://tedunderwood.com/), [David Blei](http://www.cs.princeton.edu/~blei/), [Roald Dahl](http://www.roalddahl.com/), and [Sir John Carden](http://www.tankmuseum.org/ixbin/indexplus?_IXSS_=_IXMENU_%3dVehicles%26ALL%3dmatilda%26_IXACTION_%3dsummary%26%252asform%3d%252fsearch_form%252fbovtm_combined%26_IXSESSION_%3d3N23FDeXD_4%26TYPE%3darticle%26_IXFPFX_%3dtemplates%252fsummary%252f&_IXFIRST_=12&_IXSPFX_=templates/full/tvod/t&_IXMAXHITS_=1&submit-button=summary&_IXSESSION_=3N23FDeXD_4&_IXMENU_=Vehicles).
