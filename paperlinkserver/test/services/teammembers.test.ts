import assert from 'assert';
import app from '../../src/app';

describe('\'teammembers\' service', () => {
  it('registered the service', () => {
    const service = app.service('teammembers');

    assert.ok(service, 'Registered the service');
  });
});
