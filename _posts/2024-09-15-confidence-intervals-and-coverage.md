---
layout: post
title: "Confidence Intervals and Coverage"
date: "2024-09-15"
categories: ML
t_vs_std_norm:
  - image_path: "assets/2024-09/t_norm_ci_uniform_sample.png"
    title: "Blue part is t-distribution. Red part is standard normal distribution. For each sample drawn from a uniform distribution, the CI bounds are plotted. Blue is wider than red and then they merge as sample size gets large enough."
  - image_path: "assets/2024-09/t_norm_ci_normal_sample.png"
    title: "Blue part is t-distribution. Red part is standard normal distribution. For each sample drawn from a normal distribution, the CI bounds are plotted. Blue is wider than red and then they merge as sample size gets large enough."
  - image_path: "assets/2024-09/t_norm_ci_poisson_sample.png"
    title: "Blue part is t-distribution. Red part is standard normal distribution. For each sample drawn from a Poisson distribution, the CI bounds are plotted. Blue is wider than red and then they merge as sample size gets large enough."
ci_width_ci:
  - image_path: "assets/2024-09/ci_level_with_ci.png"
    title: "As confidence level increases from 0 to 100%, confidence interval widens. When confidence level is 0, there will not be any CI. When confodence level is 100%, CI will contain all the data."
ci_width_sample_size:
  - image_path: "assets/2024-09/ci_vs_sample_size.png"
    title: "When sample size increases, the confidence interval becomes narrow and more centered around mean, 0.0."
ci_width_std:
  - image_path: "assets/2024-09/ci_vs_stddev.png"
    title: "The x-axis shows the standard deviation of a normal distribution going from 0 to 2. As the standard deviation increases (meaning more vairance in the data,) the 95% confidence interval on the sample widens, and thus, more unreliable."
coverage_probab:
  - image_path: "assets/2024-09/coverage_probability_2.png"
    title: "Each line represents a 95% CI on a random sample. Out of 100 confidence intervals, 7 CIs (marked in red) do not contain the true mean (black line.) Thus, we get a coverage of 93%, which is not the same as 95%, hence no probability matching."
---

## Confidence Interval (CI)

- CI is an interval.
- An interval which is exepected to contain the parameter being estimated (eg: population mean.)
- Typical confidence levels are 95% and 99%.
- The confidence level of a confidence interval is called Nominal coverage (probability.)
- CI with 95% confidence: random interval which contains the parameter to be estimated 95% of the time.
- Two ways to mention a confidence level of 95%:
    - Confidence interval with $$\gamma = 0.95$$; 95% confidence
    - Confidence interval with $$\alpha = 0.05$$; 95% confidence: $$1-\alpha = 0.95$$
- Mathematical representation

    $$
    P(u(X)<\theta <v(X))=\gamma
    $$

    - $$\theta$$ is the parameter to be estimated (eg: population mean or median).
    - $$X$$ is a random variable from a probability distribution with parameter $$\theta$$
    - $$u(X)$$ and $$v(X)$$ are random variables containing parameter $$\theta$$ with probability $$\gamma$$
    - Confidence level $$\gamma$$ < 1 (but close to 1). eg: 0.95

