import articleStore, { ArticleStore } from './articleStore';
import commonStore, { CommonStore } from './commonStore';
import authStore, { AuthStore } from './authStore';
import userStore, { UserStore } from './userStore';
import profileStore, { ProfileStore } from './profileStore';

export type TRootStore = {
  articleStore: ArticleStore;
  authStore: AuthStore;
  commonStore: CommonStore;
  profileStore: ProfileStore;
  userStore: UserStore;
}

const rootStore = {
  articleStore,
  authStore,
  commonStore,
  profileStore,
  userStore
};

export default rootStore;