import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Files from '../../api/files/files.js';
import FoldersList from '../pages/FoldersList.jsx';
import pathToRegexp from 'path-to-regexp';

export default createContainer(({ owner, currentPath }) => {
  const pathReg = `${currentPath}/:foldername`;

  const loading = !Meteor.subscribe('files.folders', {
    ownerId: owner._id,
  }).ready();

  const folders = Files.find({
    _tag: 'folder',
    path_lower: pathToRegexp(pathReg),
  }).fetch();

  return {
    loading,
    folders,
  };
}, FoldersList);
