export default class PathRegExp extends RegExp {
  /**
   * @param path
   */
  constructor(path) {
    const cleanedPath = path === '/' ? '' : path;
    const pathRegexp = `^${cleanedPath}\\/[^\\/]+$`;

    super(pathRegexp);
  }
}
