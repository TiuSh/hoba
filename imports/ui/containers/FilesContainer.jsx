import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Files from '../../api/files/files.js';
import FilesList from '../pages/FilesList.jsx';
import pathToRegexp from 'path-to-regexp';

export default createContainer(({ owner, currentPath }) => {
  const path = `${currentPath}/:filename`;

  // Only files from the current path are loaded
  const loading = !Meteor.subscribe('files', {
    ownerId: owner._id,
    path,
  }).ready();

  // Filter files to display only files with a public URL
  const files = Files.find({
    _tag: 'file',
    path_lower: pathToRegexp(path),
    url: {
      $exists: 1,
    },
  }).fetch();

  return {
    loading,
    files,
  };
}, FilesList);
