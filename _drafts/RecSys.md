RecSys


## Intro

- Most of the e-commerce websites require recsys: Spotify, Netflix, UberEats, and Pinterest.
- Aspects of RecSys
    - Content space: what is the space in which we have to look for recos.
    - User: what do we know about the user?
    - Context: what is user currently doing on the platform.
    - Recos: how to generate recos?
    - Eval: how do we evaluate the quality of the recos?
    - User interactions: user's interaction with the content.
    - Scale: how to serve all the customers within the latency constraints?
- Each property on the website or app can have a different recommendation engine. Each recommendation premise requires its own model. For eg: made for you, more like x, etc.


## E2E Reco System: Multi-Stage recommender

1. Candidate gen
    - Reduce the original list to a smaller number
    - Optimizes for recall
    - Multiple candidate gens can exist
2. Ranking
    - Best k-ranked from the list given by the candidate gens
    - Takes more context and features into account
3. More advanced systems go through pre-ranking, ranking and reranking steps to arrive at the best k items.

Ref: [YouTube Recsys](https://dl.acm.org/doi/10.1145/2959100.2959190)


## ML Approaches for Generating Recos

- Traditional approaches
    - Collab filtering
    - Neural embeddings
    - Neural collaborative ranking
- Traditional approaches do not scale well -> need for multi-stage recommenders




- Curated data is the biggest advantage




