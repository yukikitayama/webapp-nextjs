import { Fragment } from "react";
import { Grid, Typography } from "@mui/material";

import ArticleCard from "../article/article-card";

function FeaturedArticle() {
  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={12}>
          <Typography variant="h4" component="div" sx={{ textAlign: "center" }}>
            Featured Articles
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <ArticleCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <ArticleCard />
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default FeaturedArticle;
