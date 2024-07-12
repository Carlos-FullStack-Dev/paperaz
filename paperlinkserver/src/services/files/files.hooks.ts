import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import app from '../../app'
import getFileRelatedHook from '../../hooks/get-file-related-hook'
import { isContext } from 'vm'
import { DEFAULT_VALUES } from '../../utils/constants'
import { BadRequest } from '@feathersjs/errors'
// import { Request, Response, NextFunction } from 'express';

// Don't remove this comment. It's needed to format import lines nicely.
const { authenticate } = authentication.hooks

const checkIfShareWasUpdated = async (context: any) => {
  if (context.data.shared) {
    await app.services['social-share'].create({
      socialMedia: context.data.shared
    })
  }
  return context
}

const saveEditingFile = async (context: any) => {
  if (context.data.isEditing == true) {
    const file = await app.services.files.get(context.data.originalFileId)
    const user = await app.services.users.get(context.data.userId)
    context.data.fileName = file.fileName
    context.data.userId = user.id
    context.data.role = user.role
    ;(context.data.userName = user.firstName + ' ' + user.lastName),
      // context.data.companyName = user.companyName,
      (context.data.leavesEarned = 0),
      (context.data.uploadedBy = user.id)
    context.data.paperLink = new Date().getTime().toString()
  }
  return context
}

const updateFileTag = async (context: any) => {
  if (context.data.action === 'update_tag') {
    context.data.tags = context.data.tags.join(',')
  }
  return context
}

const updateCC = async (context: any) => {
  if (context.data.action === 'update_cc') {
    context.data.cc = context.data.cc.join(',')
  }
  return context
}
const updateTotal = async (userId: string | number) => {
  if (userId) {
    let totalPages = 0
    const userFiles: any = await app.service('files').find({
      query: {
        userId, // Assuming userId is a variable with the user's ID
        tags: null // Find files where the 'tags' property is not equal to 'demo'
      }
    });

    if(userFiles?.total > 0){
      userFiles?.data.map((file:any) => {
        totalPages += file?.pages
      })
      const updateUsers = await app.services.users.patch(userId,{totalPages})
      console.log(totalPages, updateUsers)
   
    }  
  }
  return 
}

const searchFile = async (context: any) => {
  if (context.data.action === 'searchFile') {
    const results = await app.service('files').find({
      query: {
        $or: [
          {
            fileName: {
              $like: `%${context.data.query}%`
            }
          },
          {
            tags: {
              $like: `%${context.data.query}%`
            }
          }
        ],
        filePrivacy: { $ne: DEFAULT_VALUES.filesPrivacy.DO_NOT_POST },
        isDeleted: false,
      }
    })
    context.result = results
  }
  return context
}

const searchFilesWithoutFolder = async (context: any) => {
  if (context.data.action === 'searchFilesWithoutFolder') {
    const results = await app.service('files').find({
      query: {
        $or: [
          {
            fileName: {
              $like: `%${context.data.query}%`
            }
          },
          {
            tags: {
              $like: `%${context.data.query}%`
            }
          }
        ],
        folderId: null,
        filePrivacy: { $ne: DEFAULT_VALUES.filesPrivacy.DO_NOT_POST },
        isDeleted: false,
      }
    })
    context.result = results
  }
  return context
}

const searchFileInFolder = async (context: any) => {
  if (context.data.action === 'searchFileInFolder') {
    const results = await app.service('files').find({
      query: {
        $or: [
          {
            fileName: {
              $like: `%${context.data.query}%`
            }
          },
          {
            tags: {
              $like: `%${context.data.query}%`
            }
          }
        ],
        folderId: context.data.folderId,
        filePrivacy: { $ne: DEFAULT_VALUES.filesPrivacy.DO_NOT_POST },
        isDeleted: false,
      }
    })
    context.result = results
  }
  return context
}

const filesWithoutFolder = async (context: any) => {
  if (context.data.action === 'filesWithoutFolder') {
    let results: any
    let totalPages = 0
    if(context.data.query){
      results = await app.service('files').find({
        query: {
          folderId: null,
          userId: context.data.userId,
          fileName: {
            $like: `%${context.data.query}%`
          },
          $skip: context?.data?.skip ?? 0,
          $limit: context?.data?.limit ?? 10,
          $sort: { position: 1 },
          filePrivacy: { $ne: context.data.showDoNotPost === true ? 'noPrivacy' : 'doNotPost' },
          fileAction: { $ne: null },
          isEditing: 0,
          isDeleted: false,
  
        }
      })
    }else{
      results = await app.service('files').find({
        query: {
          folderId: null,
          userId: context.data.userId,
          $skip: context?.data?.skip ?? 0,
          $limit: context?.data?.limit ?? 10,
          $sort: { position: 1 },
          filePrivacy: { $ne: context.data.showDoNotPost === true ? 'noPrivacy' : 'doNotPost' },
          fileAction: { $ne: null },
          isEditing: 0,
          isDeleted: false,
        }
      })
    }

    results.data.map( (file:any) =>{
      totalPages += file.pages
    })
    
    context.result = { totalPages, ...results}
  }
  return context
}

const orderFile = async (context: any) => {
  if (context.data.action === 'orderFiles') {
    const order = context.data.order
    await order.map(async (file: any) => {
      try {
        await app.service('files').patch(file.fileId, { position: file.position })
      } catch (error) {
        console.log(error)
      }
    })
    context.result = 'updated successfully'
  }
  return context
}
const orderFileInFolder = async (context: any) => {
  if (context.data.action === 'orderFilesInFolder') {
    const order = context.data.order
    await order.map(async (file: any) => {
      try {
        await app.service('files').patch(file.fileId, { positionInFolder: file.positionInFolder })
      } catch (error) {
        console.log(error)
      }
    })
    context.result = 'updated successfully'
  }
  return context
}

const updateUsersFileAfterDelete = async (context: any) => {
  await updateTotal(context.result.userId)
  return context
}

const removedFile = async (context: any) => {
  if (context.data.action === 'removeFile') {
    const file = await app.services.files.get(context.data.fileId);
    try {
      if(file.tags !== 'demo'){
        await app.services.files.patch(context.data.fileId, {isDeleted: true})
      }else{
        await app.services.files.remove(file.id)
      }

    } catch (error) {
      console.log(error)
    }
    context.result = 'file removed successfully'
    await updateTotal(context.data.userId)
  }
  return context
}

const removeFileWithNoAction = async (context: any) =>{
  if(context.data.action === 'removeFileWithNoAction'){
    const user = await app.services.users.get(parseInt(context.data.userId))
    const files:any = await app.service('files').find({query: {fileAction: null, userId: context.data.userId}})
    let filesPages = 0

    await files.data.map(async (file: any) => {
      filesPages += file.pages
      await app.service('files').remove(file.id)
    })
    await updateTotal(context.data.userId)
    context.result = `${filesPages} pages cleaned`
  }
  return context
}

export default {
  before: {
    all: [],
    find: [getFileRelatedHook()],
    get: [getFileRelatedHook()],
    create: [saveEditingFile, searchFile, searchFileInFolder, searchFilesWithoutFolder, orderFile, orderFileInFolder, filesWithoutFolder, removeFileWithNoAction, removedFile],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt'), checkIfShareWasUpdated, updateFileTag, updateCC],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [async(context:any)=>{
      if(context?.params?.user){
        await updateTotal(context.params.user.id)
      }
      return context
    }],
    remove: [ updateUsersFileAfterDelete]
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
}
