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

People say that, in $(A - \lambda I) v = 0$, a vector $v$ is in the **null space** of a matrix ($A$ shifted by $-\lambda I$), because it's producing 0 vector. $B v = 0$ means $v$ is in the **null space** of a matrix $B$.

In eigendecomposition, we exclude a case where $v$ is a vector of all 0s. $v$ needs to have at least one element non-zero. So to produce 0 at the right side of the equation, $(A - \lambda I)$ must be a **singular matrix** (**reduced rank matrix**). If $(A - \lambda I)$ is a singular matrix, it means that a **determinant** of $(A - \lambda I)$ is 0.

$$ |A - \lambda I| = 0 $$

In $(A - \lambda I) v = 0$, $0$ is a 0 vector, but in $|A - \lambda I| = 0$, $0$ is a scalar 0. $|A - \lambda I| = 0$ is called **characteristic equation**.

If $A$ is a singular matrix (reduced-rank matrix, i.e. a matrix where one column can be a combination of other columns), at least one eigenvalue $\lambda$ is 0.

## Eigenvector

Eigenvector is more important than eigenvector, but you need to compute eigenvalue before computing eigenvector

1. Find all eigenvalues $\lambda$
2. For each $\lambda$, find a vector $v$ which is in the **null space** of a shifted matrix by $\lambda$, $(A - \lambda I)$. That is $v \in C(A - \lambda I)$

$v$ in the null space of $(A - \lambda I)$ means that $(A - \lambda I) v$ gives us a vector with all 0s in elements. In math,

$$
(A - \lambda I) v = \textbf{0}
$$

Typically, after finding those vectors, people normalize it to make the vector have a unit length.

To double check the process to compute eigenvector, first find eigenvalues, and shift the original matrix by the eigenvalue, and find the **basis vector** (meaning normalized unit length vector) for the **null space** of the shifted matrix.

## Diagonalization of a Matrix with Eigenvalue and Eigenvector

**Diagonalization** in the context of eigendecomposition is to extract a special property of a given matrix in a form of a diagonal matrix by using eigenvalue and eigenvector.

After decomposition, we have a set of eigen values and the according eigen vectors. For example, for 3x3 matrix we have,

$$
A v_1 = \lambda_1 v_1
$$
$$
A v_2 = \lambda_2 v_2
$$
$$
A v_3 = \lambda_3 v_3
$$

These can be written in matrix as below. Let $v_{1} = [v_{11}, v_{21}, v_{31}]$ column vector

$$
\begin{bmatrix}
v_1 & v_2 & v_3
\end{bmatrix}
\begin{bmatrix}
\lambda_1 & 0 & 0\\
0 & \lambda_2 & 0\\
0 & 0 & \lambda_3
\end{bmatrix}
=
\begin{bmatrix}
v_{11} & v_{12} & v_{13}\\
v_{21} & v_{22} & v_{23}\\
v_{31} & v_{32} & v_{33}
\end{bmatrix}
\begin{bmatrix}
\lambda_1 & 0 & 0\\
0 & \lambda_2 & 0\\
0 & 0 & \lambda_3
\end{bmatrix}
=
\begin{bmatrix}
\lambda_1 v_{11} & \lambda_2 v_{12} & \lambda_3 v_{13}\\
\lambda_1 v_{21} & \lambda_2 v_{22} & \lambda_3 v_{23}\\
\lambda_1 v_{31} & \lambda_2 v_{32} & \lambda_3 v_{33}
\end{bmatrix}
$$

A matrix with eigenvectors ($[v_1, v_2, v_3]$) must **left multiply** a diagonal matrix of eigenvalues because the below is wrong.

$$
\begin{bmatrix}
\lambda_1 & 0 & 0\\
0 & \lambda_2 & 0\\
0 & 0 & \lambda_3
\end{bmatrix}
\begin{bmatrix}
v_{11} & v_{12} & v_{13}\\
v_{21} & v_{22} & v_{23}\\
v_{31} & v_{32} & v_{33}
\end{bmatrix}
=
\begin{bmatrix}
\lambda_1 v_{11} & \lambda_1 v_{12} & \lambda_1 v_{13}\\
\lambda_2 v_{21} & \lambda_2 v_{22} & \lambda_2 v_{23}\\
\lambda_3 v_{31} & \lambda_3 v_{32} & \lambda_3 v_{33}
\end{bmatrix}
$$

That means that the first eigenvalue is multiplied with the first element of each eigenvector. But it's wrong, because eigenvalue and eigenvector is a pair. You cannot mix an eigenvalue with a different eigenvector.

So a set of $A v_i = \lambda v_i$ can be written as below by using $A$ is the given matrix, $V$ is a matrix with eigenvectors in each column, and $\Lambda$ is a diagonal matrix of eigenvalues in diagonal elements.

$$
A V = V \Lambda
$$

By right multiplying the both sides by $V^{-1}$

$$
A V V^{-1} = V \Lambda V^{-1}
$$
$$
A I = V \Lambda V^{-1}
$$
$$
A = V \Lambda V^{-1}
$$

