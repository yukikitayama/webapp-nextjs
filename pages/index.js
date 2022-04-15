import { Fragment } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Grid from "@mui/material/Grid";

import Hero from "../components/home-page/hero";
import FeaturedArticle from "../components/home-page/featured-article";
import ExpenseNow from "../components/home-page/expense-now";
import FitnessNow from '../components/home-page/fitness-now';
import Architecture from '../components/home-page/architecture';
// import { getFeaturedArticles } from "../helper/article-util";

export default function Home(props) {
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
        pb={10}
      >
        <Grid item xs={12}>
          <Hero />
        </Grid>
        <Grid item xs={12}>
          <Architecture />
        </Grid>
        <Grid item xs={12}>
          <FeaturedArticle articles={props.articles} />
        </Grid>
        <Grid item xs={12}>
          <ExpenseNow />
        </Grid>
        <Grid item xs={12}>
          <FitnessNow />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export async function getStaticProps() {
  // const featuredArticles = getFeaturedArticles();

  // Get data from backend
  const response = await fetch(`${process.env.apiGatewayUrl}/article`);
  const articles = await response.json();
  const featuredArticles = articles.filter(article => article.is_featured === 1);

  return {
    props: {
      articles: featuredArticles,
    },
  };
}
