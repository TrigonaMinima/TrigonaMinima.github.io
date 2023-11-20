---
layout: post
title: "ML Model Deployment and Beyond"
date: 2022-10-26
categories: MLOps
---

What goes into deploying machine learning models? What comes after deploying the model? This post discusses the breadth of steps involved from deployment to monitoring to continuous training. Along the way, I will provide case studies and examples from the industry.

Contents:

1. [Development Workflows](#dev)
2. [Model Deployment](#model_deployement)
3. [Online Experimentation](#expt)
4. [Data Monitoring](#data_monitoring)
5. [Model Monitoring](#model_monitoring)
6. [Continuous Training](#ct)
7. [Business Layer](#bl)
8. [Horizontal Elements](#abstractions)
9. [Conclusion](#conclusion)

---
<br>

## Dev Workflows<a name="dev"></a>

Topics: What are typical Software Dev and Data Science workflows. How they differ.

### Software Engineering Workflow

<figure class="image">
<img src="{{ site.url }}/assets/2022-08/0_sde_process.png" alt="" style="display:block;text-align:center">
<figcaption style="text-align: center"><a href="https://medium.com/prosus-ai-tech-blog/towards-mlops-technical-capabilities-of-a-machine-learning-platform-61f504e3e281">Image source</a></figcaption>
</figure>

Steps in a typical software development workflow (simplified):

- Code a new feature and writing unit tests for it;
- QA;
- Deployment after all the tests pass and QA is done;
- Production monitoring.

If there are any bugs then the above four steps are repeated.

### Data Science Workflow

<figure class="image">
<img src="{{ site.url }}/assets/2022-08/1_ds_process.png" alt="" style="display:block;text-align:center">
<figcaption style="text-align: center"><a href="https://medium.com/prosus-ai-tech-blog/towards-mlops-technical-capabilities-of-a-machine-learning-platform-61f504e3e281">Image source</a></figcaption>
</figure>

Steps in a typical Data Science workflow (simplified):

- Offline steps
    - Data preparation
    - Model architecture implementation
    - Offline evaluation code
    - Parameter optimisation
    - Multiple iterations for different model architectures and data sampling approaches
- Model deployment
- Model monitoring
- A/B Testing

If there are any prediction issues or model end-point errors, then depending on the type of the problem, we either trigger:

- Soft dev workflow (eg: when model is sending out of range values, we add an exception to it in our engineering systems or model serving infra); or
- Data Science workflow (eg: model is not performing commensurate to the offline metrics)

### Differences


difference
ci/cd

## Model Deployment<a name="model_deployement"></a>

### Dichotomy

Online Models: real-time inferencing
Offline Models: offline batch inferencing

### Online Models

Real-time inferencing
All compute happens in real-time
Predictions are available and used immediately
Deployed artefact: model

### Offline Models

Offline batch inferencing
All compute happens offline
Predictions are available and used after a delay
Deployed artefact: spark job

### Case Studies

Guess the model type in the following usecases

Fraud detection - online
ETA prediction - online
Distance prediction - both
Recommendation Engine - both

### Online Model Deployment

Host the model on prod
Register the model in the model registry
Wrap the model in an API endpoint

### Offline Model Deployment

Create a spark job
Prepare population data for inferencing
Fetch the latest feature data from the feature store
Add features to the population
Load the pre-trained model
Inference
Push to a key-value store (eg: Redis)
Model endpoint to read the key-value store when needed

### Fallback Models

Not every model has 100% coverage
Redundancy (why?)
These models are simple in implementation

### Deployment Modes

Canary or phased deployment
Automated deployment
Shadow deployment

## Online Experimentation<a name="expt"></a>

### Why Online

Offline experiments are likely biased
Online experiments are unbiased
Online experiments also monitor business metrics

### Shadow Testing

Is model endpoint performing well?
Is model performing well?
Can we replace the new model the old one?

### A/B Testing

Random trials - distribute equal traffic to all the model versions
A - Control variant
B - One (or more) test variant(s)
Define success and check metrics
Hypothesis testing
    Confidence interval
    P-value

### Case Studies

Guess the experiment mode in the following usecases

Fraud detection - Shadow (or A/B)
ETA prediction - Shadow (+ A/B)
Distance prediction - A/B
Recommendations - A/B

## Data Monitoring<a name="data_monitoring"></a>

### Data Stores

Data Lake: Dump all the data at one place. No filtering.
Data Warehouse: Processed and structured data.
Feature Store: Data warehouse to house feature data for ML models.

### Feature Stores

Point-in-time data (no data leakage)
Feature reuse - Share & discover features
Offline - cost optimized storage
Online - Low latency retrieval (eg: Redis)
Effective machine learning pipelines
Decouples feature engineering and model training
https://www.featurestore.org/

### Need

Distribution of data is not static
Seasonality
Trends
Personal preferences
Data quality - schema, feature values, anomalies

Direct impact on the model

### Data Drift

Feature distribution in training ≠ Feature distribution during inferencing
Jensen-Shannon divergence for numerical features
    Similarity between two probability distributions
    https://yongchaohuang.github.io/2020-07-08-kl-divergence/
L-infinity distance for categorical features
    https://en.wikipedia.org/wiki/Chebyshev_distance
Hypothesis testing
https://greatexpectations.io/
https://www.tensorflow.org/tfx/data_validation/get_started

fig1

fig2


## Model Monitoring<a name="model_monitoring"></a>

### Need

Proactive and not reactive
Identify Infra scale-up requirement
Identify feature issues
Identify concept drift and model drift
https://medium.com/prosus-ai-tech-blog/model-monitoring-1849fb3afc1e

### Endpoint Monitoring

Model throughput -- scale up
Model latencies
    Case study: timeout in model responses leading to app load times increasing
Model error rates
    Case study: calls from legacy systems led to random ranking of rx
Default feature fetches -- something is wrong with the feature)
Model input logging -- helps with debugging
Model output values -- outlier analysis

### Model Drift

Label distribution in training ≠ Label distribution in testing
Eg: fraudsters keep changing their tactics

Distribution of labels of the training dataset
Distribution of predictions
Quality of predictions

### Feature Attribution

Contribution of the features to the prediction
Signed: improves or lowers the prediction
Sums up to prediction score
Skew and drift of feature importance scores
Algorithms:
    Shapley values
    Integrated gradients
    LIME

Importance of feature attribution. Source: Monitoring feature attributions: How Google saved one of the largest ML services in trouble.

## Continuous Training<a name="ct"></a>

### Online Learning

Learning all the time in an online fashion
Dependent on formulation and feasibility stages
Not every model requires online learning
Not always feasible: requires real-time data and labels
Case study: Multi-Armed Bandits based payment routing

###

On-demand vs. always on
Applicable on non-stationary data domain
Case study: recommendation engines

Automated training at constant intervals
Maintain state of the pipelines
Offline experimentation (including Auto ML)
Pipeline validation checks
Push to production
https://www.usenix.org/conference/opml19/presentation/baylor

Previous artefacts and metadata
Warm-starting
Lineage starting from data till the trained model
Model analysis data from offline experiments
Automated feature engineering
Tools: MLFlow, ML Metadata, TensorFlow Model Analysis
https://www.mlflow.org/
https://www.tensorflow.org/tfx/guide/mlmd
https://www.tensorflow.org/tfx/model_analysis/get_started
https://www.featuretools.com/
https://tsfresh.readthedocs.io/en/latest/

## Business Layer<a name="bl"></a>

Models are built to solve a specific problem (eg: improve CTR)
Not necessary that all business objectives are fulfilled
Case study: Ads CTR vs. Average Order Value
Case study: Relevance vs. Last Mile
Case study: Batching orders vs. User perception

Specific business rules at application end
Boosting Layer: scalarization-based (de)-boosting of objectives
    Multi-objective optimization using pareto optimality
    https://en.wikipedia.org/wiki/Multi-objective_optimization
    https://en.wikipedia.org/wiki/Pareto_efficiency
Controllable distributions
    Roughly maintain the business objectives fulfilled in real-time
    Optimizing ranking subject to business constraints
    https://medium.com/pinterest-engineering/using-pid-controllers-to-diversify-content-types-on-home-feed-1c7195c89218

## Horizontal Elements<a name="abstractions"></a>

Code quality checks - automated + manual
Code reviews
Code reuse and modularization
Inefficiencies propagate easily
https://realpython.com/python-pep8/
https://realpython.com/python3-object-oriented-programming/

Create generic abstractions
Add them to a library
Make the library available to all Data Scientists
Case study: Swiggy dslib
Case study: Facebook internal SDKs
Several other tech companies: Spotify, Netflix, Uber, Gojek, Google, Airbnb, and more.
https://bytes.swiggy.com/improving-ds-productivity-with-dslib-267da7e282b


## Conclusion<a name="conclusion"></a>

