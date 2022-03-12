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

## Routing

- Navigating programmatically like `history` of `react-router-dom`.
  - `import { useRouter } from 'next/router';`
  - `const router = useRouter();`
  - `router.push(PATH);`

## Server-Side Code

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

## Amplify

- `amplify add auth`
  - Do you want to use the default authentication and security configuration? Default configuration
  - How do you want users to be able to sign in? Email
  - Do you want to configure advanced settings? No, I am done.
  - `amplify push`

## Udemy

- [Next.js & React - The Complete Guide (incl. Two Paths!)](https://www.udemy.com/course/nextjs-react-the-complete-guide/)