import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AppLayout from '../layouts/AppLayout.jsx';

export default createContainer(() => {
  const currentUser = Meteor.user();
  const loggingIn = Meteor.loggingIn();

  return {
    currentUser,
    loggingIn,
  };
}, AppLayout);
