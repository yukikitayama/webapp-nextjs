// Import the following 2 things if the data need to be loaded from filesystem
// import fs from 'fs/promises';
// import path from 'path';
import { Fragment } from "react";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import ArticleCard from "../../components/article/article-card";

const ArticlePage = (props) => {
  const { articles } = props;

  return (
    <Fragment>
      <Head>
        <title>Yuki&apos;s Articles</title>
        <meta name="description" content="Lists all the technical articles about statistics, math, computer science, programming, cloud resource, and more." />
      </Head>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        pt={2}
        pb={10}
      >
        <Grid item xs={12}>
          <Typography variant="h2" component="div" align="center">
            All Articles
          </Typography>
        </Grid>
        {articles.map((article) => (
          <Grid item xs={12} md={6} key={article.id}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
};

export async function getStaticProps() {
  // Get data from filesystem
  // const filePath = path.join(process.cwd(), 'data', 'data.json');
  // const jsonData = await fs.readFile(filePath);
  // const data = JSON.parse(jsonData);

  // Get data from backend
  const response = await fetch(`${process.env.apiGatewayUrl}/article`);
  const articles = await response.json();
  const articlesWithImage = articles.filter(article => article.image);

  // console.log(articles);

  return {
    props: {
      articles: articlesWithImage,
    },
    revalidate: 60,
  };
}

export default ArticlePage;
