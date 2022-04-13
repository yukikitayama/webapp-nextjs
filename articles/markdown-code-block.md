In any formats, `code()` receivces an object.

`children` key always contains the strings in the code block.

When code block is inline like `SOMETHING`, `code()` receives an object which contains a key `inline` and its value is true. It doesn't receive `className` key.

When code block is actually a block, meaning take the space of 100% width, the object that `code()` receives doesn't contain a key `inline`. If this block level code block doesn't specify a language, the object doesn't contain a key `className`

Wehn code block is actually a block and it has the language specified, the received object has a key `className`. Its value is `language-LANGUAGE_NAME`. For example, if the language is Python, `className: 'language-python'`