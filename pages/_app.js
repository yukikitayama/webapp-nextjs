import PropTypes from "prop-types";
import { Provider } from "react-redux";
import Head from "next/head";
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";
import "../styles/globals.css";
import { CacheProvider } from "@emotion/react";
// import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

import createEmotionCache from "../src/createEmotionCache";
import Layout from "../components/layout/layout";
import store from "../store/index";
// import darkTheme from "../styles/theme/darkTheme";

Amplify.configure(awsconfig);

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        {/* Movded ThemeProvider and CssBaseline to Layout component to make Redux work */}
        {/* <ThemeProvider theme={darkTheme}> */}
        {/* <CssBaseline /> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </ThemeProvider> */}
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
