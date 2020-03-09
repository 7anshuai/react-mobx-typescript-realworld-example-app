import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useObserver } from 'mobx-react-lite';
import { useStore } from '../store';
import ListErrors from './ListErrors';

const Login: React.FC = (props: any) => {
  const { authStore } = useStore();
  const handleEmailChange = (e: any) => authStore.setEmail(e.target.value);
  const handlePasswordChange = (e: any) => authStore.setPassword(e.target.value);
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    authStore.login()
      .then(() => props.history.replace('/'))
      .catch(() => {});
  };
  useEffect(() => {
    return () => authStore.reset();
  }, [ authStore ]);

  return useObserver(() => {
    const { values, errors, inProgress } = authStore;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="register">
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={handleSubmitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleEmailChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handlePasswordChange}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={inProgress}
                  >
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
     )
  });
}

export default Login;
