import chai from 'chai';
import replay from 'replay';
import httpMocks from 'node-mocks-http';
import StorageController from '../app/controllers/storageController';

process.env.NODE_ENV = 'Testing';
replay.mode = 'record';
const expect = chai.expect;

describe('Testing routes for storageController', () => {

  describe('storageController.getFolderContent', () => {

    it('should give response status 200', (done) => {
      const req = httpMocks.createRequest({
          method: 'GET',
          url: '/folders/contents',
          query: {
            path: '/'
          },
          headers: {
            Authorization: 'User 3uOjRhMp+fXCSOY8Qzo82zfRFuPW1/JIjo4l2S9b+NQ=, Organization 58b4f6b5bf0d8532623b9710a8a88493, Element nihSBepnyZvn92JxVD0xW4LFbehA3NaV1FCinHMyYGg='
          }
        }),
        res = httpMocks.createResponse({
          eventEmitter: require('events').EventEmitter
        });
      res.on('end', () => {
        expect(res.statusCode).to.equal(200);
        done();
      });
      StorageController.getFolderContent(req, res); // res.send should be called after res.on('end')
    });

    it('should give response status 401', (done) => {
      let req, res;
      [req, res] = [httpMocks.createRequest({
          method: 'GET',
          url: '/folders/contents',
          query: {
            path: '/'
          },
          headers: {
            Authorization: 'Basic wrong-token'
          }
        }),
        httpMocks.createResponse({
          eventEmitter: require('events').EventEmitter
        })
      ];
      res.on('end', () => {
        expect(res.statusCode).to.equal(401);
        done();
      });
      StorageController.getFolderContent(req, res);
    });

  });

});