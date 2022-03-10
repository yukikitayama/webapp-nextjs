import ReactMarkdown from 'react-markdown';

function ArticleContent(props) {
  const { article } = props;

  const content = `# Title

  Some content

  - bullet1
  - bullet2
  `;

  return <article>
    <ReactMarkdown>{article.content}</ReactMarkdown>
  </article>
}

export default ArticleContent;