import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import getBillingsRelatedHook from '../../hooks/get-billings-related-hook';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [  ],
    find: [getBillingsRelatedHook()],
    get: [getBillingsRelatedHook()],
    create: [authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
