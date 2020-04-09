import { observable, action, computed } from 'mobx';
import { ResponseError } from "superagent";
import agent from '../agent';

const LIMIT = 10;

export class ArticleStore {

  @observable isLoading = false;
  @observable page = 0;
  @observable totalPagesCount = 0;
  @observable articlesRegistry = observable.map();
  @observable predicate: any = {};

  @computed get articles() {
    const ret = []
    const values = this.articlesRegistry.values();
    for (let value of values) {
      ret.push(value);
    }
    return ret;
  };

  clear() {
    this.articlesRegistry.clear();
    this.page = 0;
  }

  getArticle(slug: string) {
    return this.articlesRegistry.get(slug);
  }

  @action setPage(page: number) {
    this.page = page;
  }

  @action setPredicate(predicate: any) {
    if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) return;
    this.clear();
    this.predicate = predicate;
  }

  $req() {
    if (this.predicate.myFeed) return agent.Articles.feed(this.page, LIMIT);
    if (this.predicate.favoritedBy) return agent.Articles.favoritedBy(this.predicate.favoritedBy, this.page, LIMIT);
    if (this.predicate.tag) return agent.Articles.byTag(this.predicate.tag, this.page, LIMIT);
    if (this.predicate.author) return agent.Articles.byAuthor(this.predicate.author, this.page, LIMIT);
    return agent.Articles.all(this.page, LIMIT, this.predicate);
  }

  @action loadArticles() {
    this.isLoading = true;
    return this.$req()
      .then(action(({ articles, articlesCount }: { articles: any, articlesCount: number }) => {
        this.articlesRegistry.clear();
        articles.forEach((article: any) => this.articlesRegistry.set(article.slug, article));
        this.totalPagesCount = Math.ceil(articlesCount / LIMIT);
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action loadArticle(slug: string, { acceptCached = false } = {}) {
    if (acceptCached) {
      const article = this.getArticle(slug);
      if (article) return Promise.resolve(article);
    }
    this.isLoading = true;
    return agent.Articles.get(slug)
      .then(action(({ article }: { article: any}) => {
        this.articlesRegistry.set(article.slug, article);
        return article;
      }))
      .finally(action(() => { this.isLoading = false; }));
  }

  @action makeFavorite(slug: string) {
    const article = this.getArticle(slug);
    if (article && !article.favorited) {
      article.favorited = true;
      article.favoritesCount++;
      return agent.Articles.favorite(slug)
        .catch(action((err: ResponseError) => {
          article.favorited = false;
          article.favoritesCount--;
          throw err;
        }));
    }
    return Promise.resolve();
  }

  @action unmakeFavorite(slug: string) {
    const article = this.getArticle(slug);
    if (article && article.favorited) {
      article.favorited = false;
      article.favoritesCount--;
      return agent.Articles.unfavorite(slug)
        .catch(action((err: ResponseError) => {
          article.favorited = true;
          article.favoritesCount++;
          throw err;
        }));
    }
    return Promise.resolve();
  }

  @action createArticle(article: any) {
    return agent.Articles.create(article)
      .then(({ article }: { article:any }) => {
        this.articlesRegistry.set(article.slug, article);
        return article;
      })
  }

  @action updateArticle(data: any) {
    return agent.Articles.update(data)
      .then(({ article }:{ article: any }) => {
        this.articlesRegistry.set(article.slug, article);
        return article;
      })
  }

  @action deleteArticle(slug: string) {
    this.articlesRegistry.delete(slug);
    return agent.Articles.del(slug)
      .catch(action((err: ResponseError) => { this.loadArticles(); throw err; }));
  }
}

export default new ArticleStore();
