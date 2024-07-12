import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import isAdmin from '../../hooks/is-admin'
import isFreeUser from '../../hooks/is-free-user';

import packageHook from '../../hooks/package-hook';
import getPackagesRelatedHook from '../../hooks/get-packages-related-hook';


const { authenticate } = authentication.hooks;

const getDefaultPackages = async (context:any)=>{
  if(context.params.query.type === 'default'){
    context.params.query.$limit = 3;
  }
  return context
}


export default {
  before: {
    all: [ ],
    find: [getPackagesRelatedHook(), getDefaultPackages],
    get: [getPackagesRelatedHook()],
    create: [authenticate('jwt'), packageHook()],
    update: [],
    patch: [],
    remove: []
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
