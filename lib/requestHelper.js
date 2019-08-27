import _ from 'lodash';

class RequestHelper {

  constructor(uribase, defaultheaders) {
    this.base = uribase;
    this.headers = defaultheaders;
  }

  getParams(uri, query, headers) {
    return this._prepareRequest('GET', uri, query, headers, true);
  }

  postParams(uri, body, query, headers) {
    return this._prepareRequest('POST', uri, query, headers, body);
  }

  putParams(uri, body, query, headers) {
    return this._prepareRequest('PUT', uri, query, headers, body);
  }

  patchParams(uri, body, query, headers) {
    return this._prepareRequest('PATCH', uri, query, headers, body);
  }

  deleteParams(uri, query, headers) {
    return this._prepareRequest('DELETE', uri, query, headers, true);
  }

  _prepareRequest(method, uri = {}, query = {}, heads = {}, json) {
    let url = this._getURL(uri, query), headers = this._getHeaders(heads);
    return {method, url, headers, json};
  }

  _getHeaders(headers) {
    return _.extend(headers, this.headers);
  }

  _getURL(uri, query) {
    return `${this.base}/${uri}?${this._getQueryString(query)}`;
  }

  _getQueryString(options) {
    return _.map(_.omitBy(options, _.isUndefined), (value, key) => `${key}=${encodeURIComponent(value)}`).join("&");
  }

  // _call(rq, resolve, reject) {
  //   request(rq, (error, response, body) => {
  //     if(error)
  //       return reject(error);
  //     if(Math.floor(response.statusCode/100) != 2)
  //       return reject(body);
  //     return resolve(body);
  //   });
  // }
}

export default RequestHelper;