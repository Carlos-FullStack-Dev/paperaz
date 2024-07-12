import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import addUserId from '../../hooks/add-user-id';
import { Unavailable } from '@feathersjs/errors';
require("dotenv").config();
// Don't remove this comment. It's needed to format import lines nicely.
const stripe = require('stripe')(process.env.STRIPE_S_Key);
const { authenticate } = authentication.hooks;

//stripe verify card check
const verifyCard =async (context:any)=>{

  if(context.data.action === 'testCard'){
   const token = await stripe.tokens.create({
      card: {
        number: context.data.card_number,
        exp_month: parseInt(context.data.exp_month),
        exp_year: parseInt(context.data.exp_year),
        cvc: context.data.cvv,
      },
    })

    if(!token || !token.id){
      throw new Error('couldnt verify card try a different card')
    }
    context.result = 'card is valid'
  }
  return context
}



export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [addUserId(),verifyCard],
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
