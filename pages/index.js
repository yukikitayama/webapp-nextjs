import { Fragment } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Grid } from "@mui/material";

import Hero from "../components/home-page/hero";
import FeaturedArticle from "../components/home-page/featured-article";

export default function Home() {
  return (
    <Fragment>
      <Head>
        <title>Yuki&apos;s Web App</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Hero />
        </Grid>
        <Grid item xs={12}>
          <FeaturedArticle />
        </Grid>
      </Grid>
    </Fragment>
  );
}
