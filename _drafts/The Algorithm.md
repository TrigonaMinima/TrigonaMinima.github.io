The Algorithm
===

- https://blog.twitter.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm
    - set of core models and features that extract latent information from Tweet, user, and engagement data.
    - For You timeline
        - called home mixer
        - home mixer <- product mixer <- custom scala framework
    - Runs 5 billion times per day
    - completes in under 1.5 seconds


## Recommendation Pipeline

1. Candidate Sources: Fetch the best Tweets from different recommendation sources
2. Ranking: Rank each Tweet using a machine learning model
    - Rank ~1500 tweets
    - All candidates are treated equally, without regard for what candidate source it originated from.
    - Model: ~48M parameter neural network
        - continuously trained
        - optimize for positive engagement (e.g. Likes, Retweets, and Replies)
        - thousands of features
        - outputs ten labels (probability of an engagement) to give each Tweet a score
        - rank the Tweets from these scores with each label having a weight
3. Heuristics and Filters: filtering out Tweets from users you've blocked, NSFW content, and Tweets you've already seen.
4. Mixing and serving


## Candidate Sources

- extract the best 1500 Tweets from a pool of hundreds of millions through these sources
- Two major sources:
  1. People you follow (In-Network)
    - most relevant, recent Tweets from users you follow
    - Model: Determine relevance using a logistic regression model
        - outdated model
    - important feature: real graph score (likelihood of engagement between two users). Higher score -> more tweets in candidates
    - Send top n to next stage
  2. People you don't follow (Out-of-Network)
    - approach 1: social graph
        - graph of engagements and follows
        - candidate list 1: What Tweets did the people I follow recently engage with?
        - candidate list 2: Who likes similar Tweets to me, and what else have they recently liked?
        - Model: rank all candidates using log reg
        - created a graph processing engine called graphjet -> maintains a real-time interaction graph between users and Tweets, to execute these traversals
        - coverage: 15% of home timeline tweets
    - approach 2: embeddings
        - What Tweets and Users are similar to my interests?
        - Similarity between any two users, Tweets or user-Tweet pairs in this embedding space
        - Model: Similarity as a stand-in for relevance
        - SimClusters: discover communities anchored by a cluster of influential users using a custom matrix factorization algorithm
            - Users and Tweets are represented in the space of communities, and can belong to multiple communities
            - Updated every three weeks
- Roughly 50:50 ratio of the two


## Heuristics, Filters, and Product Features

- Visibility Filtering: Filter out Tweets based on their content and your preferences. For instance, remove Tweets from accounts you block or mute.
- Author Diversity
- Content Balance: fair balance of In-Network and Out-of-Network Tweets.
- Feedback-based Fatigue: Lower the score of certain Tweets if the viewer has provided negative feedback around it.
- Social Proof: Exclude Out-of-Network Tweets without a second degree connection to the Tweet as a quality safeguard. In other words, ensure someone you follow engaged with the Tweet or follows the Tweet’s author.
- Conversations: Provide more context to a Reply by threading it together with the original Tweet.
- Edited Tweets: Determine if the Tweets currently on a device are stale, and send instructions to replace them with the edited versions.


## Mixing and Serving

- Ranked list of rx from Home Mixer
- Ads
- Follow Recommendations
- Onboarding prompts





