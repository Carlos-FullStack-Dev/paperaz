import { Request, Response, NextFunction } from 'express';
import app from '../app';
import { DEFAULT_VALUES } from '../utils/constants';
import {PDFDocument, rgb, scale, StandardFonts, degrees} from 'pdf-lib';
import fetch from 'node-fetch'


export default () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (req: Request, res: Response, next: NextFunction) => {

    const files:any = req.files
    const file = files?.[0]

    if(file){
      if(req.body.type === DEFAULT_VALUES.fileUploadType.FILE){
        const user = await app.services.users.get(req.body.userId)
        try {
          if(!user){
            res.statusCode = 400;
            res.end( "no user found")
          }
          // leaves reward
          const leaves = await app.services.leaves.find()
          let reward = 0
          //@ts-ignore
          leaves.map((leaf:any) =>{
             if (leaf.action === DEFAULT_VALUES.fileActions.SAVED){
              reward =leaf.leavesPerAction
             }
          })
          //update file
          //if uploaded by a team member
          let userId = req.body.userId
          let uploadedBy = null
            if (user.role === DEFAULT_VALUES.users.roles.TEAM_MEMBER){
               userId = user.teamId;
               uploadedBy = user.id;
            }

          //get file number

          const pdf = await fetch(file.location).then(res => res.arrayBuffer())
          const pdfDoc = await PDFDocument.load(pdf)
          let numberOfPages:any = pdfDoc.getPages().length
          const usersFile:any = await app.services.files.find({query:{userId}})

           const newFile = await app.services.files.create({
             fileName: file.originalname,
             downloadLink:file.location,
             paperLink: Date.now().toString(),
             key:file.key,
             userId: user.id,
             role:user.role,
             userName:user.firstName +" "+user.lastName,
             leavesEarned:reward,
             uploadedBy:uploadedBy,
             pages:numberOfPages,
             position: usersFile.total + 1,
            })

            await app.services.users.patch(req.body.userId,{
              totalPages: user.totalPages + numberOfPages
            })


          return res.status(201).json(newFile).end();

        } catch (error) {
          console.log(error)
          res.statusCode = 400;
          res.end("failed to upload file")
        }
      }else if(req.body.type === DEFAULT_VALUES.fileUploadType.PROFILE_PICTURE){
        const updateUser = await app.services.users.patch(req.body.userId,{profilePicture:file.location})
        console.log("profile picture updated")
        return res.status(201).json(updateUser).end();
      }else if(req.body.type === DEFAULT_VALUES.fileUploadType.SIGNATURE){
        const updateUser = await app.services.users.patch(req.body.userId,{signatureURL:file.location})
        console.log("signature updated")
        return res.status(201).json(updateUser).end();
      }else if(req.body.type === DEFAULT_VALUES.fileUploadType.INITIAL){
        const updateUser = await app.services.users.patch(req.body.userId,{initialURL:file.location})
        console.log("initial updated")
        return res.status(201).json(updateUser).end();
      }else if(req.body.type === DEFAULT_VALUES.fileUploadType.PDF){
          return res.status(201).json(file).end();
      }

    }else{
      return next();
    }


  };
}
