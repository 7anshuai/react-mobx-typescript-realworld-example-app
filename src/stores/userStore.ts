import { observable, action } from 'mobx';
import agent from '../agent';

export type User = {
  id: number;
  email: string;
  bio: string;
  image: string;
  token: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export class UserStore {

  @observable currentUser?: User;
  @observable loadingUser?: boolean;
  @observable updatingUser?: boolean;
  @observable updatingUserErrors: any;

  @action pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ user }: { user: User }) => { this.currentUser = user; }))
      .finally(action(() => { this.loadingUser = false; }))
  }

  @action updateUser(newUser: User) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(action(({ user }: { user: User }) => { this.currentUser = user; }))
      .finally(action(() => { this.updatingUser = false; }))
  }

  @action forgetUser() {
    this.currentUser = undefined;
  }

}

export default new UserStore();
