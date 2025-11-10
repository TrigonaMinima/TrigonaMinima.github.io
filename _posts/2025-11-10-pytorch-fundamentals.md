---
layout: post
title: "PyTorch Fundamentals - Week 1, 2, & 3"
date: "2025-11-10"
categories: DL
---


Brushing up on my PyTorch skills every week. Starting from scratch. Not in a hurry. The goal is to follow along [TorchLeet](https://github.com/Exorust/TorchLeet) and go up to [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) or [karpathy/nanochat](https://github.com/karpathy/nanochat). Summary of the 1st three weeks.


### Week 1

- Create a Linear Regression model.
    - `torch.nn.Linear` to define a learnable model.
    - `forward()` for forward pass.
    - `model.parameters` containing all the learned weights and also passed to the optimizer (`SGD`, `Adam`, etc.)
    - Use `torch.no_grad()` during inferencing.
- Log the training logs to TensorBoard. (not a part of the TorchLeet repo)
    - `SummaryWriter` from `torch.utils.tensorboard`. Tensorflow can directly use a callback inside the fit function to push all the relevant logs. The `SummaryWriter` gives a fine-grained control to log anything.
    - `add_scalar()` to log the training loss.
    - `add_graph()` to log the graph itself.
    - Load the Jupyter tensorboard extension so that we don't have to leave the notebook to look at the logs and and pretty plots.

        ```sh
        %load_ext tensorboard
        ```

    - Load the tensorboard UI inside the notebook.

        ```sh
        %tensorboard --logdir PATH_TO_LOG_DIR
        ```


### Week 2

- Create a Dataset
    - `Dataset` class from `torch.utils.data`.
    - Create a subclass of `Dataset` for my specific dataset. Added `data`, `X` and `y` attributes to the class.
    - Since we will iterate through the rows of this dataset, defined `__len__` and `__getitem__` functions. These overloaded functions enable code like `len(dataset)` and `dataset[i]`, respectively.
- Dataloader
    - `Dataset` only defines the dataset. `Dataloader` from `torch.utils.data` creates an iterator. It also brings other capabilities like batching and shuffling. Eg:

        ```python
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
        ```

    - We can run a `for` loop on this `dataloader` now.
- Good intro to the topic from PyTorch - [Datasets and DataLoaders](https://docs.pytorch.org/tutorials/beginner/basics/data_tutorial.html).
- Trained the Linear Regression model using the dataloader. Faced some issues due to `dtype` mismatches - used `torch.float32` everywhere to fix it.
- The exercise only asked for a single column dataset. Played around with a dataset with multiple columns.
- Use tensorboard for all the logging.


### Week 3

- Two types of activation functions -- with learnable parameters and without.
- Activation function with learnable parameters will require a `nn.Module` subclass. It is required to do the gradient calculations using `forward` and `backward` functions and get the final trained weights.
- Created a custom activation *without* learnable parameters: $$\text{tanh}(x) + x$$.
- Updated the Linear Regression class to have the final output go through $$\text{tanh}(x) + x$$ using `torch.tanh()`.

    ```python
    return self.custom_activation(self.linear*(x))
    ```

- This [SO answer](https://stackoverflow.com/a/57013056/2650427) talks about how to write a custom activation function in different scenarios: non-learnable, learnable, learnable with PyTorch functions, and  learnable without PyTorch functions.
- Also learned about `torch.nn.Parameter` and `torch.nn.Variable`.
- Kept using Tensorboard for all the logging.

<br>

Next 2 weeks: Custom Loss Function (Huber Loss) and Deep Neural Network


------