That can be interpreted as a hidden insight of a given square matrix $A$ is a diagonal matrix $\Lambda$ by passing through $V$ and $V^{-1}$. And it also suggests that the given square matrix $A$ can be reconstructed by a set of eigenvectors $V$ and $V^{-1}$, and a diagonal matrix of eigenvalues $\Lambda$.

Also, after diagonalization, matrix powers will be easy. From the below equation,

$$
A = V \Lambda V^{-1}
$$

Suppose getting $A$ to the 3rd power

$$
A^3 = (V \Lambda V^{-1}) (V \Lambda V^{-1}) (V \Lambda V^{-1})
$$

By regrouping the matrices

$$
A^3 = V \Lambda (V^{-1} V) \Lambda (V^{-1} V) \Lambda V^{-1}
$$

Because $V^{-1} V = I$

$$
A^3 = V \Lambda I \Lambda I \Lambda V^{-1}
$$
$$
A^3 = V \Lambda \Lambda \Lambda V^{-1}
$$

Because $\Lambda$ is a diagonal matrix, so $D D = D^2$

$$
A^3 = V \Lambda^3 V^{-1}
$$

We just first did eigendecomposition, and then get the power, but it still works by first getting power and do eigendecomposition, because if we have $A x = \lambda x$, $A^2$ is

$$
A^2 x = A A x
$$

Because $A x = \lambda x$

$$
A^2 x = A A x = A \lambda x
$$

We cannot change the order of matrix multiplication, but $\lambda$ is a scalar, so we can move it, so move it front

$$
A^2 x = A A x = A \lambda x = \lambda A x
$$

Because $A x = \lambda x$

$$
A^2 x = A A x = A \lambda x = \lambda A x = \lambda \lambda x
$$

Because $\lambda$ is a scalar

$$
A^2 x = A A x = A \lambda x = \lambda A x = \lambda \lambda x = \lambda^2 x
$$

So

$$
A^2 x = \lambda^2 x
$$

## Eigenvalue of Diagonal Matrix

Eigenvalues of a diagonal matrix are diagonal elements of the diagonal matrix. For example,

$$
A = 
\begin{bmatrix}
1 & 0\\
0 & 2
\end{bmatrix}
$$

$$
\begin{vmatrix}
1 - \lambda & 0\\
0 & 2 - \lambda
\end{vmatrix}
= 0
$$

$$
(1 - \lambda)(2 - \lambda) = 0
$$

$$
\lambda = 1, 2
$$

So we can imagine that, even if a diagonal matrix gets bigger, off-diagonal elements will disappear by 0 multiplication in **characteristic equations** and it gives us a bunch of $(d_i - \lambda) = 0$, so we can directly use diagonal elements as eigenvalues.

## Eigenvalue of Triangular Matrix

Eigenvalues of a triangular matrix has the same result as a diagonal matrix. Regardless of upper triangular matrix or lower triangular matrix, eigenvalues will be diagonal elements of the triangular matrix. For example in 2x2 upper triangular matrix,

$$
A =
\begin{bmatrix}
1 & 2\\
0 & 3
\end{bmatrix}
$$

$$
\begin{vmatrix}
1 - \lambda & 2\\
0 & 3 - \lambda
\end{vmatrix}
= 0
$$

$$
(1 - \lambda)(3 - \lambda) = 0
$$

$$
\lambda = 1, 3
$$

Because when computing determinant and when making multiplication, 0 at the either side of the off-diagonal elements cancels the other, so off-diagonal elements will disappear.

## Repeated Eigenvalue

Distinct eigenvalues $\lambda$'s lead to distinct eigenvectors $v$'s. But when we have the same eigenvalues (**repeated eigenvalues**), the repeated eigenvectors form the single eigenvector (producing the same vector), or the repeated eigenvectors form the **eigenplane**.

For example,

$$
A =
\begin{bmatrix}
3 & 1\\
0 & 3
\end{bmatrix}
$$

By **characteristic equation** to find eigenvalues,

$$
\lambda^2 - 6 \lambda + 9 = 0
$$
$$
(\lambda - 3)^2 = 0
$$
$$
\lambda = 3, 3
$$

When $\lambda_1 = 3$,

$$
(A - 3 I) =
\begin{bmatrix}
3 - 3 & 1\\
0 & 3 - 3
\end{bmatrix}
=
\begin{bmatrix}
0 & 1\\
0 & 0
\end{bmatrix}
$$
$$
\begin{bmatrix}
0 & 1\\
0 & 0
\end{bmatrix}
v_1
=
\begin{bmatrix}
0 \\
0
\end{bmatrix}
$$
$$
v_1 =
\begin{bmatrix}
1 \\
0
\end{bmatrix}
$$

For $\lambda_2$, it will have the same direction $v_2 = scaler * [1, 0]$.

## Eigendecomposition of Symmetric Matrix

Eigendecomposition of **symmetrix matrix** has the following 2 properties, assuming it has **distinct eigenvalues**

