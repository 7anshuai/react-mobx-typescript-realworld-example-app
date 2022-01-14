import { observable, action, makeObservable } from 'mobx';
import { ResponseError } from 'superagent';
import agent from '../agent';

export class CommentStore {
  isCreatingComment = false;
  isLoadingComments = false;
  commentErrors = undefined;
  articleSlug: string = '';
  comments: any[] = [];

  constructor() {
    makeObservable(this, {
      isCreatingComment: observable,
      isLoadingComments: observable,
      commentErrors: observable,
      articleSlug: observable,
      comments: observable,
      setArticleSlug: action,
      loadComments: action,
      createComment: action,
      deleteComment: action
    });
  }

  setArticleSlug(articleSlug: string) {
    if (this.articleSlug !== articleSlug) {
      this.comments = [];
      this.articleSlug = articleSlug;
    }
  }

  loadComments() {
    this.isLoadingComments = true;
    this.commentErrors = undefined;
    return agent.Comments.forArticle(this.articleSlug)
      .then(action(({ comments }: { comments: any[] }) => { this.comments = comments; }))
      .catch(action((err: ResponseError) => {
        this.commentErrors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.isLoadingComments = false; }));
  }


  createComment(comment: any) {
    this.isCreatingComment = true;
    return agent.Comments.create(this.articleSlug, comment)
      .then(() => this.loadComments())
      .finally(action(() => { this.isCreatingComment = false; }));
  }

  deleteComment(id: number) {
    const idx = this.comments.findIndex(c => c.id === id);
    if (idx > -1) this.comments.splice(idx, 1);
    return agent.Comments.delete(this.articleSlug, id)
      .catch(action((err: ResponseError) => { this.loadComments(); throw err }));
  }
}

export default new CommentStore();
