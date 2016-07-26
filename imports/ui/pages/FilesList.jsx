import React from 'react';
import urlParse from 'url-parse';
import debug from 'debug';

import { GridList, GridTile } from '../../../node_modules/material-ui/GridList';
import MediaQuery from '../../../node_modules/react-responsive';
// import SimpleModalSlideshow from '../components/simpleModalSlideshow.jsx';
import SimpleModalSlideshow from 'react-simple-modal-slideshow';

const log = debug('app:files-list');

export default class FilesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.buildStateFromProps(props);

    this.handleSlideshowPrev = this.handleSlideshowPrev.bind(this);
    this.handleSlideshowNext = this.handleSlideshowNext.bind(this);
    this.handleSlideshowClose = this.handleSlideshowClose.bind(this);
    this.slideContentDidMount = this.slideContentDidMount.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.buildStateFromProps(nextProps));
  }

  buildStateFromProps(props) {
    log('Build state from props', props);

    if (!props.openFile || props.loading) {
      return {
        slideshowCurrent: 0,
        slideshowOpen: false,
      };
    }

    const slideshowCurrent = this.getFileIndex(props.files, props.openFile);

    if (slideshowCurrent < 0) {
      this.props.onFileSelected(null);

      return {
        slideshowCurrent: 0,
        slideshowOpen: false,
      };
    }

    return {
      slideshowCurrent,
      slideshowOpen: true,
    };
  }

  getFileIndex(files, fileId) {
    for (const index in files) {
      if (files[index]._id === fileId) {
        return parseInt(index, 10);
      }
    }

    return -1;
  }

  getDropboxRawUrl(url) {
    const imgUrl = urlParse(url);

    imgUrl.set('query', {
      raw: 1,
    });

    return imgUrl.toString();
  }

  handleFileClick(fileId) {
    log(`Handle file "${fileId}" click`);

    this.props.onFileSelected(fileId);
  }

  handleSlideshowPrev() {
    if (this.state.slideshowCurrent > 0) {
      log('Handle slideshow prev');

      this.props.onFileSelected(
        this.props.files[this.state.slideshowCurrent - 1]._id
      );
    }
  }

  handleSlideshowNext() {
    if (this.state.slideshowCurrent < this.props.files.length - 1) {
      log('Handle slideshow next');

      this.props.onFileSelected(
        this.props.files[this.state.slideshowCurrent + 1]._id
      );
    }
  }

  handleSlideshowClose() {
    log('Handle slideshow close');

    this.props.onFileSelected(null);
  }

  slideContentDidMount(commentsNode) {
    if (!commentsNode) {
      log('Slide content unmounted');
      return;
    }

    log('Slide content did mount');

    const interval = setInterval(() => {
      if (window.FB) {
        clearInterval(interval);

        window.FB.XFBML.parse(commentsNode, () => {
          log('Slide comments loaded');
        });
      }
    }, 500);
  }

  render() {
    const tiles = this.props.files.map(file =>
      <GridTile
          key={file._id}
          onClick={this.handleFileClick.bind(this, file._id)}
          style={{ cursor: 'pointer' }}
        >
          <img src={this.getDropboxRawUrl(file.url)} />
        </GridTile>
    );

    return (
      <div>
        <MediaQuery minWidth={1024}>
          <GridList cols={4}>
            {tiles}
          </GridList>
        </MediaQuery>
        <MediaQuery maxWidth={1023}>
          <GridList cols={2}>
            {tiles}
          </GridList>
        </MediaQuery>
        <SimpleModalSlideshow
          slides={this.props.files.map(file => ({
            media: (
              <img src={this.getDropboxRawUrl(file.url)} />
            ),
            content: (
              <div
                ref={this.slideContentDidMount}
                key={file._id}
              >
                <div
                  className="fb-comments"
                  data-numposts="5"
                  data-order-by="time"
                  data-width="100%"
                />
              </div>
              ),
          }))}
          open={this.state.slideshowOpen}
          currentSlide={this.state.slideshowCurrent}
          onNext={this.handleSlideshowNext}
          onPrev={this.handleSlideshowPrev}
          onClose={this.handleSlideshowClose}
        />
      </div>
    );
  }
}

FilesList.propTypes = {
  files: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool,
  openFile: React.PropTypes.string,
  onFileSelected: React.PropTypes.func,
};

FilesList.defaultProps = {
  loading: false,
  files: [],
  openFile: null,
  onFileSelected: () => {},
};
