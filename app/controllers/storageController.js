import request from 'request';
import requestHelper from '../../lib/requestHelper';
import ENDPOINT from './../Constants/endpoints';
import responder from '../../lib/expressResponder';
import logger from './../../lib/logger';

const BASE_URL = ENDPOINT.BASE_URL + ENDPOINT.URL_SEPARATOR + ENDPOINT.COMP_URL;

const rqComp = new requestHelper(BASE_URL);

class StorageController {

    static getFolderContent(req, res, next) {

        if(!req.query.path) {
            responder.operationFailed(res, "unspecified path");
            return;
        }

        const headers = {
            Authorization: req.headers.authorization
        }

        const queryParams = {
            path: req.query.path,
            pageSize: req.query.pageSize,
            orderBy: req.query.orderBy
        }

        request(rqComp.getParams(ENDPOINT.FOLDER_CONTENTS, queryParams, headers)).pipe(res);
        
        // request.get(ENDPOINT.FOLDER_CONTENTS, queryParams, headers)
        //     .then(result => {
        //         logger.debug(`Response from ${ENDPOINT.FOLDER_CONTENTS}`, result);
        //         responder.success(res, result);
        //     })
        //     .catch(error => {
        //         logger.error(`Error from ${ENDPOINT.FOLDER_CONTENTS}`, error);
        //         responder.operationFailed(res, error);
        //     })
        
    }

    static getFile(req, res, next) {

        if(!req.query.path) {
            responder.operationFailed(res, "unspecified path");
            return;
        }

        const headers = {
            Authorization: req.headers.authorization
        }

        const queryParams = {
            path: req.query.path,
        }

        request(rqComp.getParams(ENDPOINT.FILES, queryParams, headers)).pipe(res);
    }

    static uploadFile(req, res, next) {

        if(!req.query.path) {
            responder.operationFailed(res, "unspecified path");
            return;
        }

        const queryParams = {
            path: req.query.path,
            chunkedUpload: req.query.chunkedUpload
        }
        
        req.pipe(request(rqComp._getURL(ENDPOINT.FILES, queryParams))).pipe(res);

    }

}

export default StorageController;