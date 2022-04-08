---
id: "article:16"
---

## Concept

In **binary classification**, where $y$ is labelled as **0 for negative** and **1 for positive**, $\theta$ is parameter column vector, and $x$ is data column vector, **optimization objective** of SVM is the following.

$$
\underset{\theta}{\min} C \sum_{i = 1}^{n} \left[ y^{(i)} cost_1 (\theta^T x^{(i)}) + (1 - y^{(i)}) cost_0 (\theta^T x^{(i)}) \right] + \frac{1}{2} \sum_{i = 1}^{p} \theta_j^2
$$

This math takes the form of,

$$
\min \left( C \times \text{Loss} + \text{Regularization} \right)
$$

For $cost(\theta^T x)$,

- $cost_1(\theta^T x)$ is a cost function when $y = 1$. When $\theta^T x \ge 1$  (not just $\ge$ 0), cost is 0. When $\theta^T x \le 1$, cost linearly increases as $\theta^T x$ gets smaller.
- $cost_0(\theta^T x)$ is a cost function when $y = 0$. When $\theta^T x \le -1$  (not just $\le$ 0), cost is 0. When $\theta^T x \ge -1$, cost linearly increases as $\theta^T x$ gets larger.

By $z = \theta^T x$ in the below image,

![Cost function {1000x500}](/images/article/support-vector-machine/svm_cost_function.png)

In **An Introduction to Statistical Learning (ISL)**, where $y$ is labelled as **-1 for negative** and **1 for positive**, the SVM optimization objective is expressed as,

$$
\underset{\beta}{\min} \{ \sum_{i = 1}^{n} \max [0, 1 - y_i f(x_i)] + \lambda \sum_{j = 1}^{p} \beta_j^2 \}
$$

This math takes the form of,

$$
\min \left( \text{Loss} + \lambda \times \text{Regularization} \right)
$$

$\max [0, 1 - y_i f(x_i)]$ works the same as the cost functions $cost_1(\theta^T x)$ and $cost_0(\theta^T x)$.

- When $y = 1$, $\max [0, 1 - y_i f(x_i)]$ produces 0 if $f(x_i) \ge 1$. Loss is $\ge 0$ when $f(x_i) \le 1$ and increase as $f(x_i)$ gets smaller.  
- When $y = -1$, $\max [0, 1 - y_i f(x_i)]$ produces 0 if $f(x_i) \le -1$. Loss is $\ge 0$ when $f(x_i) \ge -1$ and increase as $f(x_i)$ gets larger.

This loss functions is known as **hinge loss**.

$$
L(X, y, \beta) = \sum_{i = 1}^{n}\max [0, 1 - y_i \beta x_i]
$$

By $z = \beta^T x$ in the below image,

![Hinge loss {1000x500}](/images/article/support-vector-machine/svm_hinge_loss.png)

To see the relationship with logistic regression, the optimization objective of logistic regression that we wanna minimize is the followin. $n$ is the number of data. $p$ is the number of features.

$$
\underset{\theta}{\min} \frac{1}{n} \left[ \sum_{i = 1}^{n} y^{(i)} \left(- \log h_{\theta} (x^{(i)}) \right) + (1 - y^{(i)}) \left( - \log (1 - h_{\theta} (x^{(i)})) \right) \right] + \frac{\lambda}{2n} \sum_{j = 1}^{p} \theta_j^2
$$

$h_{\theta}(x)$ is the igmoid function used in logistic regression.

$$
h_{\theta}(x) = \frac {1} {1 + e^{-\theta^T x}}
$$

- When $y = 1$, we want $h_{\theta}(x) \approx 1$ ($h_{\theta}(x)$ to be close to $1$), we want $e^{-\theta^T x}$ small, we want $\theta^T x \gg 0$ ($\theta^T x$ is much larger than 0).
- When $y = 0$, we want $h_{\theta}(x) \approx 0$ ($h_{\theta}(x)$ to be close to $0$), we want $e^{-\theta^T x}$ large, we want $\theta^T x \ll 0$ ($\theta^T x$ is much smaller than 0).

In below sigmoid function visualization, $z = \theta^T x$

![Sigmoid function {640x480}](/images/article/support-vector-machine/svm_sigmoid_function.png)