import React, { useEffect } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useStore } from '../../store';
import Banner from './Banner';
import MainView from './MainView'
import Tags from './Tags';

const Home: React.FC = () => {
  const { commonStore } = useStore();
  
  useEffect(() => {
    async function loadTags() {
      await commonStore.loadTags();
    }
    loadTags();
  }, [ commonStore ]);

  return useObserver(() => {
    const { appName, isLoadingTags, tags, token } = commonStore;
    return (
      <div className="home-page">

        <Banner token={token} appName={appName} />

        <div className="container page">
          <div className="row">

            <MainView />

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <Tags
                  loading={isLoadingTags}
                  tags={tags}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  });
}

export default Home;