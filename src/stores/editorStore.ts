import { observable, action } from 'mobx';
import { ResponseError } from 'superagent';
import articleStore from './articleStore';

export class EditorStore {

  @observable inProgress = false;
  @observable errors = undefined;
  @observable articleSlug: string = '';

  @observable title = '';
  @observable description = '';
  @observable body = '';
  @observable tagList: string[] = [];

  @action setArticleSlug(articleSlug: string) {
    if (this.articleSlug !== articleSlug) {
      this.reset();
      this.articleSlug = articleSlug;
    }
  }

  @action loadInitialData() {
    if (!this.articleSlug) return Promise.resolve();
    this.inProgress = true;
    return articleStore.loadArticle(this.articleSlug, { acceptCached: true })
      .then(action((article: any) => {
        if (!article) throw new Error('Can\'t load original article');
        this.title = article.title;
        this.description = article.description;
        this.body = article.body;
        this.tagList = article.tagList;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }

  @action reset() {
    this.title = '';
    this.description = '';
    this.body = '';
    this.tagList = [];
  }

  @action setTitle(title: string) {
    this.title = title;
  }

  @action setDescription(description: string) {
    this.description = description;
  }

  @action setBody(body: string) {
    this.body = body;
  }

  @action addTag(tag: string) {
    if (this.tagList.includes(tag)) return;
    this.tagList.push(tag);
  }

  @action removeTag(tag: string) {
    this.tagList = this.tagList.filter(t => t !== tag);
  }

  @action submit() {
    this.inProgress = true;
    this.errors = undefined;
    const article = {
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      slug: this.articleSlug,
    };
    return (this.articleSlug ? articleStore.updateArticle(article) : articleStore.createArticle(article))
      .catch(action((err: ResponseError) => {
        this.errors = err.response && err.response.body && err.response.body.errors; throw err;
      }))
      .finally(action(() => { this.inProgress = false; }));
  }
}

export default new EditorStore();