1. Eigenvalues are real values (no complex numbers).
2. Eigenvectors are all pair-wise orthogonal, meaning $V^{-1} = V^T$

If two vectors are orthogonal, the dot product is 0, so start from making a dot product. Below $v_1$ and $v_2$ are eigenvectors.

$$
\lambda_1 v_1^t v_2
$$

Because $A v_1 = \lambda_1 v_1$,

$$
\lambda_1 v_1^t v_2 = (A v_1)^T v_2
$$

By **LIVE EVIL rule**,

$$
\lambda_1 v_1^t v_2 = (A v_1)^T v_2 = v_1^T A^T v_2
$$

Because a given matrix is symmetrix ($A^T = A$), and because $A v_2 = \lambda_2 v_2$,

$$
\lambda_1 v_1^t v_2 = (A v_1)^T v_2 = v_1^T A^T v_2 = v_1^T A v_2 = v_1^T \lambda_2 v_2 
$$

Becuase $\lambda_2$ is a scalar and we can move it forward by changing order,

$$
\lambda_1 v_1^t v_2 = (A v_1)^T v_2 = v_1^T A^T v_2 = v_1^T A v_2 = v_1^T \lambda_2 v_2 = \lambda_2 v_1^T v_2  
$$

Extract the first and the last expression,

$$
\lambda_1 v_1^T v_2 = \lambda_2 v_1^T v_2  
$$
$$
\lambda_1 v_1^T v_2 - \lambda_2 v_1^T v_2 = 0
$$
$$
(\lambda_1 - \lambda_2) v_1^T v_2 = 0
$$

Because eigenvalues are distinct, $\lambda_1$ and $\lambda_2$ won't be the same, so $(\lambda_1 - \lambda_2)$ is not 0. For the right hand side of the above equation to be 0, $v_1^T v_2$ needs to be 0. When a dot product is 0, those vectors are orthogonal, so $v_1$ and $v_2$ are orthogonal. So **symmetrix matrix has orthogonal eigenvectors as long as eigenvalues are distinct**.

It means that $V^T V$ gives a diagonal matrix, because row and columns are orthogonal. By default eigenvectors are not guaranteed to be a unit vector (not normalized to be the length of a vector 1). But when we normalize each columns of a matrix with eigenvectors in columns, pair-wise dot product produces 1, so from a matrix of eigenvectors $V$,

$$
V^T V = 1
$$

Because $A^{-1} A = I$,

$$
V^T = V^{-1}
$$

It means that we don't need to do inverse calculation (difficult compute and time consuming). We can replace it with just a transpose.

## Eigendecomposition of Singular Matrix

Eigendecomposition can also be applied to **singular matrix** (non-invertible matrix, its determinant is 0). In such case, there will be at least one 0 eigenvalue. To know the rank of a singular matrix, we can count the number of non-zero eigenvalues. The **determinant** is equal to the **product** of all **eigenvalues**.

## Diagonalization as Sum of Matrices

From a given square matrix $A$, either a symmetrix matrix or non-symmetrix matrix, **eigendecomposition** and **diagonalization** of the matrix gives us the following

$$
A = V \Lambda V^{-1}
$$

$V$ is a matrix with **eigenvectors** in each column, and $\Lambda$ is a diagonal matrix with **eigenvalues** in each diagonal element. From one eigenvector $v_i$ and the corresponding eigenvalue $\lambda_i$ in the decomposition, we can create a matrix like below.

$$
v_i \lambda_i v_i^{-1} = A_i
$$

Because $V^{-1} = V^T$ and $v_i^{-1} = v_i^t$,

$$
v_i \lambda_i v_i^{T} = A_i
$$

This is a mx1 column vector $v_i$ times a 1xm row vector $v_i^{T}$, scaled by $\lambda_i$, giving us a matrix (mxm). It's actually an **outer product** of an eigenvector scaled by eigenvalue. We can think of this single matrix as a single layer of the given matrix $A$. If we wanna reconstruct $A$ (mxn), we can use the following equation.

$$
A = \sum_{i=1}^{n} v_i \lambda_i v_i^{-1} = \sum_{i=1}^{n} v_i \lambda_i v_i^{T}
$$

We can arbitrarily choose any number $n$ as long as it doesn't exceed $n$. So it means that we can only sum the first $i$ layers to recontruct $A$.

**Numpy** (and most of the other softwares) by default normalizes eigenvectors to have a unit length. It means that $V V^{-1}$ gives the matrix which has all 1s in the diagonal elements, because each pair of vectors are orthogonal. So the magnitude of each eigenvector is 1. It means eigenvectors $v_i$ only give us the direction. And eigenvalues $\lambda_i$ give us the importance of each eigenvector.

$$
||v_i|| = 1
$$
$$
||\lambda_i|| \neq 1
$$

**Eigenvectors** point in the **important direction** in the space of matrix $A$, and **eigenvalues** tell us **how important** those specific directions are. The larger the magnitude of eigenvalue is, the more important the direction is in the space of matrix $A$.