import Head from "next/head";
import "../styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";

import darkTheme from "../styles/theme/darkTheme";
import Layout from "../components/layout/layout";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
