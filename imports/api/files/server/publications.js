import { Meteor } from 'meteor/meteor';
import required from '../../required.js';
import Files from '../files.js';
import pathToRegexp from 'path-to-regexp';

/**
 * Publish files for the given user
 *
 * @param {Object} params
 * @param {String} params.ownerId   Owner Id
 * @param {String} params.path      Path in a path-to-regexp format
 */
Meteor.publish('files', ({
  ownerId = required(),
  path = '/',
} = {}) =>
  Files.find({
    ownerId,
    _tag: 'file',
    path_lower: pathToRegexp(path),
  }, {
    fields: {
      ownerId: 1,
      _tag: 1,
      name: 1,
      path_lower: 1,
      path_display: 1,
      media_info: 1,
      url: 1,
    },
  })
);

/**
 * Publish folders for the given user
 *
 * @param {Object} params
 * @param {String} ownerId  Owner Id
 */
Meteor.publish('files.folders', ({
  ownerId = required(),
}) =>
  Files.find({
    ownerId,
    _tag: 'folder',
  }, {
    fields: {
      ownerId: 1,
      _tag: 1,
      name: 1,
      path_lower: 1,
      path_display: 1,
      media_info: 1,
      url: 1,
    },
  })
);

