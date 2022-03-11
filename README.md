# Web Application by NextJS

## Pages

- `/`
  - Starting page
  - Featured articles
  - Current expense status
  - Current fitness status
  - Architecture
  - Web application concept
  - Cost
- `/article`
  - List of all the articles
  - `/article/[article_id]`
    - Single article content page
  - `/article/...slug`
    - Filtered by category articles page
- `/expense`
  - Monthly expense
  - Expense trend of the current month
  - Ledger

## Environment Variable

- Managed by `next.config.js`
- `apiGatewayUrl`
  - URL of Amazon API Gateway
- `budget`
  - Monthly budget including rent
- `rent`
  - Monthly rent of the current place to live, need to update when moving out.

## MUI

- Initial configuration of MUI in NextJS
  - [Next.Js + MUI v5 tutorial](https://dev.to/hajhosein/nextjs-mui-v5-tutorial-2k35)
- NextJS `Link` component with `MUI` button.
  - Wrap MUI button with NextJS Link component and pass `passHref` to Link.
  - [Using Next.js Link Component with Material UI Buttons and Menu Items](https://dev.to/ivandotv/using-next-js-link-component-with-material-ui-buttons-and-menu-items-3m6a)