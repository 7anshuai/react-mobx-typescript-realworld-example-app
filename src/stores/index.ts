import articleStore, { ArticleStore } from './articleStore';
import commentStore, { CommentStore } from './commentStore';
import commonStore, { CommonStore } from './commonStore';
import authStore, { AuthStore } from './authStore';
import userStore, { UserStore } from './userStore';
import profileStore, { ProfileStore } from './profileStore';

export type TRootStore = {
  articleStore: ArticleStore;
  commentStore: CommentStore;
  authStore: AuthStore;
  commonStore: CommonStore;
  profileStore: ProfileStore;
  userStore: UserStore;
}

const rootStore = {
  articleStore,
  commentStore,
  authStore,
  commonStore,
  profileStore,
  userStore
};

export default rootStore;