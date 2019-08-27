import routes from './routes.js';
import {WebSocketController} from '../controllers';

const initRoutes = (app, isWsEnabled) => {
  // Set up authentication middleware here, but there might be some apis not requiring authentication
  app.use(`/v1`, routes);

  isWsEnabled && app.ws(`/websocket`, WebSocketController.attachEvents);
};

export default initRoutes;
