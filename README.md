# Matilda.js
v0.0.1a
=======


Matilda is a webscale inference toolkit. 

This Javascript library makes it easy and convenient to perform inference on statistical topic models in both the browser and on the server. It presently performs Latent Dirichlet Allocation by way of Markov Chain Monte Carlo (MCMC).




## Supported Techniques
* Latent Dirichlet Allocation
  - Sparse Gibbs Sampling

## Project Maturity
This project is in pre-alpha. This is __not__ a production library. Expect the interface to change drastically from week to week, and the functionality and performance to flucuate wildly. Your code __will__ break as this project progresses. Proceed at your own risk.

## Dependencies
This is a standalone library. 

## Roadmap
* v0.0.1
  - Documentation
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
