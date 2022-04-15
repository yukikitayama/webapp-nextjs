import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Fragment } from "react";
import Head from "next/head";

import ArticleContent from "../../components/article/article-content";
import { getArticlesFiles } from "../../helper/article-util";

function ArticleContentPage(props) {
  const { article } = props;

  // For fallback is true in getStaticPaths()
  // if (!article) {
  //   return <p>Loading...</p>
  // }

  return (
    <Fragment>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article.excerpt} />
      </Head>
      <ArticleContent article={article} />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { params } = context;
  const { slug } = params;

  // Find article Markdown file
  const articlesDirectory = path.join(process.cwd(), "articles");
  const markdownPath = path.join(articlesDirectory, `${slug}.md`);
  const markdownFile = fs.readFileSync(markdownPath, "utf-8");

  // Extract id for redis key in data and article content
  const { data, content } = matter(markdownFile);

  // Get dynamitc metadata from backend
  const { id } = data;
  const response = await fetch(`${process.env.apiGatewayUrl}/article?id=${id}`);
  const responseData = await response.json();
  const { category, date, excerpt, image, is_featured, title, view, vote, like } =
    responseData;

  const articleData = {
    slug: slug,
    content: content,
    category: category,
    date: date,
    excerpt: excerpt,
    image: image,
    isFeatured: is_featured,
    title: title,
    view: view,
    vote: vote,
    like: like,
    articleId: id ? id : null
  };

  return {
    props: {
      article: articleData,
    },
    revalidate: 600,
  };
}

export function getStaticPaths() {
  // Pre-generate all the dynamic path segments, slugs to make getStaticProps() work
  const articleFilenames = getArticlesFiles();
  const slugs = articleFilenames.map((fileName) =>
    fileName.replace(/\.md$/, "")
  );

  return {
    paths: slugs.map((slug) => ({ params: { slug: slug } })),
    fallback: false,
    // fallback: true
    // fallback: 'blocking'
  };
}

export default ArticleContentPage;
