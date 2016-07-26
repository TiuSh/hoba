import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';

import RaisedButton from '../../../node_modules/material-ui/RaisedButton';

export default class FoldersList extends React.Component {
  render() {
    return (
      <div>
        {this.props.folders.map(folder => {
          const params = Object.assign({},
            FlowRouter.current().params,
            {
              path: folder.path_lower.slice(1).match(/[^\/]+/g),
            }
          );

          return (
            <RaisedButton
              key={folder._id}
              label={folder.name}
              className="u-mh--"
              href={FlowRouter.path('gallery', params)}
            />
          );
        })}
        </div>
    );
  }
}

FoldersList.propTypes = {
  loading: React.PropTypes.bool,
  folders: React.PropTypes.array,
};
