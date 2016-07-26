import { Accounts } from 'meteor/accounts-base';
import { Job } from 'meteor/vsivsi:job-collection';
import DropboxJobs from '../../api/jobs/dropbox.js';
import debug from 'debug';

const log = debug('app:accounts');

Accounts.onCreateUser((options, user) => {
  log(`New user ${user._id} beeing created`);

  const output = user;

  // By default profile is automatically pasted in the user
  if (options.profile) {
    output.profile = options.profile;
  }

  // Prepare a Job, so files will be synced after the user is created
  const job = new Job(DropboxJobs, 'notification', {
    list_folder: {
      accounts: [user.services.dropbox.account_id],
    },
  });

  job.save();

  return output;
});

