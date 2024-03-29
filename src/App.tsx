import React, { useEffect } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { useStore } from '@/store'; // importing module using path alias
import Header from 'components/Header'; // importing module using absolute paths
import Home from '@components/Home';
import Login from '@components/Login';
import Register from '@components/Register';
import PrivateRoute from '@components/PrivateRoute';
import Settings from '@components/Settings';
import Profile from '@components/Profile';
import Article from '@components/Article';
import Editor from '@components/Editor';

const App: React.FC = () => {
  const { commonStore, userStore } = useStore()
  useEffect(() => {
    if (commonStore.token) {
      userStore.pullUser()
        .finally(() => commonStore.setAppLoaded())
    }
  })
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/settings" component={Settings} />
        <Route path="/@:username" component={Profile} />
        <Route path="/@:username/favorites" component={Profile} />
        <Route path="/article/:slug" component={Article} />
        <Route path="/editor/:slug?" component={Editor} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
