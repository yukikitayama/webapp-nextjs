// Import the following 2 things if the data need to be loaded from filesystem
// import fs from 'fs/promises';
// import path from 'path';
import { Fragment } from "react";
import { Grid, Typography } from "@mui/material";

import ArticleCard from "../../components/article/article-card";

const ArticlePage = (props) => {
  const { articles } = props;

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        pt={2}
      >
        <Grid item xs={12}>
          <Typography variant="h2" component="div" align="center">
            All Articles
          </Typography>
        </Grid>
        {articles.map((article) => (
          <Grid item xs={12} md={6} key={article._id}>
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
  const data = await response.json();

  return {
    props: {
      articles: data.posts,
    },
    revalidate: 60,
  };
}

export default ArticlePage;
