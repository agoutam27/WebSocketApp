import errorHandler from '../handlers/errorHandler';
import logger from './../../lib/logger';

class Authentication {
    static authenticate(req, res, next) {
        if(!req.headers.authorization) {
            logger.debug(`Rejecting request from middleware`);
            errorHandler.sendError(res, 401);
            return;
        }
        next();
    }
}

export default Authentication;