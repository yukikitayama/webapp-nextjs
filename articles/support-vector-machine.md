---
id: "article:16"
---

## Concept

In **binary classification**, where y is labelled as **0 for negative** and **1 for positive**, $\theta$ is parameter column vector, and $x$ is data column vector, **optimization objective** of SVM is the following.

$$
\underset{\theta}{\min} C \sum_{i = 1}^{n} \left[ y^{(i)} cost_1 (\theta^T x^{(i)}) + (1 - y^{(i)}) cost_0 (\theta^T x^{(i)}) \right] + \frac{1}{2} \sum_{i = 1}^{p} \theta_j^2
$$

This math takes the form of,

$$
\min \left( C \times \text{Loss} + \text{Regularization} \right)
$$

For $cost(\theta^T x)$,

- $cost_1(\theta^T x^)$ is a cost function when $y = 1$. When $\theta^T x \ge 1$  (not just $\ge$ 0), cost is 0. When $\theta^T x \le 1$, cost linearly increases as $\theta^T x$ gets smaller.
- $cost_0(\theta^T x^)$ is a cost function when $y = 0$. When $\theta^T x \le -1$  (not just $\le$ 0), cost is 0. When $\theta^T x \ge -1$, cost linearly increases as $\theta^T x$ gets larger.

By $z = \theta^T x$ in the below image,

![Cost function](/images/article/support-vector-machine/svm_cost_function.png)