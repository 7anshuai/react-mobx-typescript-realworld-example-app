import commonStore, { CommonStore } from './commonStore'
import authStore, { AuthStore } from './authStore'
import userStore, { UserStore } from './userStore'

export type TRootStore = {
  authStore: AuthStore
  commonStore: CommonStore
  userStore: UserStore
}

const rootStore = {
  authStore,
  commonStore,
  userStore
};

export default rootStore;