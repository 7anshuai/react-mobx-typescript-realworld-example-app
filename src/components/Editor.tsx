import React, { FormEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../store";
import ListErrors from "./ListErrors";

const Editor: React.FC = () => {
  const history = useHistory();
  const { slug } = useParams();
  const [tagInput, set] = useState<string>('');
  const { editorStore } = useStore();

  useEffect(() => {
    if (slug) {
      editorStore.setArticleSlug(slug);
      editorStore.loadInitialData();
    }
  }, [ editorStore, slug ]);

  const changeTitle = (e: any) => editorStore.setTitle(e.target.value);
  const changeDescription = (e: any) =>
    editorStore.setDescription(e.target.value);
  const changeBody = (e: any) => editorStore.setBody(e.target.value);
  const changeTagInput = (e: any) => set(e.target.value);

  const handleTagInputKeyDown = (ev: any) => {
    switch (ev.keyCode) {
      case 13: // Enter
      case 9: // Tab
      case 188: // ,
        if (ev.keyCode !== 9) ev.preventDefault();
        handleAddTag();
        break;
      default:
        break;
    }
  };

  const handleAddTag = () => {
    if (tagInput) {
      editorStore.addTag(tagInput.trim());
      set('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (editorStore.inProgress) return;
    editorStore.removeTag(tag);
  };

  const submitForm = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    editorStore.submit().then((article: any) => {
      editorStore.reset();
      history.replace(`/article/${article.slug}`);
    });
  };

  return useObserver(() => {
    const {
      inProgress,
      errors,
      title,
      description,
      body,
      tagList
    } = editorStore;

    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">
              <ListErrors errors={errors} />

              <form onSubmit={submitForm}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Article Title"
                      value={title}
                      onChange={changeTitle}
                      disabled={inProgress}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="What's this article about?"
                      value={description}
                      onChange={changeDescription}
                      disabled={inProgress}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows={8}
                      placeholder="Write your article (in markdown)"
                      value={body}
                      onChange={changeBody}
                      disabled={inProgress}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter tags"
                      value={tagInput}
                      onChange={changeTagInput}
                      onBlur={handleAddTag}
                      onKeyDown={handleTagInputKeyDown}
                      disabled={inProgress}
                    />

                    <div className="tag-list">
                      {tagList.map(tag => {
                        return (
                          <span className="tag-default tag-pill" key={tag}>
                            <i
                              className="ion-close-round"
                              onClick={() => handleRemoveTag(tag)}
                            />
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="submit"
                    disabled={inProgress}
                  >
                    Publish Article
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  });
};

export default Editor;