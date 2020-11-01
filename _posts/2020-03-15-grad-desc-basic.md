---
layout: post
title: "Gradient Descent"
date: 2020-03-15
categories: ML
annotation: Gradient-Descent
---

Recently, I realised that I have used majority of classical machine learning algorithms using scikit, but I haven't actually implemented them myself. I know the basics of the algorithms, but were I to implement them, I'd most likely fail. There are always a lot *gotchas*. So, I am going to start with it now. The first stop is Gradient Descent.

Gradient Descent is a method of reaching a minima of a function. It's a method to find the minima (global or local) of a given function. It is guaranteed to find a minima for convex functions. General algorithm is given a function to minimize, you take a step towards the negative of the gradient (or slope) of the function. If you keep doing it then eventually you'll reach a minima. It works because when we move in the negative direction of the gradient, we'll take the fastest route to reach the lowest value of the function. Watch this [Gradient Descent](https://youtu.be/rIVLE3condE) video by Andrew NG to get a more intuitive understanding of the process.

```
1. Until convergence, repeat
2. Take gradient descent step for all variables
3. Update the variables with the new variables
```

For example, if we have a function, f(x,y) then the Gradient Descent will operate as follows

```
1. Until f(x,y) is minimum, repeat
2. Gradient descent step
    1. x_new obtained after gradient descent step for x
    2. y_new obtained after gradient descent step for y
4. update x and y with x_new and y_new
```

The number of steps taken to reach the minima depends on learning rate ($$\alpha$$). The larger the value of $$\alpha$$, the bigger the steps will be and it'll find the minima quickly. Opposite is also true: smaller the $$\alpha$$, the smaller the steps will be and it'll take more time to reach minima. You have to find a balance though, because of a bigger $$\alpha$$, gradient descent might fail to converge and a smaller $$\alpha$$ will find a more accurate minima, but at the same time will take more time to converge. The following gradient descent step pseudo code shows how the $$\alpha$$ is used.

```
1. Take variable and alpha as input
2. new_variable = variable - alpha * gradient
3. return new_variable
```

Usually, instead of checking for convergence we use number of iterations to end the gradient descent loop. Number of iterations parameter tells the gradient descent how many steps to go. There might be cases where it is caught in an infinite loop: either it's diverging or minima is at infinity. So to prevent that from happening gradient descent will stop after a set number of iterations.

## Gradient Descent Parameters

1. Learning Rate ($$\alpha$$)
2. Number of Iterations

## Implementation

Generally, the scenario is to decide on a hypothesis function. This hypothesis function will have some parameters for which we want the optimal values according to our training data. To find the optimal values, we'll have a cost function which evaluates the hypothesis for a given set of parameters and gives us a score. We have to minimize this score to reach the optimal values of the parameters to be used in the hypothesis.

Lets first implement the gradient descent loop. We take the following function parameters:

- `x`: input data
- `y`: target column
- `thetas`: the parameters to be optimized
- `alpha`: learning rate
- `num_iters`: number of iterations to end the gradient descent loop after

We first add a column of ones in `x` as a bias unit. Then we make empty arrays to hold the historical weights and cost. Now the loop starts; we run it until we reach the convergence or finish all the `num_iters` iterations. Within the loop, we call the `grad_desc_step` function to update the `thetas`. Once we get the updates, we save them and then move on to the next iteration if not already converged.

{% highlight python linenos %}
def grad_desc(x, y, thetas, alpha=0.01, num_iters=100):
    """
    Gradient descent loop
    """
    # adds bias (=1) column to the input data
    x = np.hstack((np.ones((x.shape[0], 1)), x))

    # empty arrays to store thetas and costs
    theta_updates = np.zeros((num_iters, thetas.shape[1]))
    costs = np.zeros(num_iters)

    theta_updates[0] = thetas[:, 0]
    costs[0] = cost_func(x, y, thetas)

    # gradient descent loop
    for i in range(1, num_iters+1):
        thetas = grad_desc_step(x, y, thetas, alpha)
        cur_cost = cost_func(x, y, thetas)

        theta_updates[i] = thetas
        costs[i] = cur_cost

        if abs(costs[i] - costs[i-1]) < 1e-3:
            break

    return theta_updates[:i-1,:], costs[:i-1]
{% endhighlight %}

Now we'll discuss the gradient descent step. We assume we have a function which calculates the gradient of the cost function - `cost_func_grad`. This function takes `x`, `y` and `thetas` as parameters to calculate the gradient values for the given `thetas`. We use this function to get the gradient and then update the `thetas` by moving towards the negative of the gradient. The step is governed by the `alpha` or learning rate. We return the updated `thetas`.

{% highlight python linenos %}
def grad_desc_step(x, y, thetas, alpha):
    """
    Updates the parameters once.
    """
    # Calculate the gradient
    grad = cost_func_grad(x, y, thetas)

    # updating the parameters
    thetas = thetas - alpha * grad
    return thetas
{% endhighlight %}

So this is the generic implementation of the gradient descent. In the future posts, I'll use this same function to implement linear and logistic regression.
