---
id: "article:15"
---

## Why Singular Value Decomposition?

Because we encounter **Singular Value Decomposition** in the following sections of **The Elements of Statistical Learning**, a machine learning class major textbook.

- **Ridge regression**
- **Principal Component Analysis (PCA)**

## Big Picture

**Singular Value Decomposition (SVD)** is similar to **Eigendecomposition**. Eigendecomposition only works for a **square** matrix. But SVD is more general. It works on a **rectangular** matrix as well as a square matrix. People say eigendecomposition is a special case of SVD, or SVD is an extension of eigendecomposition sometimes.

The goal of SVD is to decompose a given matrix $A$ into 3 matrices.

$$
A = U \Sigma V^T
$$
$$
(m \times n) = (m \times m) (m \times n) (n \times n)
$$

$A$ is a given matrix. It can be rectangular or square.

$U$ is a **orthogonal matrix. Formally, orthogonal basis for column space** of $A$. $U$ is called **left singular vectors**.

$\Sigma$ is a **singular values diagonal matirx** of $A$. Singular values are on diagonal elements. The size of this matrix is the same as the given matrix $A$.

$V^T$ is a **orthogonal matrix. Orthogonal basis for row space** of $A$. $V^T$ is called **right singular vectors**.

We should think that SVD equation looks like a **diagonalization** that eigendecomposition produces, $A = V \Lambda V^T$. In fact, when $A$ is a square symmetric matrix, $U = V$. So $A = U \Sigma U^T$. $\Sigma$ and $\Lambda$ are both diagonal matrices.

## How to Compute $V$ in SVD

$V$ of SVD can be computed by **eigendecomposition** of $A^T A$.

Starting from the SVD equation, 

$$
A = U \Sigma V^T
$$

**Left-multiply** it by $A^T$

$$
A^T A = (U \Sigma V^T)^T U \Sigma V^T
$$

By **LIVE EVIL rule**,

$$
A^T A = V^{TT} \Sigma^T U^T U \Sigma V^T
$$

Becuase $U$ is an **orthogonal matrix**, meaning $U^T = U^{-1}$

$$
A^T A = V^{TT} \Sigma^T U^{-1} U \Sigma V^T
$$

Because $A^{-1} A = I$,

$$
A^T A = V^{TT} \Sigma^T I \Sigma V^T
$$

Because transposing a transposed matrix goes back to the original matrix,

$$
A^T A = V \Sigma^T \Sigma V^T
$$

Because $\Sigma$ is a **diagonal matrix**, $\Sigma^T = \Sigma$. And powers of a diagonal matrix is powers of each diagonal element in a matrix,

$$
A^T A = V \Sigma^2 V^T
$$

Because $A^T A$ is a square and the right side is a **diagonalization** form, this equation can be read as **eigendecomposition** of $A^T A$. So $V$ is **eigenvector** of $A^T A$ and $\Sigma^2$ is **eigenvalue** of $A^T A$. $V$ can be computed by eigendecomposition of $A^T A$.

## How to Compute $U$ in SVD

$U$ of SVD can be computed by **eigendecomposition** of $A A^T$.

Starting from the SVD equation, 

$$
A = U \Sigma V^T
$$

**Right-multiply** it by $A^T$

$$
A A^T = U \Sigma V^T (U \Sigma V^T)^T
$$
$$
A A^T = U \Sigma V^T V^{TT} \Sigma^T U^T
$$
$$
A A^T = U \Sigma V^T V \Sigma^T U^T
$$
$$
A A^T = U \Sigma V^{-1} V \Sigma^T U^T
$$
$$
A A^T = U \Sigma I \Sigma^T U^T
$$
$$
A A^T = U \Sigma \Sigma^T U^T
$$
$$
A A^T = U \Sigma \Sigma U^T
$$
$$
A A^T = U \Sigma^2 U^T
$$

So to compute $U$, apply **eigendecomposition** to $A A^T$, and the **eigenvector** is $U$.

$U$ can be also computed by **eigendecomposition** of $A^T A$ and by $V$ and $\Sigma^2$. Going back to SVD formula,

