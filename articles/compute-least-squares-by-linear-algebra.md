---
id: "article:13"
---

## Least-Squares by Left Inverse

$$
X \beta = y
$$

- $X$
  - Called **design matrix** in statistics.
  - **Tall matrix** (Typically has more number of data than the number of features)
  - **Full column rank** meaning columns form the **linearly independent set**. If $X$ is $(m, n)$, the rank is $n$.
    - If it's not full column rank meaning $X$ is a **reduced rank** matrix, also meaning the columns in a matrix forms **linearly dependent set**, it's called **multicollineariy** in statistics.
  - $X$ itself is not invertible.
  - But tall matrix can have one-sided, **left inverse** if it has linearly independet set of columns.
  - We are given this data.
- $\beta$
  - A vector of coefficient parameters.
  - We are not given this data. We don't know.
- $y$
  - Dependent variable
  - A vector
  - We are given this data.

The goal is to remove $X$ from the left side of the equation, and to compute the numbers for $\beta$ by using $X$ and $y$.

If $X$ is a *square, full-rank* matrix, we can remove $X$ by left-multiplying inverse of $X$, $X^{-1}$, and making it identity matrix to disappear from the left side. But $X$ is not square, so we can't do it, so the below is wrong.

$$ 
X^{-1} X \beta = X^{-1} y
$$
$$
I \beta = X^{-1} y
$$
$$
\beta = X^{-1} y
$$

Instead, we first try to make it square by left-multiply $X^T$, because suppose $X$ has $(m, n)$, $X^T X$ is $(n, m)$ times $(m, n)$, so $X^T X$ is $(n, n)$ square.

$$
X^T X \beta = X^T y
$$

We wanna remove $X^T X$ so left-multiply the inverse of $X^T X$, $(X^T X)^{-1}$. We can do that because it's square.

$$
(X^T X)^{-1} X^T X \beta = (X^T X)^{-1} X^T y
$$

Because $A^{-1} A = I$, and as if $A = X^T X$

$$
I \beta = (X^T X)^{-1} X^T y
$$
$$
\beta = (X^T X)^{-1} X^T y
$$

This equation has a weird looking, but we know why we have this, because we wanted to first **square** it, and take the **inverse**, and get **identity matrix** to leave the left side only $\beta$.

In linear algebra, $(X^T X)^{-1} X^T$ is called **left-inverse**. It appears when we have a tall matrix and we wanna get the inverse of it.

We got numbers of $\beta$, but $X \beta$ typically does not produce the number exactly same as $y$. When $X \beta$ produces exact $y$, it called **exact solution**. In linear algebra, it's the situation where $y$ belongs to the columns space of $X$. But in real-world problem that statistics solves, $y$ is unlikely to be in the column space, because statistics tries to develop a simplified equation to formulate the complex real-world problem. The exact solution is below, but it's unlikely to happen

$$
y \in C(X)
$$

Instead, we find $\hat{y}$ which is $\hat{y} \in C(X)$, and use it as

$$
\beta = (X^T X)^{-1} X^T \hat{y}
$$
$$
\hat{y} \in C(X)
$$
$$
y = X \beta + \varepsilon
$$
$$
(y + \varepsilon) \in C(X)
$$

## Normal Equation

$$
X \beta = y
$$

Left-multiply the both sides of the equation by $X^T$

$$
X^T X \beta = X^T y
$$

That is **normal equation**. It's used in the following **least-squares by reduced row echelon form (RREF)** and **least-squares by QR decomposition**.

## Least-Squares by Reduced Row Echelon From (RREF)

$$
X \beta = y
$$

First, convert it to **normal equation**.

$$
X^T X \beta = X^T y
$$

Apply **reduced row echelon form (RREF) to compute matrix inverse** to the given data. It's about making augmented matrix by concatenating matrix at the left and identity matrix at the right, apply RREF, and get augmented matrix of identity matrix at the left concatenated by **matrix inverse** at the right, as below

$$
RREF([A | I]) = [I | A^{-1}]
$$

When we apply that to the augmented matrix concatenated by left and right side of **normal equation**, 

$$
RREF([X^T X | X^T y]) = [I | \beta]
$$

## Least-Squares by QR Decomposition

$$
X \beta = y
$$

The key part is, before applying **QR decomposition** to $X$, convert the equation to **normal equation** by left-multiplying by $X^T$

$$
X^T X \beta = X^T y
$$

Replace $X$ with $Q R$ as QR decomposition. $Q$ is orthogonal matrix. $R$ is residual matrix.

$$
(Q R)^T Q R \beta = (Q R)^T y
$$

Apply **LIVE EVIL rule** to apply transpose to inner matrices.

$$
R^T Q^T Q R \beta = (Q R)^T y
$$

$Q^T Q$ gives us identity matrix $I$, because they are orthogonal matrices.

$$
R^T I R \beta = (Q R)^T y
$$
$$
R^T R \beta = (Q R)^T y
$$

Left-multiply both sides of the equation by $(R^T R)^{-1}$

$$
(R^T R)^{-1} R^T R \beta = (R^T R)^{-1} (Q R)^T y
$$

Because, letting $R^T R = A$, $A^{-1} A = I$

$$
I \beta = (R^T R)^{-1} (Q R)^T y
$$
$$
\beta = (R^T R)^{-1} (Q R)^T y
$$
