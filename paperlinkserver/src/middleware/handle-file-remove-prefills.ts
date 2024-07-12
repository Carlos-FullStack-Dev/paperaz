import { BadRequest } from '@feathersjs/errors';
import { Request, Response, NextFunction } from 'express';
import app from '../app';
import { DEFAULT_VALUES } from '../utils/constants';
export default () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (req: Request, res: Response, next: NextFunction) => {

    const files:any = req.files
    const file = files?.[0]

    if(file){
      if(req.body.type === DEFAULT_VALUES.fileUploadType.FILE){
        
        try {
          const user = await app.services.users.get(req.body.userId)
          console.log(user)
          if(!user){
            throw new Error("no user found")
          }
          // leaves reward
        


        } catch (error) {
          console.log(error)
          throw new BadRequest("failed to clean file")
        }
      }

    }else{
      return next();
    }


  };
}