- Mathematical representation in case of normal distribution:

    $$
    \text{CI} = \bar{x} \pm z^* \left(\frac{\sigma}{\sqrt{n}}\right)
    $$

    Where:
    - $$\bar{x}$$ is the sample mean.
    - $$z^*$$ is the critical value corresponding to the desired confidence level
    - $$\sigma$$ is the population standard deviation.
    - $$n$$ is the sample size.
    - The quantity $$\displaystyle {\sigma }_{\bar {x}}={\frac {\sigma }{\sqrt {n}}}$$ is also called the [standard error of the mean](https://en.wikipedia.org/wiki/Standard_error).
    - The 95% confidence level will correspond to the 97.5th percentile of the distribution. Reason: the probability of $$\theta$$ lying outside the 95% confidence level is 5%. So, 2.5% probability on both sides (if symmetric). So the range becomes 2.5% to (95+2.5)%.
- We can calculate the critical value $$z^*$$ as follows:
    - If the sample size is small (< 30) or we do not know the std dev, then we use the t-statistic (Student's t-distribution.) The t-distribution is wider and has heavier tails than the normal distribution, reflecting the increased uncertainty in small samples. Thus, it accounts for the extra variability.
    - If the sample size is large enough to make CLT valid, we use normal distribution (Z-distribution) --> z-score. Eg: a z-score of 1.96 for a 95% confidence level.
    - As the sample size increases, both methods converge.
    - It is better to use the t-statistic.
- Ref:
    - [Confidence interval](https://en.wikipedia.org/wiki/Confidence_interval) wiki
    - [Interpretation](https://en.wikipedia.org/wiki/Confidence_interval#Interpretation)
    - [Common misunderstandings](https://en.wikipedia.org/wiki/Confidence_interval#Common_misunderstandings)


## CI Width

- The narrower the width, the higher the confidence.
- Factors that impact the width of CI are sample size, variance/standard deviation, and confidence level.
    - Sample size high --> narrow CI
    - High variance/standard dev --> wider CI
    - Higher confidence level --> wider CI (more data will lie under a higher confidence level)

## Coverage

- Coverage (probability): the probability that a confidence interval will include the true value (eg: population mean.)
- The proportion of CIs (at a particular confidence level) that contain the true value (eg: population mean.)
- 95% CI coverage: For example, if you calculate a 95% confidence interval for a population mean, you are saying that if you were to take many samples and calculate a confidence interval from each one, approximately 95% of those intervals would contain the true population mean.
- Probability matching: if coverage probability is the same as nominal coverage probability.
<img src="{{ site.url }}/assets/2024-09/coverage_probability.png" alt="" width="500" style="text-align: center; margin: auto">
    - Nominal coverage = 50%
    - Coverage = 10/20 = 50% (blue CIs contain the true mean)
    - Probability matching since coverage is the same as nominal coverage.
    - [Image ref](https://en.wikipedia.org/wiki/File:Normal_distribution_50%25_CI_illustration.svg)
- Ref:
    - [Coverage probability](https://en.wikipedia.org/wiki/Coverage_probability) wiki
    - [Confidence interval construction](https://en.wikipedia.org/wiki/Neyman_construction)


## Implementation and Explorations

Now, we will go through the above concepts in code.

<details close>
<summary>Common imports</summary>
{% highlight python linenos %}
import numpy as np
import scipy.stats as st
import matplotlib.pyplot as plt
{% endhighlight %}
</details>
<br>

### Compute CI

We implement the t-distribution and standard normal distribution to calculate the critical value.

{% highlight python linenos %}
def confidence_interval_t(sample, confidence=0.95):
    """
    Calculate the confidence interval for the mean of a sample using the t-distribution.

    This function is appropriate when the population standard deviation is unknown and
    the sample size is small (n < 30), although it works for any sample size.

    Parameters:
    sample (numpy.ndarray): The sample data as a NumPy array.
    confidence (float): The desired confidence level (default
    is 0.95 for a 95% confidence interval).

    Returns:
    tuple: Lower and upper bounds of the confidence interval.
    """
    # Ensure the sample is a NumPy array
    sample = np.array(sample)

    sample_mean = sample.mean()
    # Use Bessel's correction (ddof=1) for sample standard deviation
    sample_std = sample.std(ddof=1)
    sample_size = len(sample)
    standard_error = sample_std / np.sqrt(sample_size)

    # Determine the critical value for the specified confidence level
    critical_value = st.t.ppf((1 + confidence) / 2, df=sample_size - 1)
    margin_of_error = critical_value * standard_error

    lower_bound = sample_mean - margin_of_error
    upper_bound = sample_mean + margin_of_error

    return lower_bound, upper_bound
{% endhighlight %}

We use [`stats.t.ppf`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.t.html) to get the critical value using the t-distribution. We can replace that with [`stats.norm.ppf`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html) for the z-score.

<details close>
<summary>Confidence interval using standard normal distribution</summary>
{% highlight python linenos %}
def confidence_interval_norm(sample, confidence=0.95):
    """
    Calculate the confidence interval for the mean of a sample using the normal
    distribution (Z-distribution).

    This function is appropriate when the population standard deviation is
    known, or when the sample size is large (n >= 30), allowing the
    Central Limit Theorem to approximate the sample mean's distribution as normal.

    Parameters:
    sample (numpy.ndarray): The sample data as a NumPy array.
    confidence (float): The desired confidence level (default
    is 0.95 for a 95% confidence interval).

    Returns:
    tuple: Lower and upper bounds of the confidence interval.
    """
    # Ensure the sample is a NumPy array
    sample = np.array(sample)

    sample_mean = sample.mean()
    # Use Bessel's correction (ddof=1) for sample standard deviation
    sample_std = sample.std(ddof=1)
    sample_size = len(sample)
    standard_error = sample_std / np.sqrt(sample_size)

    # Determine the critical value for the specified confidence level
    critical_value = st.norm.ppf((1 + confidence) / 2)
    margin_of_error = critical_value * standard_error

    lower_bound = sample_mean - margin_of_error
    upper_bound = sample_mean + margin_of_error

    return lower_bound, upper_bound
{% endhighlight %}
</details>
<br>
Let's compare the results with scipy implementations.

{% highlight python linenos %}
sample = np.random.random_sample(10)

print("defined functions:")
print("tstat:\t", confidence_interval_t(sample))
print("norm:\t", confidence_interval_norm(sample))

print("scipy functions:")
interval = st.t.interval(
    confidence=0.95, df=len(sample) - 1, loc=np.mean(sample), scale=st.sem(sample)
)
print("tstat:\t", interval)

interval = st.norm.interval(confidence=0.95, loc=np.mean(sample), scale=st.sem(sample))
print("norm:\t", interval)

# defined functions:
# tstat: (0.2756144976802315, 0.7458592632198344)
# norm:	 (0.3070236240157737, 0.7144501368842922)
# scipy functions:
# tstat: (0.2756144976802315, 0.7458592632198344)
# norm:	 (0.3070236240157737, 0.7144501368842922)
{% endhighlight %}

It is the same. In the following sections, we will use the scipy functions.

### CI T-distribution vs. CI Z Distribution

We will verify if the confidence interval converges as the sample size increases in both methods. We will try both on the samples generated using the following sampling methods:

- Uniform
- Standard normal
- Poisson

{% highlight python linenos %}
sample_sizes = []
sample_means = []

t_interval_95_l = []
t_interval_95_r = []

norm_interval_95_l = []
norm_interval_95_r = []

for sample_size in range(10, 100, 5):
    sample = np.random.random_sample(sample_size)
    t_interval_95 = st.t.interval(
        confidence=0.95, df=len(sample) - 1, loc=np.mean(sample), scale=st.sem(sample)
    )
    norm_interval_95 = st.norm.interval(
        confidence=0.95, loc=np.mean(sample), scale=st.sem(sample)
    )
    sample_sizes.append(sample_size)
    sample_means.append(np.mean(sample))
    t_interval_95_l.append(t_interval_95[0])
    t_interval_95_r.append(t_interval_95[1])
    norm_interval_95_l.append(norm_interval_95[0])
    norm_interval_95_r.append(norm_interval_95[1])
    # print(sample_size, t_interval_95, norm_interval_95)

fig, ax = plt.subplots(figsize=(10, 5))
_ = ax.fill_between(
    sample_sizes, t_interval_95_l, t_interval_95_r, color="b", alpha=0.4
)
_ = ax.fill_between(
    sample_sizes, norm_interval_95_l, norm_interval_95_r, color="r", alpha=0.4
)
_ = ax.set_xlabel("Sample size")
_ = ax.set_ylabel("CI upper and lower bounds")
_ = ax.set_title("Uniform Distribution")
{% endhighlight %}

Replace [`np.random.random_sample`](https://numpy.org/doc/stable/reference/random/generated/numpy.random.random_sample.html) with [`np.random.standard_normal`](https://numpy.org/doc/stable/reference/random/generated/numpy.random.standard_normal.html) and [`np.random.poisson`](https://numpy.org/doc/stable/reference/random/generated/numpy.random.poisson.html) to get standard normal and the Poisson random samples.

Here are the results:

{% include gallery id="t_vs_std_norm" %}

In each figure (click to zoom), the blue part corresponds to t-distribution-based CI, and the red part is to standard normal based CI. We can observe that:

1. t-distribution based CIs are wider than standard normal based CI.
2. As the sample size increases, both converge.


### CI Width Simulations

Let's visualise how the CI width changes with different factors: confidence level, sample size, and standard deviation or variance.

#### Confidence Level - $$\gamma$$

The width of CI increases as the CI level increases. Intuition: as the confidence level increases, we widen the range to get the upper and lower limits of the confidence interval.

<details collapse>
<summary>Code</summary>
{% highlight python linenos %}
sample = np.random.standard_normal(size=1000)
sample_mean = np.mean(sample)
sample_sem = st.sem(sample)

cis = []
t_interval_l = []
t_interval_r = []
for ci in range(0, 100, 5):
    ci = ci * 0.01
    t_interval = st.t.interval(
        confidence=ci, df=len(sample) - 1, loc=sample_mean, scale=sample_sem
    )
    cis.append(ci)
    t_interval_l.append(t_interval[0])
    t_interval_r.append(t_interval[1])

fig, ax = plt.subplots(figsize=(10, 5))
_ = ax.fill_between(cis, t_interval_l, t_interval_r, color="g", alpha=0.4)
_ = ax.set_xlabel("CI level")
_ = ax.set_ylabel("CI upper and lower bounds")
{% endhighlight %}
</details>

{% include gallery id="ci_width_ci" %}

#### Sample Size

The width of CI reduces with as the sample size increases. Intuition: as sample size increases, we get more confident in our normal distribution parameter estimation, and thus, the confidence interval width reduces.

<details collapse>
<summary>Code</summary>
{% highlight python linenos %}
sample_sizes = []
sample_means = []

t_interval_95_l = []
t_interval_95_r = []

norm_interval_95_l = []
norm_interval_95_r = []

for sample_size in range(10, 10000, 10):
    sample = np.random.standard_normal(size=sample_size)
    t_interval_95 = st.t.interval(
        confidence=0.95, df=len(sample) - 1, loc=np.mean(sample), scale=st.sem(sample)
    )
    sample_sizes.append(sample_size)
    sample_means.append(np.mean(sample))
    t_interval_95_l.append(t_interval_95[0])
    t_interval_95_r.append(t_interval_95[1])

fig, ax = plt.subplots(figsize=(10, 5))
_ = ax.fill_between(
    sample_sizes, t_interval_95_l, t_interval_95_r, color="r", alpha=0.4
)
_ = ax.set_xlabel("Sample size")
_ = ax.set_ylabel("CI upper and lower bounds")
{% endhighlight %}
</details>

{% include gallery id="ci_width_sample_size" %}


#### Standard Deviation (Variance)

As with confidence level as the variance increases, we have more dispersion in the data. That leads to a wider CI width.

<details collapse>
<summary>Code</summary>
{% highlight python linenos %}
stds = []
sample_means = []

t_interval_95_l = []
t_interval_95_r = []

norm_interval_95_l = []
norm_interval_95_r = []

for std in range(0, 200, 1):
    std = std * 0.01
    sample = np.random.normal(loc=0, scale=std, size=1000)
    t_interval_95 = st.t.interval(
        confidence=0.95, df=len(sample) - 1, loc=np.mean(sample), scale=st.sem(sample)
    )
    stds.append(std)
    t_interval_95_l.append(t_interval_95[0])
    t_interval_95_r.append(t_interval_95[1])

fig, ax = plt.subplots(figsize=(10, 5))
_ = ax.fill_between(stds, t_interval_95_l, t_interval_95_r, color="r", alpha=0.4)
_ = ax.set_xlabel("Standard Deviation")
_ = ax.set_ylabel("CI upper and lower bounds")
{% endhighlight %}
</details>

{% include gallery id="ci_width_std" %}


### Probability Matching

Coverage probability will not always be the same as nominal coverage probability. When it matches, we get probability matching. In the below figure, out of 100 confidence intervals, 7 CIs do not contain the true mean (black.) Thus, we get a coverage of 93%, which is not the same as 95%, hence no probability matching.


<details collapse>
<summary>Code</summary>

{% highlight python linenos %}
population = np.random.standard_normal(size=100000)

ci_ids = []
t_interval_l = []
t_interval_r = []
ci_contains_true_value = []

ci_level = 0.95
for i in range(100):
    sample = np.random.choice(population, size=10000, replace=False)
    t_interval = st.t.interval(
        confidence=ci_level,
        df=len(sample) - 1,
        loc=np.mean(sample),
        scale=st.sem(sample),
    )
    ci_ids.append(i + 1)
    t_interval_l.append(t_interval[0])
    t_interval_r.append(t_interval[1])

    if t_interval[0] <= 0 <= t_interval[1]:
        ci_contains_true_value.append(1)
    else:
        ci_contains_true_value.append(0)

cols = ["g" if i == 1 else "red" for i in ci_contains_true_value]
fig, ax = plt.subplots(figsize=(10, 5))
_ = ax.vlines(ci_ids, t_interval_l, t_interval_r, color=cols, alpha=0.3)
_ = ax.axhline(0, color="black")
_ = ax.set_ylabel("CI upper and lower bounds")
_ = ax.set_xticks([])
_ = ax.set_title(
    f"Coverage = {sum(ci_contains_true_value) * 100 / len(ci_contains_true_value)}%"
    f" (Nominal Coverage = {ci_level*100}%)"
)
{% endhighlight %}
</details>

{% include gallery id="coverage_probab" %}

### Conclusion

A Confidence Interval is an interval over a sample that is expected to contain the distribution parameter that we are trying to estimate (eg: mean.) That means that all CIs will not contain the mean. The sample and population mean could have the following properties:

1. It does not contain the mean
2. It contains the mean somewhere in the middle
3. It contains the mean but as an outlier

Since the confidence interval is built from this sample using normal distribution the confidence interval may not contain the mean in the 1st or the 3rd scenario. That is why we take the confidence level as 95% or more to handle the 3rd scenario (demonstrated in the simulation section).

Since narrow-width confidence intervals are better (and more reliable), we should try to

- take higher confidence levels (95% or more);
- have a bigger sample size; and
- have less variance in the data.


<br>
