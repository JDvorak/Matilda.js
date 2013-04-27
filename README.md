# Matilda.js
v0.0.1a

- - -

Matilda is a webscale inference toolkit. 

This Javascript library makes it easy and convenient to perform inference on statistical topic models in both the browser and on the server. It presently performs Latent Dirichlet Allocation by way of Markov Chain Monte Carlo (MCMC), but a lot more is planned.


## Acknowledgements
Matilda.js is based on [LDAjs](https://github.com/mimno/jsLDA), [Gensim](http://radimrehurek.com/gensim/), and [Mallet](http://mallet.cs.umass.edu/), and deeply inspired by the works of [David Mimno](http://www.cs.princeton.edu/~mimno/), [Ted Underwood](http://tedunderwood.com/), [David Blei](http://www.cs.princeton.edu/~blei/), and [Roald Dahl](http://www.roalddahl.com/).


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
