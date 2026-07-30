---
layout: post
title: "Linear Regression Primer"
date: "2026-07-31"
categories: ML
---

Linear regression is the simplest useful model in machine learning. It contains most of the ideas that show up everywhere else in ML: a loss function, an optimizer, regularization, and the bias-variance trade-off.

Understand linear regression well and a lot of other models start to look like variations on the same theme.

* TOC
{:toc}

## The Model And The Intuition

- Linear regression predicts a number from a set of inputs.
- The prediction is, $$\hat{y} = w^Tx + b$$.
- $$w$$ is a vector of weights, one per feature. $$b$$ is the intercept.
- Each weight tells you how much the prediction changes when that feature goes up by one unit. Everything else is held fixed.
- Fitting the model means picking $$w$$ and $$b$$ so predictions land close to the real targets $$y$$.
- "Close" is defined by the loss function discussed in the next section.


<figure class="lr-fig lr-fig-mpl">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-actual-fitted.svg" alt="Scatter plot of nine data points with a least-squares fitted line. Slope w is approximately 0.86, intercept b is approximately 0.59. Points above the line are green, points below are orange. Dashed vertical segments show residuals, the gap between each point and the fitted line.">
</div>
<figcaption>Nine data points and the least-squares line fit to them: slope w &#8776; 0.86, intercept b &#8776; 0.59. Green points sit above the line, orange points sit below it. Dashed segments are residuals, the vertical gap between each point and the line.</figcaption>
</figure>

## Loss Function

