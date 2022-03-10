import { Fragment } from "react";
import { Grid, Typography } from "@mui/material";

import ArticleCard from "../article/article-card";
// import { getFeaturedArticles } from "../../helper/article-util";

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
          <Grid key={article.slug} item xs={12} md={6}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}

// export function getStaticProps() {
//   const featuredArticles = getFeaturedArticles();

//   return {
//     props: {
//       articles: featuredArticles
//     }
//   };
// }

export default FeaturedArticle;
