import { Picker } from 'meteor/meteorhacks:picker';
import { Job } from 'meteor/vsivsi:job-collection';
import DropboxJobs from '../../api/jobs/dropbox.js';
import bodyParser from 'body-parser';
import url from 'url';
import debug from 'debug';

// Debug log helper
const log = debug('app:router');

// Add a JSON body parser as a middleware to decode Dropbox notifications
Picker.middleware(bodyParser.json());

// Dropbox webhooks root
Picker.route('/dropbox/webhook', (params, req, res) => {
  // Dropbox GET request must be a "challenge request"
  if (req.method === 'GET') {
    log('GET request handled');

    // Parse query params
    const query = url.parse(req.url, true).query;

    // Query must contain the challenge parameter
    if (!query.challenge) {
      res.writeHead(404);
      res.end('404 Not Found');

      // That's all folks
      return;
    }

    // Return the challenge parameter as a validation
    res.end(query.challenge);

    // That's all folks
    return;
  }

  // Dropbox POST notification
  if (req.method === 'POST') {
    log('POST request handled');

    // Body parameter populated by the middleware
    const body = req.body;

    // TODO: Verify Dropbox request signature

    // Prepare an async job with the notification
    const job = new Job(DropboxJobs, 'notification', body);
    job.save();

    // End the request
    res.end();

    // That's all folks
    return;
  }
});