$$
A = U \Sigma V^T
$$

Right-multiply it by $V$

$$
A V = U \Sigma V^T V
$$

Because $V$ is an orthogonal matrix, $V^T = V^{-1}$

$$
A V = U \Sigma V^{-1} V
$$

Because $V^{-1} V = I$

$$
A V = U \Sigma I
$$
$$
A V = U \Sigma
$$

By looking at each vector and value $v_i, u_i, \sigma_i$ in $V, U, \Sigma$,

$$
A v_i = u_i \sigma_i
$$
$$
u_i \sigma_i = A v_i
$$
$$
u_i = (A v_i) / \sigma_i
$$

So after getting $v_i$ and $\sigma_i$ by eigendecomposition of $A^T A$, we can compute $u_i$ by that division.

## How to Interpret Singular Values in $\Sigma$

**Singular values** are scale-dependent, meaning you cannot compare the singular values from one matrix with the singular values from another matrix by the magnitudes of each singular value, because the scale of the singular values depend on the numbers in the two matrices. 

When you scale up the matrix for SVD, singular values are also scaled up by the same amount. $U$ and $V$ stay intact, because both are kept being normalized.

Singular values will be interpretable after normalizing it. So singular values will be percentage.

1. Sum all the singular values
2. Divide each singular value by the sum

When you take the maximum of the normalized singular value, 
- If the max is high, we can interpret that the given matrix is simple.
- If the max is low, the matrix is complicated made by lots of information, distributed along different directions.

## SVD vs. Eigendecomposition for Square Symmetric Matrix

Here matrix needs to be **square** because **Eigendecomposition** is only for square matrix and we can compare SVD and Eigendecomposition.

For a symmetric matrix, SVD and Eigendecomposition produce the **same result**, except there could be sign flip in eigenvectors.

## Singular Value vs. Eigenvalue

For symmetric matrix, singular value and eigenvalue are the same, but non-symmetric square matrix, singular value and eigevalue are not the same.
1. Eigenvalue of $A^T A$ = Squared singular value of $A$ (where $A^T A$ is a square symmetric matrix)
2. Eigenvalue of $A^T A$ = Singular value of $A^T A$ (where $A^T A$ is a square symmetric matrix)
3. Eigenvalue of $A$ $\neq$ Singular value of $A$ (where $A$ is a square matrix)

## Low-Rank Approximation by SVD

The SVD equation is,

$$
A = U \Sigma V^T
$$
$$
(m \times n) = (m \times m) (m \times n) (n \times n)
$$

Low-rank approximation is to only use a part of singular vectors and singular values (from 1st vector and value to **k**th vector and value) to recontruct the original matrix. Hopefully we reduce lots of data, but don't lose the information (or meaning) of the data.

$$
A = U \Sigma V^T
$$
$$
(m \times n) = (m \times k) (k \times k) (k \times n)
$$

So after reducing the size of matrices from SVD, still apply the same SVD equation for matrix multiplicationm, and we can approximate the original matrix.

## SVD of Square Matrix

When a given matrix is square in SVD,
$$
A = U \Sigma V^T
$$
$$
(m \times m) = (m \times m) (m \times m) (m \times m)
$$

In such case, $U V^T$ is possibe. Because $U$ and $V$ are orthogonal matrices, $U V^T$ is a stack of effects of just changing orientation (rotating) of a vector 2 times (meaning no stretching),

$$
norm(U) = 1
$$
$$
norm(V) = 1
$$
$$
nomr(U V^T) = 1
$$

But we have the different matrix multiplication results

$$
U U^T = I
$$
$$
V V^T = I
$$
$$
U V^T \neq I
$$
$$
U V^T (U V^T)^T = I
$$

## SVD of Orthogonal Matrix

Given an orthogonal matrix $Q$,

$$
Q Q^T = I
$$

**Eigenvalues** of an identity matrix has all 1s. **SVD** of $Q$ is **eigendecomposition** of $Q^T Q$, **singular values** of $Q$ is **eigenvalues** of $Q^T Q$. So singular values of SVD of $Q$ are all 1.

