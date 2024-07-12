// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import app from '../app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if(context.params?.user){
      const {user} = context.params;
      context.data.userId = context.params.user?.id
    }

    if(context.params.query?.userId){
      const user = await app.services.users.get(context.params.query?.userId)
      if(user){
        context.params.user = user
        context.data.userId = context.params.user?.id
      }
    }

    if(context.data.userId){
      const user = await app.services.users.get(context.data?.userId)
      if(user){
        context.params.user = user
        context.data.userId = context.params.user?.id
      }

    }
    return context;
  };
};
