import { Fragment } from "react";
import { Grid, Typography } from "@mui/material";

import ArticleCard from "../article/article-card";

function FeaturedArticle(props) {
  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        pt={2}
      >
        <Grid item xs={12}>
          <Typography variant="h4" component="div" sx={{ textAlign: "center" }}>
            Featured Articles
          </Typography>
        </Grid>
        {props.articles.map((article) => (
          <Grid key={article.id} item xs={12} md={6}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

// export async function getStaticProps() {
  
//   // Get data from backend
//   const response = await fetch(`${process.env.apiGatewayUrl}/article`);
//   const articles = await response.json();

//   console.log(articles);

//   const featuredArticles = articles.filter(article => article.is_featured);

//   return {
//     props: {
//       articles: featuredArticles
//     }
//   };
// }

export default FeaturedArticle;
