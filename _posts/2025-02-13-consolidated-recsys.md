---
layout: post
title: "Consolidated Recommendation Systems"
date: "2025-02-13"
categories: RecSys
---

This post is a quick summary of [Lessons Learnt From Consolidating ML Models in a Large Scale Recommendation System](https://netflixtechblog.medium.com/lessons-learnt-from-consolidating-ml-models-in-a-large-scale-recommendation-system-870c5ea5eb4a). I have also added a few questions I got while reading it. I end the post with what we do at work to deal with this.


## Summary

- Recommendation System: candidate gen + ranking.
- A typical ranking model pipeline:

    1. Label prep
    2. Feature prep
    3. Model training
    4. Model evaluation
    5. Model deployment (with inference contract)

- Each recommendation use case (e.g.: discover page, notifications, related items, category exploration, search) will have a version of the above pipeline.
- As use cases increase, the team will need to maintain multiple such pipelines. It is time-consuming to maintain multiple pipelines and increases points of failure.

    <figure class="image">
    <img src="{{ site.url }}/assets/2025-02/consolidated_recsys_neflix_1.webp" alt="" style="text-align: center; margin: auto">
    <figcaption style="text-align: center">Figure 1: Figure from the Netflix blog linked at the start.</figcaption>
    </figure>

- Since the pipelines have the same component, we can consolidate them.
- Consolidated pipeline:

    1. Label prep for each use case separately
    2. Stratified union of all the prepared labels
    3. Feature prep (separate categorical feature representing the use case)
    4. Model training
    5. Model evaluation
    6. Model deployment (with inference contract)

    <figure class="image">
    <img src="{{ site.url }}/assets/2025-02/consolidated_recsys_neflix_2.webp" alt="" style="text-align: center; margin: auto" width="100">
    <figcaption style="text-align: center">Figure 2: Figure from the Netflix blog linked at the start.</figcaption>
    </figure>

- Label prep for each use case separately

    1. Each use case will have different ways of generating the labels.
    2. Use case context details are added as separate features.
        - Search context: search query, region
        - Similar items context: source item
    3. When the use case is search, context features specific to the similar item use case will be filled with default values.

- Union of all the prepared labels

    1. Final labelled set: a% samples from use case-1 labels + b% samples from use case-2 labels + … + z% samples from use case-n labels
    2. The proportions [a, b, …, z] come from stratification
    3. Q: How is this stratification done? Platform traffic across different use cases?
    4. Q: What are the results when these proportions are business-driven? Eg: contribution to revenue.

- Feature prep

    1. All use case specific features added to the data.
    2. If a feature is only used for use case 1 then it will contain default value for all the other use cases.
    3. Add a new categorical feature task_type to the features to inform the model about the target reco task.

- Model training happens as usual: feature vector and labels. Architecture remains the same. Optimisation remains the same.
- Model evaluation

    1. Check the appropriate eval metrics to check the model.
    2. Q: How do we judge if the model performed well for all the use cases?
    3. Q: Will it require a separate evaluation set for each use case?
    4. Q: Can there be a 2nd order Simpson’s paradox here: the consolidated model performs well, but when tried for individual use cases, its performance is low? My hunch: no.

- Model deployment (with inference contract)

    1. Deploy the same model in the respective environment made for each use case. That env will have all the specific network-related knobs: batch size, throughput, latency, caching policy, parallelism, etc.
    2. Generic API contract to support the heterogenous context (search query for search, source item for related items use case.)

- Caveats

    1. The consolidated use cases should be related (eg: ranking for movies in the search and discover page)
    2. One definition of related can be: ranking the same entities.

- Advantages

    1. Reduces maintenance costs (less code; fewer deployments)
    2. Quick model iterations to all the use cases
        - Updates (new features, architecture, etc) for one use case can be applied to other use cases.
        - If consolidated tasks are related, then new features don’t cause regression in practice.
    3. Can be extended to any related use case from offline and online POV.
    4. Cross-learning: the model potentially gains more (hidden) learning from the other tasks. Eg: having search data gives more data to the model learning for related-items task.
        - Q: Is this happening? How can we verify this? One way: Train an independent model on the use-case specific data and compare its performance with the consolidated model’s performance on the same task.

- I was confused about what to call this learning paradigm. [Wikipedia](https://en.wikipedia.org/wiki/Multi-task_learning) says that it is multi-task learning.


## Practice at my work

- The models are not merged across different tasks like relevance and search.
- Within relevance ranking tasks (discover, similar items, category exploration), have a common base ranker model.
- On top of that, we have different heuristics to make it better for that particular section.
- Advantages:
    - There is only one main model for all related tasks.
    - Keeps the heuristics logic simple and, thus, easy to maintain.
- Challenges
    - Heuristics are crude/manual/semi-automated → we may be leaving some gains on the table. There are bandit-based approaches to automating it, though.
    - It loses out on cross-learning opportunities.

