import React, { useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useObserver } from "mobx-react-lite";
import { parse as qsParse } from "query-string";
import { useStore } from '../../store';
import ArticleList from "../ArticleList";

const YourFeedTab = (props: any) => {
  if (props.currentUser) {
    return (
      <li className="nav-item">
        <NavLink
          className="nav-link"
          isActive={(match, location) => {
            return location.search.match("tab=feed") ? true : false;
          }}
          to={{
            pathname: "/",
            search: "?tab=feed"
          }}
        >
          Your Feed
        </NavLink>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = (props: any) => {
  return (
    <li className="nav-item">
      <NavLink
        className="nav-link"
        isActive={(match, location) => {
          return !location.search.match(/tab=(feed|tag)/) ? true : false;
        }}
        to={{
          pathname: "/",
          search: "?tab=all"
        }}
      >
        Global Feed
      </NavLink>
    </li>
  );
};

const TagFilterTab = (props: any) => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound" /> {props.tag}
      </a>
    </li>
  );
};

const MainView: React.FC = () => {
  const location = useLocation();
  const { articleStore, userStore } = useStore();
  
  const tab = qsParse(location.search).tab || "all";
  const tag = qsParse(location.search).tag || "";

  const getPredicate = useCallback((tab, tag) => {
    switch (tab) {
      case "feed":
        return { myFeed: true };
      case "tag":
        return { tag };
      default:
        return {};
    }
  }, []);

  const handleSetPage = (page: number) => {
    articleStore.setPage(page);
    articleStore.loadArticles();
  };
  
  useEffect(() => {
    articleStore.setPredicate(getPredicate(tab, tag));
    articleStore.loadArticles();
  }, [articleStore, getPredicate, tab, tag]);


  return useObserver(() => {
    const { currentUser } = userStore;
    const {
      articles,
      isLoading,
      page,
      totalPagesCount
    } = articleStore;

    return (
      <div className="col-md-9">
        <div className="feed-toggle">
          <ul className="nav nav-pills outline-active">
            <YourFeedTab currentUser={currentUser} tab={tab} />

            <GlobalFeedTab tab={tab} />

            <TagFilterTab tag={tag} />
          </ul>
        </div>

        <ArticleList
          articles={articles}
          loading={isLoading}
          totalPagesCount={totalPagesCount}
          currentPage={page}
          onSetPage={handleSetPage}
        />
      </div>
    );
  });
};

export default MainView;
