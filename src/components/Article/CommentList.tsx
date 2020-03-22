import React from 'react';
import { observer } from 'mobx-react-lite';
import Comment from './Comment';

const CommentList = observer((props: any) => {
  return (
    <div>
      {
        props.comments.map((comment: any) => {
          return (
            <Comment
              comment={comment}
              currentUser={props.currentUser}
              slug={props.slug}
              key={comment.id}
              onDelete={props.onDelete}
            />
          );
        })
      }
    </div>
  );
});

export default CommentList;
