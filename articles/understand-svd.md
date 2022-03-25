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
