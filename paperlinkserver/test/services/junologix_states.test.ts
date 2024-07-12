import assert from 'assert';
import app from '../../src/app';

describe('\'junologix_states\' service', () => {
  it('registered the service', () => {
    const service = app.service('junologix-states');

    assert.ok(service, 'Registered the service');
  });
});
