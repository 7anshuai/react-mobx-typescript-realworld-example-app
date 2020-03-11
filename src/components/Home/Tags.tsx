import React from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
  loading: boolean;
  tags: string[];
}

const Tags: React.FC<Props> = props => {
  const { loading, tags } = props;
  if (loading) {
    return <LoadingSpinner />;
  } else if (tags) {
    return (
      <div className="tag-list">
        {tags.map(tag => {
          return (
            <Link
              to={{
                pathname: "/",
                search: "?tab=tag&tag=" + tag
              }}
              className="tag-default tag-pill"
              key={tag}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    );
  } else {
    return null;
  }
};

export default Tags;
