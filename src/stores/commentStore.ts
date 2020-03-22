import { observable, action } from 'mobx';
import agent from '../agent';

export class CommentStore {

  @observable isCreatingComment = false;
  @observable isLoadingComments = false;
  @observable commentErrors = undefined;
  @observable articleSlug: string = '';
  @observable comments: any[] = [];

  @action setArticleSlug(articleSlug: string) {
    if (this.articleSlug !== articleSlug) {
      this.comments = [];
      this.articleSlug = articleSlug;
    }
  }

  @action loadComments() {
    this.isLoadingComments = true;
    this.commentErrors = undefined;
    return agent.Comments.forArticle(this.articleSlug)
      .then(action(({ comments }: { comments: any[] }) => { this.comments = comments; }))
      .catch(action((err: any) => {
        this.commentErrors = err.response && err.response.body && err.response.body.errors;
        throw err;
      }))
      .finally(action(() => { this.isLoadingComments = false; }));
  }


  @action createComment(comment: any) {
    this.isCreatingComment = true;
    return agent.Comments.create(this.articleSlug, comment)
      .then(() => this.loadComments())
      .finally(action(() => { this.isCreatingComment = false; }));
  }

  @action deleteComment(id: number) {
    const idx = this.comments.findIndex(c => c.id === id);
    if (idx > -1) this.comments.splice(idx, 1);
    return agent.Comments.delete(this.articleSlug, id)
      .catch(action((err: any) => { this.loadComments(); throw err }));
  }
}

export default new CommentStore();
