---
layout: post
title: "PyTorch Fundamentals - Week 5"
date: "2025-11-29"
categories: DL
---

Brushing up on my PyTorch skills every week. Starting from scratch. Not in a hurry. The goal is to follow along [TorchLeet](https://github.com/Exorust/TorchLeet) and go up to [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) or [karpathy/nanochat](https://github.com/karpathy/nanochat). Previously,

1. [PyTorch Fundamentals - Week 4]({% post_url 2025-11-22-pytorch-fundamentals2 %})
2. [PyTorch Fundamentals - Week 1, 2, & 3]({% post_url 2025-11-10-pytorch-fundamentals %})

Now, summary of the week 4.

- Linear Regression through a custom DNN with a non-linearity
    - A `nn.Module` subclass that used a nn.Sequential to have the dense linear layer.
        ```py
        dense = nn.Sequential(
            nn.Linear(input_dim, dense_dims[0]),
            nn.ReLU(),
            nn.Linear(*dense_dims),
            nn.ReLU(),
            nn.Linear(dense_dims[1], output_dim),
        )
        ```
- Learnt about [`nn.Sequential`](https://docs.pytorch.org/docs/stable/generated/torch.nn.Sequential.html) vs `nn.Module`.
    - `nn.Sequential` is a subclass of `nn.Module`.
    - It's a convinient way to chain functions.
    - Think: replacing `self.l1(self.l2(self.l3(x)))` with `self.layer123(x)` where `layer123` is a `nn.Sequential` of `l1`, `l2`, and `l1`.
    - Also read: [What is difference between nn.Module and nn.Sequential](https://stackoverflow.com/q/68606661/2650427)
- Tried three different dense layer hidden unit config with each of the below loss functions:
    1. `nn.MSELoss()`
    2. `HuberLoss()` - created [last week]({% post_url 2025-11-22-pytorch-fundamentals2 %})
    3. `nn.L1Loss()`

    Dense layer hidden unit variants: `(3, 7)`, `(4, 8)`, `(5, 9)`.
- Huber Loss threw MSE Loss and L1 Loss out of the water. (Figure from TensorBoard.)
    <figure class="image">
    <img src="{{ site.url }}/assets/2025-11/dnn_loss.png" alt="" style="text-align: center; margin: auto" width="300">
    <!-- <figcaption style="text-align: center">Figure 1:</figcaption> -->
    </figure>
- TensorBoard at work
    - I was running a remote training pipeline with tensorboard logging. This pipline dumps the logs on S3.
    - The pipeline was failing with the following error: `File system scheme 's3' not implemented`.
    - Solution:
        - After multiple loops of [add + commit + push + job run] found the [solution](https://stackoverflow.com/a/71628326/2650427): `pip install tensorflow-io`. This is not the end of the solution.
        - The [very last comment](https://github.com/tensorflow/tensorboard/issues/5480#issuecomment-2251363802) on the [tensorboard github issue](https://github.com/tensorflow/tensorboard/issues/5480) gives the final trick: Add `import tensorflow_io` to the pipeline even if not using it anywhere.

<br>