import { Meteor } from 'meteor/meteor';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';

import RefreshIndicator from '../../../node_modules/material-ui/RefreshIndicator';
import RaisedButton from '../../../node_modules/material-ui/RaisedButton';
import FontIcon from '../../../node_modules/material-ui/FontIcon';

export default class LoginPage extends React.Component {
  componentDidMount() {
    this.handleUserLogin(this.props.currentUser);
  }

  componentWillReceiveProps(props) {
    this.handleUserLogin(props.currentUser);
  }

  handleUserLogin(currentUser) {
    if (currentUser) {
      FlowRouter.go(`/${currentUser._id}`);
    }
  }

  handleClick(e) {
    e.preventDefault();
    Meteor.loginWithDropbox();
  }

  render() {
    if (this.props.loggingIn) {
      return (
        <div className="page--login">
          <RefreshIndicator
            size={40}
            left={0}
            top={0}
            status="loading"
            style={{
              display: 'inline-block',
              position: 'relative',
            }}
          />
        </div>
      );
    }

    return (
      <div className="page--login">
        <RaisedButton
          label="Login with Dropbox"
          onClick={this.handleClick.bind(this)}
          secondary={true}
          icon={<FontIcon className="fa fa-dropbox" />}
        />
      </div>
    );
  }
}

LoginPage.propTypes = {
  currentUser: React.PropTypes.object,
  loggingIn: React.PropTypes.bool,
};