## Moore-Penrose Pseudoinverse by SVD

**Pseudoinverse** is approximated inverse of non-invertible matrix. **Moore-Penrose pseudoinverse** is not the only way to compute pseudoinverse, but it's the most common way.

Inverse in terms of **SVD** of a full-rank matrix $A$ is,

$$
A = U \Sigma V^T
$$
$$
A^{-1} = (U \Sigma V^T)^{-1}
$$

In the right-hand side, each matrix is invertible, because $U$ and $V$ are orthogonal matrix (invertible), and $\Sigma$ is a diagonal matrix with all diagonal elements non-zero, because we assume the given matrix $A$ is a full-rank. And by **LIVE EVIL rule**,

$$
A^{-1} = V^{-T} \Sigma^{-1} U^{-1}
$$

Because orthogonal matrix is $B^{-1} = B^T$, so $B^{-T} = B^{TT} = B$,

$$
A^{-1} = V \Sigma^{-1} U^T
$$

So from SVD perspective, inverse of the given matrix is just swap $U$ and $V$ and get the inverse of diagonal matrix with **singular values**. Inverse of a diagonal matrix $\Sigma$ is,

$$
\Sigma =
\begin{bmatrix}
a & 0 & 0\\
0 & b & 0\\
0 & 0 & c
\end{bmatrix}
$$
$$
\Sigma^{-1} =
\begin{bmatrix}
1/a & 0 & 0\\
0 & 1/b & 0\\
0 & 0 & 1/c
\end{bmatrix}
$$

In **pseudoinverse**, inverse of diagonal matrix is defined by taking reciprocal of non-zero elements, and with superscript $*$

$$
\Sigma =
\begin{bmatrix}
a & 0 & 0\\
0 & b & 0\\
0 & 0 & 0
\end{bmatrix}
$$
$$
\Sigma^{*} =
\begin{bmatrix}
1/a & 0 & 0\\
0 & 1/b & 0\\
0 & 0 & 0
\end{bmatrix}
$$

And just do the same inverse of SVD matrices

$$
A = U \Sigma V^T
$$
$$
A^{*} = (U \Sigma V^T)^{*}
$$
$$
A^{*} = V^{-T} \Sigma^{*} U^{-1}
$$
$$
A^{*} = V \Sigma^{*} U^T
$$

So $A^{*} A$ should be close to an identity matrix.

## Left Inverse by SVD

The matrix $A^T A$ is an invertible $m \times m$ symmetric matrix, so $(A^T A)^{-1} A^T A = I$. We say $(A^T A)^{-1} A^T$ is **left inverse** of $A$. Left inverse is only possible when $A$ is a full-rank.

But when $A$ is a reduced-rank, if we convert $A$ into SVD form, we can compute **Moore-Penrose pseudoinverse**. When $A$ is a tall matrix and its SVD is $U \Sigma V^T$, **left inverse** can be computed as $V \Sigma U^T$.

Because of SVD, we have,

$$
A = U \Sigma V^T
$$

Left inverse of $A$ is,

$$
(A^T A)^{-1} A^T
$$

Substitute SVD to the equation by $A = U \Sigma V^T$,

$$
(A^T A)^{-1} A^T = ((U \Sigma V^T)^T U \Sigma V^T )^{-1} (U \Sigma V^T)^T
$$

By **LIVE EVIL rule**,

$$
(A^T A)^{-1} A^T = (V^{TT} \Sigma^T U^T U \Sigma V^T)^{-1} V^{TT} \Sigma^T U^T
$$

Because transpose of a transposed matrix is just an original matrix, $B^{TT} = B$, and transpose of a diagonal matrix just remain the same diagonal matrix, $D^T = D$,

$$
(A^T A)^{-1} A^T = (V \Sigma U^T U \Sigma V^T)^{-1} V \Sigma U^T
$$

For orthogonal matrix $U$, $U^T = U^{-1}$, and $U^{-1} U = I$

