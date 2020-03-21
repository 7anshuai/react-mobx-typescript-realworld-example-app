import React, { FormEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../store";
import ListErrors from "./ListErrors";

const SettingsForm: React.FC<any> = (props) => {
  const { userStore } = useStore();
  const [state, setState] = useState({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: ""
  });

  const updateState = (field: string) => (ev: any) => {
    const newState = Object.assign({}, state, { [field]: ev.target.value });
    setState(newState);
  };

  const submitForm = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const user = Object.assign({}, state);
    if (!user.password) {
      delete user.password;
    }

    props.onSubmitForm(user);
  };
  
  useEffect(() => {
    if (userStore.currentUser) {
      setState({
        image: userStore.currentUser.image || "",
        username: userStore.currentUser.username || "",
        bio: userStore.currentUser.bio || "",
        email: userStore.currentUser.email || "",
        password: ""
      });
    }
  }, [ userStore.currentUser ]);
  
  return useObserver(() => (
    <form onSubmit={submitForm}>
      <fieldset>
        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            value={state.image}
            onChange={updateState("image")}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            value={state.username}
            onChange={updateState("username")}
          />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
            value={state.bio}
            onChange={updateState("bio")}
          ></textarea>
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={updateState("email")}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            value={state.password}
            onChange={updateState("password")}
          />
        </fieldset>

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={userStore.updatingUser}
        >
          Update Settings
        </button>
      </fieldset>
    </form>
  ));
}

const Settings: React.FC = () => {
  const history = useHistory();
  const { authStore, userStore } = useStore();
  const handleClickLogout = () =>
    authStore.logout().then(() => history.replace("/"));

  return useObserver(() => (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={userStore.updatingUserErrors} />

            <SettingsForm
              currentUser={userStore.currentUser}
              onSubmitForm={(user: any) => userStore.updateUser(user)}
            />

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={handleClickLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  ));
}

export default Settings;
