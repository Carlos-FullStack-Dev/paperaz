require("dotenv").config();
import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import app from '../../app';
import { sendPermissionRequest } from '../../utils/email-sender/permission-request';
import jwt from 'jsonwebtoken'
import { sendPermissionGranted } from '../../utils/email-sender/permission-granted';
import { BadRequest } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const requestPermission =async (context:any)=>{
    if(context.data.action === 'request_permission' ){
      const file = await app.services.files.get(context.data.fileId);

      const checkIfRequested:any = await app.services.permissions.find({query:{fileId:file.id, email:context.data.email}})
      console.log(checkIfRequested.length)
      let fileOwner = await app.services.users.get(file.userId)

      if(checkIfRequested.length > 0){
        context.result = 'you have requested permission already'
      }
      context.data.fileOwnerId = fileOwner.id
      context.data.permissionUniqueId = Date.now().toString() + Math.floor(Math.random() * 10000) + 1; 
      const secret = await app.get('authentication').secret
      const token = jwt.sign({
        data: context.data
      }, secret);
      const user ={
        name: context.data.name,
        email: context.data.email
      }
      await sendPermissionRequest(fileOwner, user, `${process.env.APP_URL}/paperlink-pages/?permissiontoken=${token}`, file.fileName)
    }
    return context
}

const inviteGrantPermission =async (context:any)=>{
    if(context.data.action === 'invite_n_grant_permission' ){
      const file = await app.services.files.get(context.data.fileId);
      let fileOwner = await app.services.users.get(file.userId)
      const checkIfRequested:any = await app.services.permissions.find({query:{fileId:file.id, email:context.data.email}})
      if(checkIfRequested.length > 0){
        context.result = 'you have requested permission already'
      }else{
        context.data.fileOwnerId = fileOwner.id
        context.data.user = fileOwner
        context.data.file = file
        context.data.isGranted = true
      }

      context.data.permissionUniqueId = Date.now().toString() + Math.floor(Math.random() * 10000) + 1; 
      const guest ={
        email: context.data.email
      }
      await sendPermissionGranted(fileOwner, guest, `${process.env.APP_URL}/pdf/${file.paperLink}?permissiontoken=${context.data.permissionUniqueId}`, file)

    }
    return context
}

const updatePermission =async (context:any)=>{
    if(context.data.action === 'update_permission' ){
      const permission = await app.services.permissions.get(context.id);
      const file = await app.services.files.get(permission.fileId);
      const user = await app.services.users.get(permission.fileOwnerId)

      const guest={
        name: permission.name,
        email: permission.email,
      }

      await sendPermissionGranted(user, guest, `${process.env.APP_URL}/pdf/${file.paperLink}?permissiontoken=${permission.permissionUniqueId}`, file)

    }
    return context
}



export default {
  before: {
    all: [ ],
    find: [],
    get: [],
    create: [requestPermission, inviteGrantPermission],
    update: [],
    patch: [updatePermission],
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
