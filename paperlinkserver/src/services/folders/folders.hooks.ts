import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import getFolderRelatedHook from '../../hooks/get-folder-related-hook';
import { DEFAULT_VALUES } from '../../utils/constants';
import app from '../../app';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;


const orderFolder = async (context: any) => {
  if (context.data.action === 'orderFolder') {
    const order = context.data.order
    await order.map(async (folder: any) => {
      try {
        await app.services.folders.patch(folder.folderId, { position: folder.position })
      } catch (error) {
        console.log(error)
      }
    })
    context.result = 'updated successfully'
  }
  return context
}

const countPages = async (context: any)=>{
  let count = 0;
  const folders:any = context.result.data
  folders.map((folder:any)=>{
      folder.files.map((file:any)=>{
        count += file.pages
      })
  })
  context.result = {totalPages:count, ...context.result}
  return context
}


export default {
  before: {
    all: [  ],
    find: [getFolderRelatedHook()],
    get: [getFolderRelatedHook()],
    create: [orderFolder],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [countPages],
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
