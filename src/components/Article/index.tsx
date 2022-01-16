import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Observer } from "mobx-react-lite";
import { marked } from "marked";

import { useStore } from '../../store';
import RedError from "../RedError";
import ArticleMeta from "./ArticleMeta";
import CommentContainer from "./CommentContainer";

const Article: React.FC = () => {
  const history = useHistory();
  const { slug } = useParams();
  const { articleStore, commentStore, userStore } = useStore();
  useEffect(() => {
    if (slug) {
      articleStore.loadArticle(slug, { acceptCached: true });
      commentStore.setArticleSlug(slug);
      commentStore.loadComments();
    }
  }, [ articleStore, commentStore, slug ]);

  const handleDeleteArticle = (slug: string) => {
    articleStore
      .deleteArticle(slug)
      .then(() => history.replace("/"));
  };

  const handleDeleteComment = (id: number) => {
    commentStore.deleteComment(id);
  };

  return <Observer>{() => {
    const { currentUser } = userStore;
    const { comments, commentErrors } = commentStore;
    const article = articleStore.getArticle(slug || '');

    if (!article) return <RedError message="Can't load article" />;

    const markup = { __html: marked.parse(article.body, { sanitize: true }) };
    const canModify =
      currentUser && currentUser.username === article.author.username;
    return (
      <div className="article-page">
        <div className="banner">
          <div className="container">
            <h1>{article.title}</h1>
            <ArticleMeta
              article={article}
              canModify={canModify}
              onDelete={handleDeleteArticle}
            />
          </div>
        </div>

        <div className="container page">
          <div className="row article-content">
            <div className="col-xs-12">
              <div dangerouslySetInnerHTML={markup} />

              <ul className="tag-list">
                {article.tagList.map((tag: string) => {
                  return (
                    <li className="tag-default tag-pill tag-outline" key={tag}>
                      {tag}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <hr />

          <div className="article-actions" />

          <div className="row">
            {<CommentContainer
              comments={comments}
              errors={commentErrors}
              slug={slug}
              currentUser={currentUser}
              onDelete={handleDeleteComment}
            />}
          </div>
        </div>
      </div>
    );
  }}</Observer>;
};

export default Article;