import express from 'express';
import { Authentication } from './../middleware/index';
import { StorageController } from '../controllers/';

let router = express.Router();

router
 .get('/folders/content', Authentication.authenticate, StorageController.getFolderContent)
 .get('/files', Authentication.authenticate, StorageController.getFile)
 .post('/files', Authentication.authenticate, StorageController.uploadFile);

export default router;