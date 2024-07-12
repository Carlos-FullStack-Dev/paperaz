import assert from 'assert';
import app from '../../src/app';

describe('\'handleFileQue\' service', () => {
  it('registered the service', () => {
    const service = app.service('handle-file-que');

    assert.ok(service, 'Registered the service');
  });
});
