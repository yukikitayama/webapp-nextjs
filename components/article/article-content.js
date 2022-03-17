import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Typography, Card, Grid, Box } from "@mui/material";

function ArticleContent(props) {
  const { article } = props;
  const imagePath = `/images/article/${article.slug}/${article.image}`;

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
            <Image
              src={imagePath}
              alt={article.title}
              layout="intrinsic"
              width={2000}
              height={800}
            />
          </Box>
          <Box sx={{ px: { xs: 2, md: 6 }, pb: { xs: 2, md: 6 } }}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
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
