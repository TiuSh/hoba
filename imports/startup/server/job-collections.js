import { Meteor } from 'meteor/meteor';
import DropboxJobs from '../../api/jobs/dropbox.js';

// Jobs processors
import '../../api/jobs/server/dropbox.js';

Meteor.startup(() => {
  // Start DropboxJobs job server
  DropboxJobs.startJobServer();
});

