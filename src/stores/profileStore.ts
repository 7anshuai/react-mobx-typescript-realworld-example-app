import { observable, action } from 'mobx';
import agent from '../agent';

export class ProfileStore {

  @observable profile: any = undefined;
  @observable isLoadingProfile = false;

  @action loadProfile(username: string) {
    this.isLoadingProfile = true;
    agent.Profile.get(username)
      .then(action(({ profile }: { profile: any }) => { this.profile = profile; }))
      .finally(action(() => { this.isLoadingProfile = false; }))
  }

  @action follow() {
    if (this.profile && !this.profile.following) {
      this.profile.following = true;
      agent.Profile.follow(this.profile.username)
        .catch(action(() => { this.profile.following = false }));
    }
  }

  @action unfollow() {
    if (this.profile && this.profile.following) {
      this.profile.following = false;
      agent.Profile.unfollow(this.profile.username)
        .catch(action(() => { this.profile.following = true }));
    }
  }
}

export default new ProfileStore();
