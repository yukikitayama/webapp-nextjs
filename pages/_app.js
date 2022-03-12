import { Provider } from "react-redux";
import Head from "next/head";
import { Amplify } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import "../styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";

import darkTheme from "../styles/theme/darkTheme";
import Layout from "../components/layout/layout";
import store from '../store/index';

Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
