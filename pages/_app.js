import PropTypes from 'prop-types';
import { Provider } from "react-redux";
import Head from "next/head";
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import "../styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";

import createEmotionCache from "../src/createEmotionCache";
import darkTheme from "../styles/theme/darkTheme";
import Layout from "../components/layout/layout";
import store from "../store/index";

Amplify.configure(awsconfig);

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
}

export default MyApp;

// React built-in typechecking for a large app
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
