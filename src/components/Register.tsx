import React from 'react';
import { Link } from 'react-router-dom';
import { Observer } from 'mobx-react-lite';
import { useStore } from '../store';
import ListErrors from './ListErrors';

const Register: React.FC = (props: any) => {
  const { authStore } = useStore()
  const handleUsernameChange = (e: any) => authStore.setUsername(e.target.value);
  const handleEmailChange = (e: any) => authStore.setEmail(e.target.value);
  const handlePasswordChange = (e: any) => authStore.setPassword(e.target.value);
  const handleSubmitForm = (e: any) => {
    e.preventDefault();
    authStore.register()
      .then(() => props.history.replace('/'))
      .catch(() => {});
  };

  return <Observer>{() => {
    const { values, errors, inProgress } = authStore;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="login">
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={handleSubmitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={values.username}
                      onChange={handleUsernameChange}
                    />
                  </fieldset>

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
    );
  }}</Observer>
};

export default Register;