import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import ExplorerPage from '../pages/ExplorerPage.jsx';

export default createContainer(({ params, queryParams }) => {
  const cleanedParams = Object.assign({}, params);

  cleanedParams.path = params.path ?
    `/${params.path}`
    : '';

  const loading = !Meteor.subscribe('users.profile', {
    userId: cleanedParams.userId,
  }).ready();

  const owner = Meteor.users.findOne({
    _id: cleanedParams.userId,
  });

  return {
    params: cleanedParams,
    queryParams,
    loading,
    owner,
  };
}, ExplorerPage);
