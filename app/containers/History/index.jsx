// @flow

import React, { Component } from 'react';
import storage from 'electron-json-storage';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import type { history as historyType } from 'history';
import type { Map as MapType } from 'immutable';
import { withRouter } from 'react-router';
import wallpaper from 'wallpaper';
import { setPhoto } from 'app/containers/Home/redux';
import PhotoItem from './components/PhotoItem';
import StyledHistory from './style';

type Props = {
  history : historyType,
  setPhotoAction : () => void
};

type State = {
  pictures : Array,
  currentWallpaper : string,
};

@connect(
  null,
  { setPhotoAction: setPhoto },
)
@withRouter
@autobind
class History extends Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      pictures: [],
      currentWallpaper: '',
    };
  }

  componentDidMount() {
    this.getLocalPhotos();
    wallpaper.get()
      .then((path) => {
        this.setState({ currentWallpaper: path });
      });
  }

  getLocalPhotos() {
    storage.get('pictures', (error, pictures) => {
      if (pictures.list) {
        this.setState({ pictures: pictures.list });
      }
    });
  }

  handleSetActivePhoto(photoData : MapType) {
    const { setPhotoAction, history } = this.props;
    setPhotoAction(photoData);
    history.push('/');
  }

  render() {
    const { pictures, currentWallpaper } = this.state;
    return (
      <StyledHistory>
        {
          (pictures.length > 0)
            ? (
              <div className="pictures-wrapper">
                {
                  pictures.map(picItem => (
                    <PhotoItem
                      key={picItem.id}
                      imageSRC={picItem.urls.small}
                      onClick={() => this.handleSetActivePhoto(picItem)}
                      active={currentWallpaper === picItem.path}
                    />
                  ))
                }
              </div>
            )
            : <p className="empty-history">You haven’t set any wallpaper yet</p>
        }
      </StyledHistory>
    );
  }
}

export default History;
