---
layout: post
title: "Intersecting Area of Two Normal Distributions"
date: "2023-12-24"
categories:
overlap_possibilities:
  - image_path: "/assets/2023-12/norm_overlap3.png"
  - image_path: "/assets/2023-12/norm_overlap2.png"
  - image_path: "/assets/2023-12/norm_overlap1.png"
---

Here is the problem statement: given two normal distributions, find the area of the parts that are overlapping.

We can use this area to calculate metrics like [Jaccard Index](https://en.wikipedia.org/wiki/Jaccard_index) (or Intersection over Union) and [Overlap coefficient](https://en.wikipedia.org/wiki/Overlap_coefficient). I will discuss a direct use of the metrics in another post.

So how do we calculate the area?

We will discuss three ways:

1. A simple method using Python stdlib.
2. Using high school calculus - [integrals](https://en.wikipedia.org/wiki/Integral).
3. Montecarlo simulations

Let's first discuss the possible pairs of normal distributions. There are three possible variations of overlap:

1. No overlap
2. Overlapping tails
3. Overlapping bodies

{% include gallery id="overlap_possibilities" %}

<details close>
<summary>Code that generated the above plots. Replace `mu` and `sigma` of the normal distributions.</summary>

{% highlight python linenos %}
mu, sigma = 6, 3
d1 = NormalDist(mu, sigma)

mu, sigma = 35, 4
d2 = NormalDist(mu, sigma)

x = np.linspace(-10, 50, 150)
y1 = np.array([d1.pdf(i) for i in x])
y2 = np.array([d2.pdf(i) for i in x])

# Set the figsize
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(x, y1, label=f"mu = {d1.mean}; sigma = {d1.stdev}")
ax.plot(x, y2, label=f"mu = {d2.mean}; sigma = {d2.stdev}")
ax.fill_between(x, np.minimum(y1, y2), color="green", alpha=0.3)

ax.legend()
plt.show()
{% endhighlight %}
</details>

## Python stdlib

Starting from Python 3.8, there is [`overlap`](https://docs.python.org/3.8/library/statistics.html#statistics.NormalDist.overlap) function in the `statistics` module of the stdlib. So, no new import required. Thanks to this [SO answer](https://stackoverflow.com/a/55081018/2650427) for pointing it out.

Here is how we do it.

{% highlight python linenos %}
from statistics import NormalDist

# no overlap
mu, sigma = 6, 3
d1 = NormalDist(mu, sigma)
mu, sigma = 35, 4
d2 = NormalDist(mu, sigma)
print("area =", d1.overlap(d2))

# overlapping tails
mu, sigma = 10, 5
d1 = NormalDist(mu, sigma)
mu, sigma = 30, 8
d2 = NormalDist(mu, sigma)
print("area =", d1.overlap(d2))

# overlapping bodies
mu, sigma = 20, 5
d1 = NormalDist(mu, sigma)
mu, sigma = 20, 8
d2 = NormalDist(mu, sigma)
print("area =", d1.overlap(d2))

# complete overlap
print("area =", d1.overlap(d1))
{% endhighlight %}

```
area = 3.393299519260928e-05
area = 0.11979417250825708
area = 0.7766351730271459
area = 1.0
```

## Integrals

Direct use of the integrals.


- intersection
- area under the curve: integral of pdf is cdf







## Monte Carlo



## Conclusion

- calculating the metrics
- use in user to product matching wrt price


