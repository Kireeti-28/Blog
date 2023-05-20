import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });

  const { canUpvote } = articleInfo;

  const { user, isLoading } = useUser();

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = user ? { authtoken: token } : {};
      const response = await axios.get(`/api/articles/${articleId}`, {
        headers,
      });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
    if (isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  const { articleId } = useParams();
  const article = articles.find((article) => article.name == articleId);

  const addUpvote = async () => {
    const token = user && (await user.getIdToken());
    const headers = user ? { authtoken: token } : {};
    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    const updateArticle = response.data;

    setArticleInfo(updateArticle);
  };

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article.title}</h1>
      <div className="upvotes-section">
        {user ? (
          <button onClick={addUpvote}>
            {canUpvote ? "Upvote" : "Already Upvoted"}
          </button>
        ) : (
          <button>Log In To Upvote</button>
        )}
      </div>
      <p>The article has {articleInfo.upvotes} upvote(s)</p>
      {article.content.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => {
            setArticleInfo(updatedArticle);
          }}
        />
      ) : (
        <button>Log In To Comnnet</button>
      )}
      <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
