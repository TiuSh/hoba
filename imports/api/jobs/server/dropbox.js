import { Meteor } from 'meteor/meteor';
import { Job } from 'meteor/vsivsi:job-collection';
import DropboxApi from '../../dropbox/DropboxApi.js';
import DropboxCollection from '../../dropbox/DropboxCollection.js';
import DropboxJobs from '../dropbox.js';
import Files from '../../files/files.js';
import isImage from 'is-image';
import debug from 'debug';

// Debug log helper
const log = debug('app:dropbox-jobs');

// Dropbox notification job
DropboxJobs.processJobs(
  'notification',
  {
    concurrency: 1,
    payload: 1,
    pollInterval: 5000,
    prefetch: 1,
  },
  (job, cb) => {
    log('[notification] Processing notification');

    // Load DropboxCollection library
    const dc = new DropboxCollection({ collection: Files });
    // Read notification data
    const notification = job.data;
    // Prepare promises buffer
    const promises = [];

    // list_folder.accounts contains the list of Dropbox accounts recently updated
    notification.list_folder.accounts.forEach(value => {
      // Find the Meteor user corresponding to the Dropbox account
      const user = Meteor.users.findOne({ 'services.dropbox.account_id': value });

      // If no user found
      if (!user) {
        log(`[notification] User "${value}" not found !`);

        // Next
        return;
      }

      // Sync the given user using the Dropbox API
      const promise = dc.sync({ ownerId: user._id });

      // Add the promise to the buffer
      promises.push(promise);
    });

    // Once all users have been correctly synced
    Promise.all(promises)
      .then(results => {
        log('[notification] Job completed !');

        // For now, new files synced are not yet "shared" by Dropbox.
        // It means these files won't have a public URL.

        // results contains the list of files synced we want to "share" on Dropbox
        results.forEach(files => {
          files.forEach(file => {
            // We share only media file we will be able to display in the gallery
            // and that were not already shared.
            if (file._tag === 'file'
              && isImage(file.path_lower)
              && !file.url
            ) {
              // As this will request multiple calls to the Dropbox API,
              // we prepare a new async Job for each file.
              const shareJob = new Job(DropboxJobs, 'createSharedLink', file);
              shareJob.save();
            }
          });
        });

        // Mark the job as done
        job.done();
        cb();
      })
      .catch(err => {
        log('[notification] Job failed...');
        log(err);

        // Mark the job as failed
        job.fail();
        cb();
      });
  }
);


// Dropbox shared link creation job
DropboxJobs.processJobs(
  'createSharedLink',
  {
    concurrency: 1,
    payload: 1,
    pollInterval: 5000,
    prefetch: 1,
  },
  (job, cb) => {
    log('[createSharedLink] Sharing file');

    // Dropbox file
    const file = job.data;
    // Meteor user
    const user = Meteor.users.findOne({ _id: file.ownerId });
    // Dropbox API
    const dropbox = new DropboxApi({ accessToken: user.services.dropbox.accessToken });
    // Dropbox collection
    const col = new DropboxCollection({ collection: Files });

    // Call the Dropbox API to share the given file
    dropbox.rpc({
      endpoint: 'sharing/create_shared_link_with_settings',
      args: {
        path: file.path_display,
      },
    }).then(result => {
      log('[createSharedLink] File shared');

      // If correctly shared we update the file in the local collection
      // with the new public URL.
      col.updateFile({
        ownerId: user._id,
        file: result,
      });

      log('[createSharedLink] File synced');

      // Mark job as done
      job.done();
      cb();
    }).catch(error => {
      log('[createSharedLink] File sharing failed...');
      log(error);

      // Mark job as failed
      job.fail();
      cb();
    });
  }
);

