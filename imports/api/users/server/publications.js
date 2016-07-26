import { Meteor } from 'meteor/meteor';
import required from '../../required.js';

Meteor.publish('users.profile', ({
  userId = required(),
} = {}) =>
  Meteor.users.find({
    _id: userId,
  }, {
    fields: {
      profile: 1,
    },
  })
);
