import React, { useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useStore } from '../../store';

const CommentInput: React.FC<any> = props => {
  const [body, set] = useState<string>('');
  const { commentStore } = useStore();

  const handleBodyChange = (ev: any) => {
    set(ev.target.value);
  };

  const createComment = (ev: any) => {
    ev.preventDefault();
    commentStore.createComment({ body })
      .then(() => set(''));
  };

  return useObserver(() => {
    const { isCreatingComment } = commentStore;
    return (
      <form className="card comment-form" onSubmit={createComment}>
        <div className="card-block">
          <textarea className="form-control"
            placeholder="Write a comment..."
            value={body}
            disabled={isCreatingComment}
            onChange={handleBodyChange}
            rows={3}
          />
        </div>
        <div className="card-footer">
          <img
            src={props.currentUser.image}
            className="comment-author-img"
            alt=""
          />
          <button
            className="btn btn-sm btn-primary"
            type="submit"
          >
            Post Comment
          </button>
        </div>
      </form>
    );
  });
};

export default CommentInput;
