import { Meteor } from 'meteor/meteor';
import required from '../required.js';
import DropboxApi from './DropboxApi.js';

/**
 * DropboxCollection
 */
export default class DropboxCollection {
  /**
   * DropboxCollection constructor
   *
   * @param {Meteor.Collection} collection
   */
  constructor({
    collection = required(),
  } = {}) {
    this._collection = collection;
  }

  /**
   * Clean a Dropbox file object
   * to make it "database safe"
   *
   * @param {Object} param
   * @param {Object} param.file
   *
   * @return {Object} Cleaned file
   */
  static clean({
    file = required(),
  } = {}) {
    if (!(file instanceof Object)) {
      return file;
    }

    const formatedFile = {};

    for (let idx in file) {
      if (Object.hasOwnProperty.call(file, idx)) {
        const value = file[idx];

        switch (idx) {
          case 'id':
            idx = 'dropboxId';
            break;
          case '.tag':
            idx = '_tag';
            break;
          default:
            break;
        }

        formatedFile[idx] = DropboxCollection.clean({
          file: value,
        });
      }
    }

    return formatedFile;
  }

  /**
   * Sync Dropbox files in a Meteor collection
   *
   * @param {String} ownerId
   *
   * @return {Promise}
   */
  sync({
    ownerId = required(),
  } = {}) {
    const user = Meteor.users.findOne({ _id: ownerId });

    if (!user) {
      throw new Error(`User "${ownerId}" not found`);
    }

    if (!user.services.dropbox) {
      throw new Error('User should be connected on Dropbox');
    }

    // User's Dropbox accessToken
    const accessToken = user.services.dropbox.accessToken;
    // User's Dropbox cursor
    const cursor = user.services.dropbox.cursor;
    // Dropbox Api request params
    const requestParams = {};

    // If a cursor already exists only request files' updates.
    // Else we request the full list of files.
    if (cursor) {
      requestParams.endpoint = 'files/list_folder/continue';
      requestParams.args = {
        cursor,
      };
    } else {
      requestParams.endpoint = 'files/list_folder';
      requestParams.args = {
        path: '',
        include_media_info: true,
        recursive: true,
      };
    }

    // Dropbox API
    const dropbox = new DropboxApi({ accessToken });

    // Execute api request
    return dropbox.rpc(requestParams)
      .then(result => {
        // Prepare files buffer
        let syncedFiles = [];

        // Sync each file
        result.entries.forEach(file => {
          const syncedFile = this.updateFile({
            ownerId: user._id,
            file,
          });

          // If the file has not been deleted, we add it to the buffer
          if (syncedFile) {
            syncedFiles.push(syncedFile);
          }
        });

        // Update user's cursor
        Meteor.users.update(user._id, { $set: { 'services.dropbox.cursor': result.cursor } });

        // Loop if there's more files
        if (result.has_more) {
          syncedFiles = this.sync({ user }).then(files => syncedFiles.concat(files));
        }

        // Return the list of synced files (does not contain deleted files)
        return syncedFiles;
      });
  }

  /**
   * Update a Dropbox file in collection
   *
   * @param {String} ownerId
   * @param {Object} file
   *
   * @return {Object} Synced file as it has been inserted in db or NULL if it has been deleted
   */
  updateFile({
    ownerId = required(),
    file = required(),
  } = {}) {
    let formatedFile;

    // If file has been deleted
    if (file['.tag'] === 'deleted') {
      // Delete it from the collection based on it's path
      this._collection.remove({
        path_lower: file.path_lower,
        ownerId,
      });

      formatedFile = null;
    } else {
      // Format file fields
      formatedFile = DropboxCollection.clean({ file });
      // Add ownerId to the file
      formatedFile.ownerId = ownerId;

      // Upsert file based on it's id
      const _id = this._collection.update({
        dropboxId: formatedFile.dropboxId,
        ownerId,
      }, {
        $set: formatedFile,
      }, {
        upsert: true,
      });

      // Update id
      formatedFile._id = _id;
    }

    return formatedFile;
  }
}

