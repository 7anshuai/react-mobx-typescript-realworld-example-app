import React, { useEffect, useMemo} from "react";
import { NavLink, Link, useLocation, useParams } from "react-router-dom";
import { Observer } from "mobx-react-lite";
import { useStore } from '../store';
import RedError from "./RedError";
import LoadingSpinner from "./LoadingSpinner";
import ArticleList from "./ArticleList";

const EditProfileSettings: React.FC<any> = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn"
      >
        <i className="ion-gear-a" /> Edit Profile Settings
      </Link>
    );
  }
  return null;
};

const FollowUserButton: React.FC<any> = props => {
  if (props.isUser) {
    return null;
  }

  let classes = "btn btn-sm action-btn";
  if (props.following) {
    classes += " btn-secondary";
  } else {
    classes += " btn-outline-secondary";
  }

  const handleClick = (ev: any) => {
    ev.preventDefault();
    if (props.following) {
      props.unfollow(props.username);
    } else {
      props.follow(props.username);
    }
  };

  return (
    <button className={classes} onClick={handleClick}>
      <i className="ion-plus-round" />
      &nbsp;
      {props.following ? "Unfollow" : "Follow"} {props.username}
    </button>
  );
};

const Tabs: React.FC<any> = props => {
  const { profile } = props;
  return (
    <ul className="nav nav-pills outline-active">
      <li className="nav-item">
        <NavLink
          className="nav-link"
          isActive={(match, location) => {
            return location.pathname.match("/favorites") ? false : true;
          }}
          to={`/@${profile.username}`}
        >
          My Articles
        </NavLink>
      </li>

      <li className="nav-item">
        <NavLink className="nav-link" to={`/@${profile.username}/favorites`}>
          Favorited Articles
        </NavLink>
      </li>
    </ul>
  );
};

const Profile: React.FC = () => {
  const location = useLocation();
  const params: any = useParams();
  const { articleStore, profileStore, userStore } = useStore();

  const handleFollow = () => profileStore.follow();
  const handleUnfollow = () => profileStore.unfollow();

  const handleSetPage = (page: number) => {
    articleStore.setPage(page);
    articleStore.loadArticles();
  };
  
  const tab = /\/favorites/.test(location.pathname) ? "favorites" : "all";
  const predicate = useMemo(() => tab === "favorites" ? { favoritedBy: params.username } : { author: params.username }, [tab, params.username])

  useEffect(() => {
    profileStore.loadProfile(params.username);
    articleStore.setPredicate(predicate);
    articleStore.loadArticles();
  }, [ articleStore, profileStore, predicate, location.pathname, params.username ]);

  return <Observer>{() => {
    const { profile, isLoadingProfile } = profileStore;
    const { currentUser } = userStore;

    if (isLoadingProfile && !profile) return <LoadingSpinner />;
    if (!profile) return <RedError message="Can't load profile" />;

    const isUser = currentUser && currentUser.username === profile.username;

    return (
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={profile.image} className="user-img" alt="" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
                <FollowUserButton
                  isUser={isUser}
                  username={profile.username}
                  following={profile.following}
                  follow={handleFollow}
                  unfollow={handleUnfollow}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle"><Tabs profile={profile} /></div>

              <ArticleList
                articles={articleStore.articles}
                totalPagesCount={articleStore.totalPagesCount}
                onSetPage={handleSetPage}
                loading={articleStore.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }}</Observer>;
}

export default Profile;
