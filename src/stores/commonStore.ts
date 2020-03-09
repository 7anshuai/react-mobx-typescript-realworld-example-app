import { observable, action, reaction } from 'mobx';
import agent from '../agent';

export class CommonStore {

  @observable appName = 'Conduit';
  @observable token = window.localStorage.getItem('jwt');
  @observable appLoaded = false;

  @observable tags = [];
  @observable isLoadingTags = false;

  constructor() {
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

  @action loadTags() {
    this.isLoadingTags = true;
    return agent.Tags.getAll()
      .then(action(({ tags }: { tags: any }) => { this.tags = tags.map((t: string) => t.toLowerCase()); }))
      .finally(action(() => { this.isLoadingTags = false; }))
  }

  @action setToken(token: any) {
    this.token = token;
  }

  @action setAppLoaded() {
    this.appLoaded = true;
  }

}

export default new CommonStore();