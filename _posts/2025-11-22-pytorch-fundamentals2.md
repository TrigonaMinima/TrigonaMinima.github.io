---
layout: post
title: "PyTorch Fundamentals - Week 4"
date: "2025-11-22"
categories: DL
---


Brushing up on my PyTorch skills every week. Starting from scratch. Not in a hurry. The goal is to follow along [TorchLeet](https://github.com/Exorust/TorchLeet) and go up to [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) or [karpathy/nanochat](https://github.com/karpathy/nanochat). Previously,

1. [PyTorch Fundamentals - Week 1, 2, & 3]({% post_url 2025-11-10-pytorch-fundamentals %})

Now, summary of the week 4.


- Custom Loss function: Huber Loss
    - A `torch.nn.Module` class having with `forward()` method to compute the loss.
    - Huber Loss is defined as:

        $$
            L_{\delta}(y, \hat{y}) =
            \begin{cases}
            \frac{1}{2}(y - \hat{y})^2 & \text{for } |y - \hat{y}| \leq \delta, \\
            \delta \cdot (|y - \hat{y}| - \frac{1}{2} \delta) & \text{for } |y - \hat{y}| > \delta,
            \end{cases}
        $$

        where:
        - $$y$$ is the true value,
        - $$\hat{y}$$ is the predicted value,
        - $$\delta$$ is a threshold parameter that controls the transition between L1 and L2 loss.
    - More details about the Huber Loss
- Some custom losses in Keras and PyTorch: [Loss Function Library - Keras & PyTorch](https://www.kaggle.com/code/bigironsphere/loss-function-library-keras-pytorch/notebook)
- Used the Linear Regression model to test the custom loss.
- Error 1: `RuntimeError: grad can be implicitly created only for scalar outputs`
    - Reason: the `forward()` function was returning a tensor with lenght > 1. Got the hint from [PyTorch forums](https://discuss.pytorch.org/t/loss-backward-raises-error-grad-can-be-implicitly-created-only-for-scalar-outputs/12152).
    - Fix: returned `loss.mean()` instead of `loss`.
- Error 2: All the losses were `nan`: this was a genuine bug in my code.
- Implementation approach 1: Use masks (my approach)
    ```python
    def forward(self, y_pred, y_true):
        error = torch.abs(y_true - y_pred)

        flag1 = error <= self.d
        flag2 = 1 - error

        l2_loss = 0.5 * error**2 * flag1
        l1_loss = self.d * (error - 0.5 * self.d) * flag2
        loss = l2_loss + l1_loss
        return loss.mean()
    ```
- Implementation approach 2: Use [`torch.where()`](https://docs.pytorch.org/docs/stable/generated/torch.where.html) (solution provided in [TorchLeet](https://github.com/Exorust/TorchLeet/blob/main/torch/basic/custom-loss/custom-loss_SOLN.ipynb))
    ```python
    def forward(self, y_pred, y_true):
        error = torch.abs(y_true - y_pred)

        condition = error <= self.d
        loss = torch.where(condition, 0.5 * error**2, self.d * (error - 0.5 * self.d))
        return loss.mean()
    ```
- Turns out, `torch.where()` is the most optimised way of doing this. It is vectorised and GPU-friendly. It is also a cleaner implementation of the same logic. Masking will require extra memory and extra operations (two multiplications, and one addition).
- Used tensorboard to visualise the training results.
- Read up more on [`optimizer.zero_grad()`](https://docs.pytorch.org/docs/stable/generated/torch.optim.Optimizer.zero_grad.html#torch.optim.Optimizer.zero_grad).
    - PyTorch accumulates gradients by default. The `loss.backward()` will add to the previous gradients (can be accessed by `weight.grad`).
    - If we don't reset the gradients using `zero_grad()`, the new gradient will be a combination of the old and the newly-computed gradient. Since the old gradient was already used to update the model in the last iteration, the combined gradient will point in a different direction than the minimum (or maximum.) [[ref](https://stackoverflow.com/q/48001598/2650427)]
- **Q:** When should we use `zero_grad()`? **A:** When we want gradient accumulation on purponse.
- **Q:** When do we want gradient accumulation on purpose? **A:** In the following scenarios:

    1. Large batch size with limited gpu memory. Split the batch into mini-batches. Accumulate gradients for all the mini-batches and then run `optimizer.step()`. Used during training on smaller GPUs.
    2. Multiple loss components before a single update. Useful for multi-task learning. Losses that require multiple passes.
    3. Parallel training. When model is split across devices -> accumulate the gradients across the micro-batches and then update parameters once.
    4. Training with noisy gradients. Accumulate over multiple steps with noisy gradients to smooth the gradients before updating.
