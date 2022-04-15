import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
// import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import classes from "./article-content.module.css";

// SyntaxHighlighter.registerLanguage('python', python);

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

    code(code) {
      // Need to see the actual objects because code block received different objects depending on types
      // console.log("code");
      // console.log(code);
      // console.log('node.properties');
      // console.log(code.node.properties);
      // console.log("node.children");
      // console.log(code.node.children);
      // console.log("node.position");
      // console.log(code.node.position);

      const { inline, node, children, className } = code;

      if (inline) {
        return <code className={classes.defaultCodeDisplay}>{children}</code>;
      } else if (!inline && !className) {
        return (
          <div className={classes.defaultCodeDisplay}>
            <code>{children}</code>
          </div>
        );
      } else if (className) {
        const language = className.split("-")[1];
        return (
          <SyntaxHighlighter style={atomDark} language={language}>
            {children}
          </SyntaxHighlighter>
        );
      }
    },
  };

  return (
    <Grid container pt={2} pb={10} justifyContent="center">
      <Grid item xs={12}>
        <Card>
          <Typography
            variant="h2"
            component="div"
            align="center"
            pt={2}
            // sx={{ color: "#64ffda" }}
          >
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
            <div className={classes.imageContainer}>
              <Image
                src={imagePath}
                alt={article.title}
                // This cause stretching...
                // width={1000}
                // height={400}

                // This will fit, but photo position fixed at top left, and cannot center
                // width={"100%"}
                // height={"100%"}
                // layout="responsive"

                layout="fill"
                objectFit="cover"
              />
            </div>
          </Box>
          <Box sx={{ px: { xs: 2, md: 6 }, pb: { xs: 2, md: 6 } }}>
            <article className={classes.content}>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={markdownComponents}
              >
                {article.content}
              </ReactMarkdown>
            </article>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ArticleContent;
