import { observable, action, reaction, makeObservable } from 'mobx';
import agent from '../agent';

export class CommonStore {

  appName = 'Conduit';
  token = window.localStorage.getItem('jwt');
  appLoaded = false;

  tags: string[] = [];
  isLoadingTags = false;

  constructor() {
    makeObservable(this, {
      appName: observable,
      token: observable,
      appLoaded: observable,
      tags: observable,
      isLoadingTags: observable,
      loadTags: action,
      setToken: action,
      setAppLoaded: action
    });

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }

  loadTags() {
    this.isLoadingTags = true;
    return agent.Tags.getAll()
      .then(action(({ tags }: { tags: string[] }) => { this.tags = tags.map((t: string) => t.toLowerCase()); }))
      .finally(action(() => { this.isLoadingTags = false; }))
  }

  setToken(token: string | null) {
    this.token = token;
  }

  setAppLoaded() {
    this.appLoaded = true;
  }

}

export default new CommonStore();