- A residual is the gap between the actual value and the model's prediction for one point: $$r_i = y_i - \hat y_i$$.
- Mean Squared Error (MSE) loss,
    $$L(w,b) = \frac{1}{n}\sum_{i=1}^n (y_i - \hat y_i)^2$$

  <details close markdown="1">
  <summary>Why squared error? (MLE derivation)</summary>

  - It falls out of a specific assumption about noise.
  - Assume every observation is the true line plus Gaussian noise: $$y_i = w^Tx_i + b + \epsilon_i$$, with $$\epsilon_i \sim \mathcal{N}(0,\sigma^2)$$.
  - The probability of seeing $$y_i$$ given $$x_i$$ is then a Gaussian density:

    $$p(y_i \mid x_i; w, b) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{(y_i - w^Tx_i - b)^2}{2\sigma^2}\right)$$

  - Assuming the data points are independent, the joint likelihood of the whole dataset is the product of each point's density:

    $$p(y \mid X; w, b) = \prod_{i=1}^n p(y_i \mid x_i; w, b)$$

  - Taking the log turns that product into a sum. Log is monotonic, so maximizing the log-likelihood still maximizes the original likelihood, and sums are far easier to differentiate than products. That gives the log-likelihood:

    $$\log p(y \mid X; w, b) = -\frac{n}{2}\log(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{i=1}^n (y_i - w^Tx_i - b)^2$$

  - Only the sum of squared errors depends on $$w$$ and $$b$$. Maximizing this log-likelihood is the same as minimizing that sum.

  - So MSE is maximum likelihood estimation (MLE) under Gaussian noise.

  </details>

- Mean Absolute Error (MAE) Loss,
    $$L(w,b) = \frac{1}{n}\sum_{i=1}^n |y_i - \hat y_i|$$

  <details close markdown="1">
  <summary>Why absolute error? (MLE derivation)</summary>

  - Assume the noise is Laplace instead of Gaussian: $$\epsilon_i \sim \text{Laplace}(0, s)$$, with density $$p(\epsilon_i) = \frac{1}{2s}\exp\left(-\frac{\lvert\epsilon_i\rvert}{s}\right)$$.
  - The probability of seeing $$y_i$$ given $$x_i$$ is then:

    $$p(y_i \mid x_i; w, b) = \frac{1}{2s}\exp\left(-\frac{\lvert y_i - w^Tx_i - b\rvert}{s}\right)$$

  - Taking the log of the joint likelihood, the same way as before, gives:

    $$\log p(y \mid X; w, b) = -n\log(2s) - \frac{1}{s}\sum_{i=1}^n |y_i - w^Tx_i - b|$$

  - Only the sum of absolute errors depends on $$w$$ and $$b$$. Maximizing this log-likelihood is the same as minimizing that sum.

  - So MAE is MLE under Laplace noise, the same way MSE is MLE under Gaussian noise.

  - The Laplace distribution has heavier tails than the Gaussian, meaning it assigns large deviations more probability. That is exactly why MAE tolerates outliers better: a Laplace-noise model expects big misses to happen sometimes, so it does not penalize them as harshly as a Gaussian-noise model does.

  </details>

- Squaring vs. Absolute Value

  - Squaring punishes large errors more than small ones. Absolute value penalizes every unit of error the same, no matter how large the error already is.
  - Squaring is smooth and differentiable everywhere. Absolute value has a kink at zero.
  - Squaring leads to a clean closed-form solution, covered in the next section. That matters because a closed-form solution gives the exact optimum directly, in one step. There is no need to iterate or tune a learning rate. MAE has no such closed form, since the kink at zero leaves the derivative undefined right there.

## Solving It: The Normal Equation

- Stack every example into a design matrix $$X$$ (one row per example) and a target vector $$y$$. Add a column of ones to $$X$$ so $$w$$ absorbs the intercept $$b$$.
- The loss in matrix form is $$L(w) = \|y - Xw\|^2$$.
- Take the gradient and set it to zero: $$\nabla_w L = -2X^T(y - Xw) = 0$$.
- Solving for $$w$$ gives the normal equation: $$w = (X^TX)^{-1}X^Ty$$.
- $$(X^TX)^{-1}$$ does not exist when $$X^TX$$ is singular.
  - This happens with multicollinearity, when two features are (near) linear combinations of each other.
  - It also happens when there are more features than examples.
  - Near-collinearity leaves $$X^TX$$ close to singular. Inverting it then blows up the variance of the estimated coefficients: small changes in the training data swing $$w$$ wildly, even though the model's predictions stay roughly stable.
- Fixes:
  - Drop/combine the correlated features
  - Ridge regularization makes the matrix invertible again
- Inverting $$X^TX$$ gets expensive as the number of features $$d$$ grows. Building $$X^TX$$ costs roughly $$O(nd^2)$$, and inverting it costs roughly $$O(d^3)$$.

## Solving It: Gradient Descent

- Gradient descent avoids the inversion entirely.
- The gradient of the MSE loss is $$\nabla_w L = -\frac{2}{n}X^T(y - Xw)$$.
- The update rule is $$w \leftarrow w - \eta \nabla_w L$$, where $$\eta$$ is the learning rate.
- Repeat until the loss stops improving.

<figure class="lr-fig lr-fig-narrow">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-gradient-descent.svg" alt="Concentric contour ellipses on a w1-w2 plane representing the loss surface, with a dashed path of decreasing steps converging to the center minimum">
</div>
<figcaption>Each contour ring is a level set of the loss over the weights (\(w_1, w_2\)). Gradient descent takes steps roughly perpendicular to the rings, shrinking as it nears the bottom of the bowl.</figcaption>
</figure>

**Practical notes**

- Learning rate too large: the loss diverges or oscillates.
- Learning rate too small: convergence is slow.
- The MSE loss is convex. Gradient descent finds the global minimum, given a sane learning rate.
- Variants:
  - Batch gradient descent uses the full dataset every step.
  - Stochastic gradient descent uses one example at a time.
  - Mini-batch gradient descent, the common default, uses small batches.
- Feature scaling matters a lot here. More on that in the feature handling section below.


## Assumptions And Diagnostics

Linear regression's guarantees only hold if some assumptions hold too. Here is what to check.

- **Linearity**: the true relationship between features and target is linear.
  - Meaning: the model's straight-line shape actually matches the data.
  - How to check: plot residuals vs. fitted values; look for curved patterns.
  - If it fails: add polynomial or interaction terms.

<figure class="lr-fig lr-fig-mpl">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-diag-linearity.svg" alt="Two residuals-vs-fitted scatter plots. Satisfied panel shows residuals scattered randomly around zero with no pattern. Violated panel shows residuals following a U-shaped curve, dipping below zero in the middle and rising above zero at both ends.">
</div>
<figcaption>Satisfied: residuals scatter randomly around zero, no shape. Violated: a U-shaped curve, the model missed a nonlinear relationship.</figcaption>
</figure>

- **Independence**: residuals are not correlated with each other.
  - Meaning: one observation's error tells you nothing about another's.
  - How to check: plot residuals in time / sequence order; look for trends.
  - If it fails: model the correlation directly, or use a different model.

<figure class="lr-fig lr-fig-mpl">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-diag-independence.svg" alt="Two residuals-vs-order line plots. Satisfied panel shows residuals jumping randomly around zero with no pattern over time. Violated panel shows a smooth oscillating wave, residuals trending up and down in cycles."></div>
<figcaption>Satisfied: residuals jump randomly around zero over time. Violated: a smooth cyclical wave, each residual is correlated with its neighbors.</figcaption>
</figure>

- **Homoscedasticity**: residual variance is constant across all predictions.
  - Meaning: the model is equally uncertain everywhere, not more uncertain at some predictions than others.
  - How to check: plot residuals vs. fitted values; look for a "funnel" shape.
  - If it fails: transform the target (e.g. log), or use weighted least squares.

<figure class="lr-fig lr-fig-mpl">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-diag-homoscedasticity.svg" alt="Two residuals-vs-fitted scatter plots. Satisfied panel shows a constant-width band of residuals across all fitted values. Violated panel shows a funnel shape, tight near zero and widening as fitted value increases.">
</div>
<figcaption>Satisfied: residuals stay within a constant-width band. Violated: a funnel, the model gets less certain as predictions grow.</figcaption>
</figure>

- **Normal residuals**: residuals are approximately Gaussian.
  - Meaning: needed mainly for valid confidence intervals, less for point predictions.
  - How to check: Q-Q plot of residuals.
  - If it fails: point predictions are usually still fine; don't trust the confidence intervals.

<figure class="lr-fig lr-fig-mpl">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-diag-normality.svg" alt="Two Q-Q plots comparing sample quantiles to theoretical normal quantiles. Satisfied panel shows points tightly hugging the diagonal reference line. Violated panel shows an S-curve, points below the line at the low end and above the line at the high end, indicating heavy tails.">
</div>
<figcaption>Satisfied: points hug the diagonal. Violated: an S-curve, below the line at the low end and above it at the high end, heavier tails than a Gaussian.</figcaption>
</figure>

- **No severe multicollinearity**: features are not near-linear combinations of each other.
  - Meaning: the model can't tell which correlated feature deserves the credit, so their coefficients become unstable (see the normal equation section above).
  - How to check: Variance Inflation Factor (VIF); correlation matrix.
  - If it fails: drop or combine correlated features, or add ridge regularization.

<figure class="lr-fig lr-fig-mpl">
<div class="lr-fig-scroll">
<img src="{{ site.url }}/assets/2026-07/lr-diag-multicollinearity.svg" alt="Two scatter plots of feature 1 against feature 2. Satisfied panel shows an uncorrelated round cloud of points, VIF approximately 1.1. Violated panel shows points tightly packed along a diagonal line, VIF approximately 38.4.">
</div>
<figcaption>Satisfied: an uncorrelated cloud, VIF &#8776; 1.1. Violated: points collapse onto a line, VIF &#8776; 38.4, the two features carry almost the same information.</figcaption>
</figure>


## Regularization

- Plain least squares can overfit, especially with many features or correlated features.
- Regularization adds a penalty on the size of $$w$$.
- Regularization trades a small increase in bias for a larger drop in variance. That trade is usually a net win when the unregularized model was overfitting.

- **Ridge (L2)**: $$L(w) = \|y-Xw\|^2 + \lambda \|w\|_2^2$$

  - Closed form: $$w = (X^TX + \lambda I)^{-1}X^Ty$$.
  - Shrinks weights toward zero. Rarely sets any weight to exactly zero.
  - Fixes the singular $$X^TX$$ problem directly, since $$X^TX + \lambda I$$ is always invertible for $$\lambda > 0$$.


- **Lasso (L1)**: $$L(w) = \|y-Xw\|^2 + \lambda\|w\|_1$$

  - No closed form, since the L1 term is not differentiable at zero. Solved with coordinate descent (optimize one weight at a time, holding the rest fixed) or subgradient methods (a generalized gradient that handles the non-differentiable kink).
  - Pushes some weights all the way to exactly zero. This performs feature selection as a side effect.

- **Elastic net** mixes both penalties: $$L(w) = \|y-Xw\|^2 + \lambda_1\|w\|_1 + \lambda_2\|w\|_2^2$$. Useful when features are correlated, since lasso alone tends to pick one feature from a correlated group somewhat arbitrarily.

- Why L1 zeroes weights and L2 does not

  1. **Bayesian view**. Regularization is a prior on $$w$$, and the MAP estimate is the loss plus the negative log prior.

      - Ridge corresponds to a Gaussian prior: $$w \sim \mathcal{N}(0, \tau^2 I)$$. Its negative log density adds an $$L2$$ term. The Gaussian prior is smooth at zero, so it only shrinks weights, never zeroing them exactly.

        <details close markdown="1">
        <summary>Where the ridge penalty comes from (Gaussian prior derivation)</summary>

        - The MAP estimate maximizes the likelihood times the prior: $$p(y \mid X, w)\, p(w)$$.
        - Taking the log turns the product into a sum: $$\log p(y \mid X, w) + \log p(w)$$.
        - The first term is the same one from the MSE derivation earlier: $$\log p(y \mid X, w) = -\frac{1}{2\sigma^2}\|y-Xw\|^2 + \text{const}$$.
        - The Gaussian prior $$p(w) = \frac{1}{(2\pi\tau^2)^{d/2}}\exp\left(-\frac{\|w\|_2^2}{2\tau^2}\right)$$ gives the second term: $$\log p(w) = -\frac{1}{2\tau^2}\|w\|_2^2 + \text{const}$$.
        - Maximizing the sum of the two is the same as minimizing $$\frac{1}{2\sigma^2}\|y-Xw\|^2 + \frac{1}{2\tau^2}\|w\|_2^2$$.
        - Multiply through by $$2\sigma^2$$ and write $$\lambda = \sigma^2/\tau^2$$. That gives exactly the ridge loss, $$\|y-Xw\|^2 + \lambda\|w\|_2^2$$.
        - A tighter prior, meaning a smaller $$\tau^2$$, means a larger $$\lambda$$. More confidence that the weights are near zero turns directly into more shrinkage.

        </details>

      - Lasso corresponds to a Laplace prior: $$p(w) \propto \exp(-\|w\|/b)$$. Its negative log density adds an $$L1$$ term. The Laplace prior has a sharp peak at zero so it pulls small weights all the way to zero.

        <details close markdown="1">
        <summary>Where the lasso penalty comes from (Laplace prior derivation)</summary>

        - Assume a Laplace prior instead, one independent factor per weight: $$p(w) = \prod_{j=1}^d \frac{1}{2b}\exp\left(-\frac{\lvert w_j\rvert}{b}\right)$$.
        - The same argument applies: maximize $$\log p(y \mid X, w) + \log p(w)$$, using the same likelihood term as the ridge derivation above.
        - The Laplace prior's log is $$\log p(w) = -\frac{1}{b}\sum_{j=1}^d \lvert w_j\rvert + \text{const} = -\frac{1}{b}\|w\|_1 + \text{const}$$.
        - Minimizing the negative of the sum gives $$\frac{1}{2\sigma^2}\|y-Xw\|^2 + \frac{1}{b}\|w\|_1$$. Multiply through and rename constants the same way as before, and this is exactly the lasso loss, $$\|y-Xw\|^2 + \lambda\|w\|_1$$.
        - The Laplace density has a sharp peak at zero, the same kink the absolute-value loss has. That peak is what pulls small weights all the way to exactly zero, the same shape that made the Laplace-noise assumption tolerate outliers in the MAE derivation earlier.

        </details>

  2. **Geometric view**. Regularized least squares is the same as minimizing the unregularized loss subject to a budget on $$w$$'s size. The shape of that budget region is different for L1 and L2.

      <figure class="lr-fig">
      <div class="lr-fig-scroll">
      <img src="{{ site.url }}/assets/2026-07/lr-l1-l2-constraints.svg" alt="Two panels comparing L1 and L2 constraint regions against elliptical loss contours, animated shrinking inward to their first point of contact. The L1 diamond is first touched at a corner where one weight is zero. The L2 circle is first touched at a smooth point where neither weight is zero">
      </div>
      <figcaption>The ellipses are loss contours around the unregularized solution, shrinking to show the loss dropping step by step. The diamond's corners sit on the axes, so the first contact point often has a zero coordinate. The circle has no corners, so the first contact point is generically off-axis.</figcaption>
      </figure>


## Evaluation Metrics

- **RMSE** is the square root of MSE. It is in the same units as $$y$$, and it is sensitive to large errors because of the squaring.
- **MAE** is the average absolute error. It is more robust to outliers, but harder to optimize directly since it is not differentiable at zero.
- **R²** measures the fraction of variance explained:

  $$R^2 = 1 - \frac{\sum_i (y_i-\hat y_i)^2}{\sum_i(y_i - \bar y)^2}$$

  1 is a perfect fit. 0 means the model does no better than always predicting the mean. Negative means it does worse.
- **Adjusted R²** penalizes adding features that don't help. Plain R² never decreases when you add a feature, even a useless one, so it is not a reliable signal for feature selection on its own.

**Practical notes**

- Use RMSE when large errors matter more
- Use MAE when the data has outliers you don't want to dominate the metric
- Use R² to communicate overall fit
- Use adjusted R² when comparing models with different numbers of features
- Use cross-validation, with time-based splits if the data is temporal, whenever you need a generalization estimate rather than a single train-set number

## Robustness And Feature Handling

**Outliers and robust losses**
- MSE squares the error, so a single bad outlier can dominate the entire loss.
- MAE is more robust, but its gradient is undefined at zero.
- Huber loss is quadratic for small errors and linear for large ones. It combines the smoothness of MSE with the robustness of MAE:

  $$
  L_\delta(r) =
  \begin{cases}
  \frac{1}{2}r^2 & \text{for } |r| \le \delta, \\
  \delta \cdot \left(|r| - \frac{1}{2}\delta\right) & \text{for } |r| > \delta,
  \end{cases}
  $$

  where $$r$$ is the residual $$y - \hat y$$ and $$\delta$$ is the threshold that controls the switch between the two regimes. See [PyTorch Fundamentals - Week 4]({% post_url 2025-11-22-pytorch-fundamentals2 %}) for a hands-on implementation.

**Feature scaling**

- Gradient descent converges much faster when features share a similar scale. One learning rate has to work for every direction at once.
- Regularization penalizes raw weight magnitude, so an unscaled feature gets penalized unfairly relative to a scaled one.
- The normal equation does not strictly need scaling for correctness, but it does need it for numerical stability.
- Common approaches: standardization (subtract the mean, divide by the standard deviation) and min-max scaling.

**Categorical features**

- Linear regression only understands numbers. Categories need encoding first.
- One-hot encoding adds one binary column per category. Drop one column to avoid collinearity with the intercept, known as the dummy variable trap.
- Ordinal encoding only makes sense if the categories have a real order.

**Non-linear relationships**

- Linear regression is linear in the weights, not necessarily in the raw features.
- Add polynomial terms ($$x^2$$, $$x^3$$) or interaction terms ($$x_1 x_2$$) as new columns, and it is still linear regression underneath.
- This is how a linear model fits non-linear curves. It is also how a linear model overfits, since extra polynomial terms add variance.

**Coefficient interpretation**

- Each weight is the change in prediction from a one-unit change in that feature, holding every other feature fixed.
- That interpretation breaks down when features are correlated, since "holding everything else fixed" stops making sense.
- Standardizing features first makes weight magnitudes comparable across features.

## Connections

Linear regression is not an isolated technique. The same pieces reappear across the field.

- **Logistic regression.** It predicts a probability instead of a number, using $$\sigma(w^Tx+b)$$. Its gradient has the exact same shape as linear regression's: $$\nabla_w L = X^T(\hat y - y)$$, with $$\hat y$$ now the sigmoid output. Both are special cases of the generalized linear model family: pick a linear predictor, pick a link function, pick a matching noise distribution.
- **Regularization and MAP.** Covered above. Ridge is a Gaussian prior, lasso is a Laplace prior. The same MAP framing extends far beyond linear models.
- **Bias-variance and gradient descent.** Neither is specific to linear regression. Every supervised model faces the same trade-off, and most are fit with some flavor of the same optimizer.

## Quick Reference

- **Why squared error and not absolute error?** Squared error is smooth everywhere and falls out of assuming Gaussian noise. Absolute error is more robust to outliers but not differentiable at zero.
- **What if $$X^TX$$ is singular?** Usually multicollinearity, or more features than rows. Fix with ridge regularization, or by removing / combining correlated features.
- **Why does L1 zero out weights and L2 doesn't?** A Laplace prior (L1) has a sharp peak at zero and pulls weights all the way there. A Gaussian prior (L2) is smooth at zero and only shrinks weights.
- **MSE or MAE?** MSE if large errors matter more and outliers are rare. MAE if outliers are common and you want a robust metric.
- **Is linear regression still "linear" with polynomial features?** Yes. It is linear in the weights. The features themselves can be any transformation of the raw inputs.
- **Does R² ever go down when adding a feature?** No, plain R² never decreases. Use adjusted R² for a penalty on useless features.
- **When does gradient descent beat the normal equation?** When $$d$$ is large, since inverting $$X^TX$$ costs roughly $$O(d^3)$$. Or when data is streaming in and can't all fit in memory at once.
