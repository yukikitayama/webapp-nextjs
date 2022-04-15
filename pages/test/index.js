import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Typography from "@mui/material/Typography";
import "katex/dist/katex.min.css";

import classes from "./index.module.css";

export default function TestPage(props) {
  const { title, content } = props.article;

  const components = {
    h4: ({ node, ...props }) => <div className={classes.center} {...props} />,
  };

  return (
    <Fragment>
      <Typography variant="h2" component="div" align="center" pt={2}>
        {title}
      </Typography>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </Fragment>
  );
}

export function getStaticProps() {
  const articlesDirectory = path.join(process.cwd(), "articles");
  const fileName = "compute-least-squares-by-linear-algebra.md";
  const markdownPath = path.join(articlesDirectory, fileName);
  const markdownFile = fs.readFileSync(markdownPath, "utf-8");
  const { data, content } = matter(markdownFile);
  const title = "Compute Least-Squares by Linear Algebra";
  const articleData = {
    content: content,
    title: title,
  };

  return {
    props: {
      article: articleData,
    },
    revalidate: 600,
  };
}
