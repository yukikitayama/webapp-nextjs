---
id: "article:18"
---

## Concept

$N$ is the number of data. $p$ is the number of features. $X$ is $N \times p$ given data. Each observation is **centered**, meaning the means of each feature are subtracted from each feature. In code,

$$
X = X - \text{np.mean($X$, axis=0)}
$$

**np** is **numpy**. **axis=0** means that getting means of each column.

**Principal component analysis (PCA)** is the **singular value decomposition (SVD)** of this centered data.

$$
X = U D V^T
$$
$$
(N \times p) = (N \times p) (p \times p) (p \times p)
$$

$U$ is **left singular vectors**. $D$ is a diagonal matrix with **singular values** in diagonal elements. $V$ is **right singular vectors**.

The columns of $U D$ are called the **principal components** of $X$.

Dimension reduction of $X$ from $p$ to $q$ ($q \le p$) is given by the first $q$ principal components like below.

$$
X_{\text{dimension reduced}} = U_q D_q
$$
$$
(N \times q) = (N \times q) (q \times q)
$$

$U_q$ is $U$ of the first $q$ columns and all the rows. $D_q$ is $D$ of the first $q$ columns and first $q$ rows.

## Scikit-learn

In **sklearn.decomposition.PCA**, parameter **n_components** is $q$.

$X$ needs to be centered before doing **fit(X)** or **fit_transform(X)**.

Attribute **singular_values_** is **singular values of SVD**.

Attribute **components_** is **right singular vectors of SVD**.

Dimension reduction by **fit_transform(X)** is $U_q D_q$ of SVD.

## Reference

- The Elements of Statistical Learning, 14.5.1 Principal Components
- [numpy.linalg.svd](https://numpy.org/doc/stable/reference/generated/numpy.linalg.svd.html)
- [sklearn.decomposition.PCA](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)