import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useObserver } from 'mobx-react-lite';
import { useStore } from '../store';

const PrivateRoute: React.FC<any> = (props: any) => {
  const { userStore } = useStore();
  return useObserver(() => {
    if (userStore.currentUser) return <Route {...props} />;
    return <Redirect to="/" />;
  });
};

export default PrivateRoute;
