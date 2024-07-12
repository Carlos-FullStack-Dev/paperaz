import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const handleResult = async (context: any) => {
  context.result = 'you did it, you are the best';
  return context;
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [handleResult],
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
