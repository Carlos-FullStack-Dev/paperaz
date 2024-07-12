import { HooksObject } from '@feathersjs/feathers';
import app from '../../app';
import getRelatedHook from '../../hooks/get-category-related-hook';


const setPostion =async (context: any)=>{

  const n: any = await app.services.categories.find()
  context.data.position = n.length
   return context
}


const orderCategories = async (context: any) => {
  if (context.data.action === 'orderCategories') {
    const order = context.data.order
    await order.map(async (category: any) => {
      try {
        await app.services.categories.patch(category.id, { position: category.position })
      } catch (error) {
        console.log(error)
      }
    })
    context.result = 'updated successfully'
  }
  return context
}


export default {
  before: {
    all: [],
    find: [getRelatedHook()],
    get: [getRelatedHook()],
    create: [setPostion, orderCategories ],
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
