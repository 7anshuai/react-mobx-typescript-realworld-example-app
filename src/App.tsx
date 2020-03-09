import React, { useEffect } from 'react';
import { Switch, Route, HashRouter as Router } from 'react-router-dom';
import { useStore } from './store'
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

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
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
