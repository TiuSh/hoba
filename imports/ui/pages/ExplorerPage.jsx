import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import debug from 'debug';

import FoldersContainer from '../containers/FoldersContainer.jsx';
import FilesContainer from '../containers/FilesContainer.jsx';
import Breadcrumb from 'react-simple-breadcrumb';

const log = debug('app:explorer-page');

export default class ExplorerPage extends React.Component {
  urlFromPathSegments(pathSegments) {
    const params = Object.assign(
      {},
      FlowRouter.current().params,
      {
        path: pathSegments,
      }
    );

    return FlowRouter.path('gallery', params);
  }

  handleFileSelect(fileId) {
    log(`Handle file select "${fileId}"`);

    FlowRouter.setQueryParams({
      show: fileId,
    });
  }

  render() {
    if (this.props.loading) {
      return <div>Loading...</div>;
    }

    if (!this.props.owner) {
      FlowRouter.go('notfound');

      return <div>Loading...</div>;
    }

    return (
      <div>
        <main className="box">
          <div className="u-mb">
            <Breadcrumb
              className="delta"
              path={this.props.params.path}
              pathRoot={this.props.owner.profile.name}
              getUrlFromPathSegments={this.urlFromPathSegments}
            />
          </div>
          <div>
            <FoldersContainer
              owner={this.props.owner}
              currentPath={this.props.params.path}
            />
          </div>
          <div className="u-mt+">
            <FilesContainer
              owner={this.props.owner}
              currentPath={this.props.params.path}
              onFileSelected={this.handleFileSelect}
              openFile={this.props.queryParams.show}
            />
          </div>
        </main>
      </div>
    );
  }
}

ExplorerPage.propTypes = {
  params: React.PropTypes.object,
  queryParams: React.PropTypes.object,
  loading: React.PropTypes.bool,
  owner: React.PropTypes.object,
};
