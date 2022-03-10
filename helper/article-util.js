import fs from "fs";
import path from "path";

import matter from "gray-matter";

const articlesDirectory = path.join(process.cwd(), "articles");

export function getArticlesFiles() {
  return fs.readdirSync(articlesDirectory);
}

export function getArticleData(articleIdentifier) {
  const articleSlug = articleIdentifier.replace(/\.md$/, "");
  const filePath = path.join(articlesDirectory, `${articleSlug}.md`);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const articleData = {
    slug: articleSlug,
    ...data,
    content
  };

  return articleData;
}

export function getAllArticles() {
  const articleFiles = getArticlesFiles();

  const allArticles = articleFiles.map(articleFile => {
    return getArticleData(articleFile);
  })

  return allArticles;
}

export function getFeaturedArticles() {
  const allArticles = getAllArticles();
  const featuredArticles = allArticles.filter(article => article.isFeatured);
  return featuredArticles;
}
