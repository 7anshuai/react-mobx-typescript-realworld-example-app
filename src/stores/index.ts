import articleStore, { ArticleStore } from './articleStore';
import commonStore, { CommonStore } from './commonStore'
import authStore, { AuthStore } from './authStore'
import userStore, { UserStore } from './userStore'

export type TRootStore = {
  articleStore: ArticleStore;
  authStore: AuthStore;
  commonStore: CommonStore;
  userStore: UserStore;
}

const rootStore = {
  articleStore,
  authStore,
  commonStore,
  userStore
};

export default rootStore;