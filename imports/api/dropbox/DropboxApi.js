import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import required from '../required.js';

// Dropbox API version
const version = '2';
// Dropbox domain
const domain = 'dropboxapi.com';
// Host for RPC-style routes
const hostApi = 'api';
// Host for upload and download-style routes
const hostContent = 'content';
// Host for longpoll routes
const hostNotify = 'notify';

/**
 * DropboxApiError
 */
export class DropboxApiError extends Error {
  /**
   * DropboxApiError constructor
   *
   * @param {String} message
   * @param {String} filename
   * @param {Int} lineNumber
   */
  constructor(message, filename, lineNumber) {
    super(message, filename, lineNumber);

    this.name = 'DropboxApiError';
  }
}

/**
 * DropboxApi
 */
export default class DropboxApi {
  /**
   * DropboxApi constructor
   *
   * @param {Object} param
   * @param {String} param.accessToken Dropbox user accessToken
   */
  constructor({
    accessToken,
  } = {}) {
    this._accessToken = accessToken;
  }

  /**
   * Build api route url
   *
   * @param {Object} param
   * @param {String} param.route
   * @param {String} param.host
   *
   * @return {String} URL
   */
  static getRouteUrl({
    route = required(),
    host = hostApi,
  }) {
    return `https://${host}.${domain}/${version}/${route}`;
  }

  /**
   * accessToken getter
   *
   * @return {String} Dropbox accessToken
   */
  get accessToken() {
    return this._accessToken;
  }

  /**
   * accessToken setter
   *
   * @param {String} accessToken
   */
  set accessToken(accessToken) {
    this._accessToken = accessToken;
  }

  /**
   * RPC endpoints
   *
   * @param {Object} param
   * @param {String} param.endpoint
   * @param {Object} param.args
   *
   * @return {Promise<Object,DropboxApiError>}
   */
  rpc({
    endpoint = required(),
    args,
  } = {}) {
    const url = DropboxApi.getRouteUrl({ host: hostApi, route: endpoint });
    const headers = {};
    let query = '';

    // If executed on client side we set headers to prevent CORS preflight
    if (Meteor.isClient) {
      headers['Content-Type'] = 'text/plain; charset=dropbox-cors-hack';
      query = `authorization=Bearer ${this.accessToken}&reject_cors_preflight=true`;
    } else if (Meteor.isServer) {
      headers['Content-Type'] = 'application/json';
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return new Promise(
      (resolve, reject) => {
        HTTP.post(url, {
          query,
          headers,
          data: args,
        }, (error, result) => {
          if (error) {
            reject(new DropboxApiError(error));

            return;
          }

          const content = EJSON.parse(result.content);
          resolve(content);
        });
      }
    );
  }

  /**
   * Content-upload endpoints
   *
   * @param {Object} param
   * @param {String} param.endpoint
   * @param {Object} param.args
   *
   * @return {Promise<Object,DropboxApiError>}
   */
  upload({
    endpoint = required(),
    args,
  } = {}) {
    // TODO
  }

  /**
   * Content-download endpoints
   *
   * @param {Object} param
   * @param {String} param.endpoint
   * @param {Object} param.args
   *
   * @return {Promise<Object,DropboxApiError>}
   */
  download({
    endpoint = required(),
    args,
  } = {}) {
    // TODO
  }

}

