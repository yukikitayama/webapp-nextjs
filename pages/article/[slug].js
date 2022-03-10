import { Fragment } from "react";

import ArticleContent from "../../components/article/article-content";
import { getArticleData, getArticlesFiles } from '../../helper/article-util';

function ArticleContentPage(props) {
  return (
    <Fragment>
      <ArticleContent article={props.article} />
    </Fragment>
  );
}

export function getStaticProps(context) {
  const { params } = context;
  const { slug } = params;

  // console.log(params);
  // console.log(slug);

  const articleData = getArticleData(slug);

  return {
    props: {
      article: articleData,
    },
    revalidate: 600,
  }
}

export function getStaticPaths() {
  const articleFilenames = getArticlesFiles();

  const slugs = articleFilenames.map((fileName) => fileName.replace(/\.md$/, ""));

  return {
    paths: slugs.map((slug) => ({ params: { slug: slug } })),
    fallback: false
  }
}

export default ArticleContentPage;
