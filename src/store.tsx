import React from 'react';
import { useLocalStore } from 'mobx-react-lite';
import rootStore, { TRootStore } from './stores'

const storeContext = React.createContext<TRootStore | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useLocalStore(() => rootStore);
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>;
}

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
}