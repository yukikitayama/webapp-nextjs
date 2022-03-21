---
id: "article:14"
---

## Why Does Eigendecomposition Matter?

It appears in the following sections of **The Elements of Statistical Learning**, a textbook used in machine learning classes, to explain how to compute parameters in statistical methodologies, so that I think understanding it will make us better understand statistics. 

- **Principal Component Analysis (PCA)**
- **Ridge Regression**
- **Linear Discriminant Analysis (LDA)**

## Big Picture

**Eigendecomposition** is a way to break down a given matrix into scalar (number) and vector (list of numbers). The vectors represent the special direction of the given matrix. The scalars represent how much special the corresponding vector is. The scalar is called **eigenvalue**, and the vector is **eigenvector**.

## Eigenvalue

Eigenvalue is something we need to get eigenvector, tells us the scale of the eigenvector, and also used as how much important a certain thing is from the data in statistics.

### How to Compute Eigenvalue

We start with the following equation.

$$
A v = \lambda v
$$

$A$ is a given **square** matrix. We are provided this data.

$v$ is a vector. In eigendecomposition, it should not be a 0 vector, so there need to be at least one non-zero number in the vector.

$\lambda$ is a scalar, a number. 

That equation is saying that matrix multiplication with a vector can be expressed as just a scalar element-wise multiplication to the vector. We could have a huge size of the matrix $A$. For example, if $A$ is 10x10 matrix, you have 100 numbers in the matrix, and you need to use all of them to multiply with $v$. But $\lambda$ is just one number. It's saying by using a single number, we can do the same thing.

In linear algebra, $A v$ means that we apply $A$ to $v$. Typically $A$ is changing $v$. The change results in changing the direction of $v$ and stretching or shrinking the $v$. But $\lambda v$, a single number, is applied to $v$. This is only stretching or shrinking $v$. So $A v = \lambda v$ says that we are only changing the length of $v$, but we are not changing the direction of $v$.

We wanna compute $\lambda$ so move it to the left of the equation.

$$
A v = \lambda v
$$
$$
A v - \lambda v = 0
$$
$$
(A - \lambda I) v = 0
$$

We cannot do $(A - \lambda) v$, because $A$ is a matrix and $\lambda$ is a scalar. To make element-wise subtraction possible, we need to make the shape of $A$ and $\lambda$ equal by multiplying identity matrix. So $A$ is mxm, and $\lambda I$ is also mxm.