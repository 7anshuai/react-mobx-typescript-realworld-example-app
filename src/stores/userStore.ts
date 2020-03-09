import { observable, action } from 'mobx';
import agent from '../agent';

export class UserStore {

  @observable currentUser: any;
  @observable loadingUser: any;
  @observable updatingUser: any;
  @observable updatingUserErrors: any;

  @action pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ user }: { user: any }) => { this.currentUser = user; }))
      .finally(action(() => { this.loadingUser = false; }))
  }

  @action updateUser(newUser: any) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(action(({ user }: { user: any }) => { this.currentUser = user; }))
      .finally(action(() => { this.updatingUser = false; }))
  }

  @action forgetUser() {
    this.currentUser = undefined;
  }

}

export default new UserStore();
