import { Link } from "react-router-dom";

const ArticleList = ({ articles }) => {
  return (
    <>
      {articles.map((eachArticle) => (
        <Link
          key={eachArticle.name}
          className="article-list-item"
          to={`/articles/${eachArticle.name}`}
        >
          <h3>{eachArticle.title}</h3>
          <p>{eachArticle.content[0].substring(0, 150)}...</p>
        </Link>
      ))}
    </>
  );
};

export default ArticleList;
