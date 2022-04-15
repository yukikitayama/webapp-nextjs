I like to make an application with **Python** backend but **JavaScript** frontend. It's because my primary language is Python, but it's popular to develop frontend by JavaScript such as **React** and **Angular**, even if **Django** is in Python.

So I was interested in how the data interacts between the 2 languages. I create many data in Python in the backend, but I need to send them to JavaScript frontend.

## Missing Value

Missing value for JavaScript is `null`, but Python doesn't have it.

Python has `None`. This is an **object**. `type(None)` is `NoneType`. The value of the object is just `None`.

Because I use Python for data analysis, I oftern use **Numpy** and **Pandas**. When a dataframe has a column for float type, and one of the data is missing, it uses `numpy.nan`.

`None` and `numpy.nan` are different, but Pandas treat them in a similar way, for example to identify rows with missing values. This causes an error when I pass the data to `json.dumps()`.

## Send JSON from Python Backend to JavaScript Frontend

I use **API** to make the data exchange happen between frontend and backend. And I typically use **JSON** data for the data format. In Python, typical way to make JSON is to use `import json` and `json.dumps(DATA)`.

An error occurs when you pass missing data to `json.dumps()`.

- When you pass Python `None`, `json.dumps()` converts `None` to `null`. It's `null` in JavaScript.
- Wehn you pass `numpy.nan`, it converts `numpy.nan` to string `nan`. For JavaScript, it's not `null`. It's actually the string data containing `nan` as value.

I think people wants to treat both `None` and `numpy.nan` as missing values. Before using `json.dumps()`, we need to convert `numpy.nan` to `None`. And we can correctly make and use `null` in JavaScript.

