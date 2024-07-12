import { HooksObject } from '@feathersjs/feathers';
import app from '../../app';


const setPosition =async (context: any)=>{

  const n: any = await app.services.faq.find()
  context.data.position = n.length
   return context
}


const orderFAQ = async (context: any) => {
  if (context.data.action === 'orderFAQ') {
    const order = context.data.order
    await order.map(async (faq: any) => {
      try {
        await app.services.faq.patch(faq.id, { position: faq.position })
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
    find: [],
    get: [],
    create: [setPosition, orderFAQ],
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
