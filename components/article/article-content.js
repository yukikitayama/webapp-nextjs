import ReactMarkdown from 'react-markdown';

function ArticleContent() {
  const content = `# Title

  Some content

  - bullet1
  - bullet2
  `;

  return <article>
    <ReactMarkdown>{content}</ReactMarkdown>
  </article>
}

export default ArticleContent;