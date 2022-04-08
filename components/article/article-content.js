import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Typography, Card, Grid, Box } from "@mui/material";

import classes from "./article-content.module.css";

function ArticleContent(props) {
  const { article } = props;
  const imagePath = `/images/article/${article.slug}/${article.image}`;

  const markdownComponents = {
    p(paragraph) {
      const { node } = paragraph;

      if (node.children[0].tagName === "img") {
        const image = node.children[0];
        const alt = image.properties.alt?.replace(/ *\{[^)]*\} */g, "");
        
        // const metaWidth = image.properties.alt.match(/{([^}]+)x/);
        // const metaHeight = image.properties.alt.match(/x([^}]+)}/);
        // const width = metaWidth ? +metaWidth[1] : 768;
        // const height = metaHeight ? +metaHeight[1] : 432;

        const metaSize = image.properties.alt.match(/\d+x\d+/);
        let width;
        let height;
        if (metaSize) {
          const metaSizeArray = metaSize[0].split("x");
          width = +metaSizeArray[0];
          height = +metaSizeArray[1];
        } else {
          width = 768;
          height = 432;
        }

        return (
          <div className={classes.imageContent}>
            <Image
              src={image.properties.src}
              alt={alt}
              width={width}
              height={height}
            />
          </div>
        );
      }

      return <p>{paragraph.children}</p>;
    },
  };

  return (
    <Grid container pt={2} pb={10} justifyContent="center">
      <Grid item xs={12}>
        <Card>
          <Typography variant="h2" component="div" align="center" pt={2}>
            {article.title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            color="text.secondary"
            align="center"
            pb={2}
          >
            {`${article.category} | ${article.date} | ${article.view} views | ${article.vote} votes`}
          </Typography>
          <Box sx={{ px: { xs: 2, md: 6 } }}>
            <div className={classes.imageCard}>
              <Image
                src={imagePath}
                alt={article.title}
                // layout="intrinsic"
                layout="responsive"
                width={2000}
                height={1000}
              />
            </div>
          </Box>
          <Box sx={{ px: { xs: 2, md: 6 }, pb: { xs: 2, md: 6 } }}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {article.content}
            </ReactMarkdown>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ArticleContent;
