# Web Application by NextJS

## Pages

- `/`
  - Starting page
  - Featured articles, current expense status, current fitness status
  - Web application concept, architecure
- `/article`
  - List of all the articles
  - `/article/[article_id]`
    - Single article content page
  - `/article/...slug`
    - Filtered by category articles page
- `/expense`
  - Monthly expense, expense trend of the current month, ledger
- `/fitness`
  - Recent fitness status from `Fitbit API`
- `/login`
  - Form to authenticate a user by `Amplify` and `AWS Cognito`.
  - Login is needed to update expense data.

## Environment Variable

- Managed by `next.config.js`
- `apiGatewayUrl`
  - URL of Amazon API Gateway
- `budget`
  - Monthly budget including rent
- `rent`
  - Monthly rent of the current place to live, need to update when moving out.

## NextJS Review

### Page Rendering

- `getStaticProps(context)` is triggered during `build time`, and allow us to generate pages before a user visit it.
  - `context` has `params` key.
- `Incremental static generation (ISR)` is to use `revalidate` to re-generate a page on every request, at most every X seconds.
  - If `revalidate` is 10 and if reload the page after 10 seconds, the page is re-generated.
  - But if reload the page before the 10 seconds, the page is not re-generated, and you will see the old version of page.
- To use dynamic path with `getStaticProps()` to get URL segment, need to implement `getStaticPaths()` too.
  - `getStaticPaths()` tells NextJS which the dynamic routes ([id].js, URL segment values) should be pre-generated
  - `getStaticPaths()` returns object key: `paths` and value: array. It's the array of objects. Each object has key: `params` and value: object. Each object has key: dynamic path identifier: and value: each possible actual path value.
- `index.js` typically only needs `getStaticProps()`, but dynamic page (e.g. `[id].js`) needs both `getStaticProps()` and `getStaticPaths()`.
- `getServerSideProps()` is needed when a page needs to be pre-render for every request or you need to access request object (`context.req` and `context.res`).
  - `getServerSideProps()` doesn't require `getStaticPaths()`, because pre-generation of dynamic paths is not needed, because `getServerSideProps()` runs for every incoming request.
- `fetch()` is available in both `getStaticProps()` and `getServerSideProps()`

### Routing

- Navigating programmatically like `history` of `react-router-dom`.
  - `import { useRouter } from 'next/router';`
  - `const router = useRouter();`
  - `router.push(PATH);`

### Server-Side Code

- If you wanna use `fs`, you need to make sure the following otherwise NextJS returns error
  - `import fs from 'fs';` at the top of the NextJS page file
  - Explicitly use `fs` in `getStaticProps()` code block.
  - If `fs` is not used anywhere but the file imports `fs`, NextJS returns error.
- `process.cwd()` returns root directory, and root directory is not `pages` directory, but root of overall NextJS project.

## MUI

- Initial configuration of MUI in NextJS
  - [Next.Js + MUI v5 tutorial](https://dev.to/hajhosein/nextjs-mui-v5-tutorial-2k35)
- NextJS `Link` component with `MUI` button.
  - Wrap MUI button with NextJS Link component and pass `passHref` to Link.
  - [Using Next.js Link Component with Material UI Buttons and Menu Items](https://dev.to/ivandotv/using-next-js-link-component-with-material-ui-buttons-and-menu-items-3m6a)
- Replace value in `TextField` by `useEffect()`
  - use `value` and `onChange`, instead of `defaultValue`
  - [Uncontrolled vs.Controlled](https://mui.com/components/text-fields/#uncontrolled-vs-controlled)

## AWS

### Lambda

- What `event` object contains
  - [What is the Handler?](https://aws-lambda-for-python-developers.readthedocs.io/en/latest/02_event_and_context/)

### Amplify

- `amplify add auth`
  - Do you want to use the default authentication and security configuration? Default configuration
  - How do you want users to be able to sign in? Email
  - Do you want to configure advanced settings? No, I am done.
  - `amplify push`

## MongoDB

- Update one document with multiple fields
  - `from bson.objectId import ObjectId` and `object_id = ObjectId(MONGODB_DOCUMENT_ID_STRING)`
  - `filter_ = { '_id': object_id }`
  - `new_values = { '$set': { 'FIELD1': 'VALUE1', 'FIELD2': 'VALUE2' } }`
  - `COLLECTION.update_one(filter_, new_values)`
  - [How to update multiple values in Mongodb using pymongo?](https://stackoverflow.com/questions/22447652/how-to-update-multiple-values-in-mongodb-using-pymongo)
  - [Search by ObjectId in mongodb with PyMongo – Python](https://www.geeksforgeeks.org/search-by-objectid-in-mongodb-with-pymongo-python/)
  - [Python MongoDB – Update_one()](https://www.geeksforgeeks.org/python-mongodb-update_one/)

## JavaScript

- `fetch()` for `PUT` and `DELETE` data
  - Both can accept `body: JSON.stringify(DATA)` data.
  - [FETCH API Part 4/4 (DELETE) by SilvenLEAF](https://dev.to/silvenleaf/fetch-api-easiest-explanation-part-4-4-delete-by-silvenleaf-4376)
- Round float to a certain decimap places
  - `Math.round(FLOAT * 100) / 100`
  - Do this strange thing because JavaScript `Math.round()` rounds to integer.
  - [How to round to at most 2 decimal places, if necessary?](https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary)

## Markdown

- Use `react-markdown` to render Markdown in React.
  - [react-markdown](https://github.com/remarkjs/react-markdown)
- Make math block to be centered
  - Wrap latex expression with 2 dollar signed at the both sides, but need to line break like below.
  - [How to safely render Markdown using react-markdown](https://blog.logrocket.com/how-to-safely-render-markdown-using-react-markdown/)

```
$$
LATEX EXPRESSION
$$

$$THIS RENDERS LATEX, BUT IT WON'T BE CENTERED$$
```

## Math

- To show math in `react-markdown`, it needs `remark-math` and `rehype-katex`.
  - `remark-math` is a package to deal with math in markdown and HTML
    - [remark-math](https://github.com/remarkjs/remark-math)
  - `rehype-katex` is a plugin to render math used with `remark-math` to show math in markdown.
    - [rehype-katex](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex)
- `katex` is a JavaScript library to show math in browser.

## tsParticles

- [react-tsparticles](https://www.npmjs.com/package/react-tsparticles)
- [tsParticles - TypeScript Particles](https://github.com/matteobruni/tsparticles)

## Udemy

- [Next.js & React - The Complete Guide (incl. Two Paths!)](https://www.udemy.com/course/nextjs-react-the-complete-guide/)