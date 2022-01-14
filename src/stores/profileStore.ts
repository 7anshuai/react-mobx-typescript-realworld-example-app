import { observable, action, makeObservable } from 'mobx';
import agent from '../agent';

type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export class ProfileStore {
  profile?: Profile;
  isLoadingProfile = false;

  constructor() {
    makeObservable(this, {
      profile: observable,
      isLoadingProfile: observable,
      loadProfile: action,
      follow: action,
      unfollow: action
    });
  }

  loadProfile(username: string) {
    this.isLoadingProfile = true;
    agent.Profile.get(username)
      .then(action(({ profile }: { profile: Profile }) => { this.profile = profile; }))
      .finally(action(() => { this.isLoadingProfile = false; }))
  }

  follow() {
    if (this.profile && !this.profile.following) {
      this.profile.following = true;
      agent.Profile.follow(this.profile.username)
        .catch(action(() => { this.profile!.following = false }));
    }
  }

  unfollow() {
    if (this.profile && this.profile.following) {
      this.profile.following = false;
      agent.Profile.unfollow(this.profile.username)
        .catch(action(() => { this.profile!.following = true }));
    }
  }
}

export default new ProfileStore();