$$
(A^T A)^{-1} A^T = (V \Sigma I \Sigma V^T)^{-1} V \Sigma U^T
$$
$$
(A^T A)^{-1} A^T = (V \Sigma \Sigma V^T)^{-1} V \Sigma U^T
$$

Becuase matrix multiplication of diagonal matrix is just take powers of diagonal elements, $D D = D^2$,

$$
(A^T A)^{-1} A^T = (V \Sigma^2 V^T)^{-1} V \Sigma U^T
$$

By **LIVE EVIL rule** again but to inverse this time

$$
(A^T A)^{-1} A^T = V^{-T} \Sigma^{-2} V^{-1} V \Sigma U^T
$$

Because for orthogonal matrix, $B^{-1} = B^{T}$, so $V^{-T} = V^{TT} = V$,

$$
(A^T A)^{-1} A^T = V \Sigma^{-2} V^{-1} V \Sigma U^T
$$

Because of $B^{-1} B = I$ again, 

$$
(A^T A)^{-1} A^T = V \Sigma^{-2} I \Sigma U^T
$$
$$
(A^T A)^{-1} A^T = V \Sigma^{-2} \Sigma U^T
$$

In $\Sigma^{-2} \Sigma$, $1/a^2 \times a = 1/a$ in diagonal elements, 

$$
(A^T A)^{-1} A^T = V \Sigma^{-1} U^T
$$

This form is the same as the inverse of a matrix $A$ by SVD

$$
A = U \Sigma V^T
$$
$$
A^{-1} = (U \Sigma V^T)^{-1} = V \Sigma^{-1} U^T
$$

## Condition Number by SVD

**Condition number** $\kappa$ is defined as the ratio of the largest **singular value** $\sigma_{max}$ and the smallest $\sigma_{min}$ like below,

$$
\kappa = \frac{\sigma_{max}} {\sigma_{min}}
$$

Condition number of a **singluar matrix** is not defined, because singular matrix has at least one 0-valued singular value, so we cannot do division by 0. As a matrix gets closer to a singular matrix, minimum singular value gets smaller, so the divisor gets smaller, so the condition number get larger.

By condition number, people say,
- **ill-condition** when condition number is **large**
- **well conditioned** when condition number is **small**

But ill-condition does not mean there's something wrong with a given matrix. Informative matrix could have a large condition number (so called ill-condition), and a random noisy non-informative matrix could have a small condition number (called well condition even if there's no information). So we cannot make any conclusion about a matrix just by looking at the condition number.

In statistics, condition number is used as an indicator of the reliability and sensitivity of a matrix. A matrix with a large condition number is more sensitive to a small perturbation.

## $A^T A$ vs. $A A^T$

- If $u$ is a **left singular vector** of $A^T A$, and if $\sigma$ is the corresponding singular value, $A v$ is a **right singular value** of $A A^T$ with the same $\sigma$.
- If $u$ is a **left singular vector** of $A A^T$, and if $\sigma$ is the corresponsing singular value, $A^T v$ is a **right singular value** of $A^T A$ with the same $\sigma$.

Start from SVD equation,

$$
A^T A = U \Sigma V^T
$$

By focusing on a single vector and value, and just think about $A^T A$ will be made by layers

$$
A^T A = u \sigma v^T
$$

Right-multiply both sides with $v$

$$
A^T A v = u \sigma v^t v
$$

Because $v$ is a vector in an orthogonal matrix $V$

$$
A^T A v = u \sigma 1
$$

$$
A^T A v = u \sigma
$$

When we are given $A^T A$, it's a square symmetric matrix. In that case, SVD of the square symmetric matrix produces the same $U$ and $V$.

$$
A^T A v = v \sigma
$$

Left-multiply both sides by $A$

$$
A A^T A v = A v \sigma
$$

Replace $A v$ with $w$

$$
A A^T w = w \sigma
$$
$$
A A^T w = \sigma w
$$

This equation is **eigendecomposition** with **eigenvalue** $\sigma$ and **eigenvector** $w$, so $A v$ is a right singular value of $A A^T$
