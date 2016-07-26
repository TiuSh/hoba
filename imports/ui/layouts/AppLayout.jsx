import React from 'react';

import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';

export default class AppLayout extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme(),
      currentUser: this.props.currentUser,
      loggingIn: this.props.loggingIn,
    };
  }

  render() {
    return (
      <div className="app">
        {this.props.content()}
      </div>
    );
  }
}

AppLayout.propTypes = {
  currentUser: React.PropTypes.object,
  loggingIn: React.PropTypes.bool,
  content: React.PropTypes.func,
};

AppLayout.childContextTypes = {
  muiTheme: React.PropTypes.object,
  currentUser: React.PropTypes.object,
  loggingIn: React.PropTypes.bool,
};
