import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import LoginPage from '../pages/LoginPage.jsx';

export default createContainer(() => {
  const currentUser = Meteor.user();
  const loggingIn = Meteor.loggingIn();

  return {
    currentUser,
    loggingIn,
  };
}, LoginPage);
