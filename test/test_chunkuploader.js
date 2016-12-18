import {assert} from 'chai/chai'
import { Factory } from '../src/'
var array = new Array(1024 * 1024 * 2);
for (var i = 0; i < array.length; i++) {
    array[i] = 1;
}
var factory = new Factory();
var chunkSize = 500 * 1024;
describe('chunk uploader send file', function () {
    var splice = 5;
	this.timeout(50000);
    it('chunk send one file', function (done) {
        var uploader = factory.getUploader({url: 'http://localhost:3000/upload', chunk: true, chunkSize});
        uploader.addFile(new File(array, '1.txt', {type: 'text/plain'}));
        let count = 0;
        let error = null;
        uploader.on('complete', () => {
            assert.equal(count, splice, 'chunk count error');
            done();
        });
        uploader.on('chunkdone', () => {
            count++;
            var r = uploader.tr.getJson();
            if (count != splice) {
                assert.equal(r.files.size, chunkSize);
            } else {
                assert.equal(r.files.size, 48 * 1024, 'last chunk error');
            }
        });
        uploader.on('error', () => done('transport error'));
        uploader.start();
    });

    it('chunk send multi files', function (done) {
        var uploader = factory.getUploader({url: 'http://localhost:3000/upload'});
        uploader.addFile(new File(array, '1.txt', {type: 'text/plain'}));
        uploader.addFile(new File(array, '2.txt', {type: 'text/plain'}));
        uploader.on('complete', () => done());
        uploader.on('error', () => done('transport error'));
        uploader.start();
    });
});