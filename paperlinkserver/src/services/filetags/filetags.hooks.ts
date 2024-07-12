import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import getFiletagRelatedHook from '../../hooks/get-filetag-related-hook';
import { application } from '@feathersjs/express';
import app from '../../app';
import { BadGateway } from '@feathersjs/errors';

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const splitTags = async (context: any)=>{
  if(context.data.tags){
    const data:any =[]
    context.data.tags.map(async (tag:any) =>{
      data.push({
        tag:tag,
        fileId:context.data.fileId
      })
      })
     const createTag = app.services.filetags.create(data)
     console.log(createTag)
     context.result =  createTag
     return context;
  }
   throw new BadGateway('no provided') 
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [getFiletagRelatedHook()],
    get: [getFiletagRelatedHook()],
    create: [splitTags],
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
