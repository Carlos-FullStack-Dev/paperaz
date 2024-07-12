import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
// import { sendEmail} from '../../utils/sendEmail';
import { sendRequestMail } from '../../utils/Mail/sendRequestEmail'
import { BadRequest } from '@feathersjs/errors'
import app from '../../app'
import { DEFAULT_VALUES } from '../../utils/constants'
import { sendReferalMail } from '../../utils/Mail/sendReferralEmail'
import { sendInviteMail } from '../../utils/Mail/sendInviteEmail'
import { sendSaveFile } from '../../utils/email-sender/save-file'
import { sendFileActionUser } from '../../utils/email-sender/file-action-user'
import { sendFileActionBusiness } from '../../utils/email-sender/file-action-business'
import { sendTeamInvite } from '../../utils/email-sender/team-invitation'
import { sendAdminInvite } from '../../utils/email-sender/admin-invitation'
import { sendRegistrationEmail } from '../../utils/email-sender/registration'
import jwt from 'jsonwebtoken'
import { BadGateway, NotFound, NotImplemented } from '@feathersjs/errors'
import { shareToGuest } from '../../utils/email-sender/guest-share'
import { shareLink } from '../../utils/email-sender/share-link'
import { sendContactUsMail } from '../../utils/email-sender/contactUs'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

const ShareLinkToGuest = async (context: any) => {
  console.log(context.data)
  if (context.data.action === 'shareLink') {
    await shareLink(context.data.email, context.data.link, context.data.title)
    context.result = 'file sent to mail'
  }
  return context
}

const InviteLink = async (context: any) => {
  if (context.data.action === DEFAULT_VALUES.emailAction.INVITE_LINK) {
    const business = await app.services.users.get(context.data.userId)
    
    let teamMember
    let link = process.env.APP_URL || 'https://paperlink.app'
    let token
    const checkNewUser: any = await app.services.users.find({ query: { email: context.data.email } })
    teamMember = checkNewUser.data[0]


    if (checkNewUser.total === 0) {
       const newUser = await app.services.users.create({
          email: context.data.email,
          password: 'AMillionReasonToGoPaperless',
          role: DEFAULT_VALUES.users.roles.FREE_USER,
          isEmailVerified: true
        })
        await app.services.teammembers.create({
          userId: newUser.id,
          teamsId: business.teamId,
          ownersId: business.id,
          companyName: business.companyName,
          companyFirstName: business.firstName,
          companyLastName:  business.lastName,
          companyProfilePicture :business.profilePicture,
          businessPage : business.businessPage,
          companyEmail:  business.email,
          teamMemberEmail:  newUser.email,
        })
        teamMember = newUser
    }else{
      const checkIfUserIsAlreadyInTeam:any = await app.services.teammembers.find({query: {userId: checkNewUser.data[0].id, teamsId: business.teamId}})
      if(checkIfUserIsAlreadyInTeam.total === 0){
        await app.services.teammembers.create({
          userId: checkNewUser.data[0].id,
          teamsId: business.teamId,
          ownersId: business.id,
          companyName: business.companyName,
          companyFirstName: business.firstName,
          companyLastName:  business.lastName,
          companyProfilePicture :business.profilePicture,
          businessPage : business.businessPage,
          companyEmail:  business.email,
          teamMemberEmail:  checkNewUser.data[0].email,
         })
      }
    }

    const secret = await app.get('authentication').secret
     token = jwt.sign(
      {
        data: {
          userId: teamMember.id,
          email: context.data.email
        }
      },
      secret,
      { expiresIn: 1000 * 60 }
    )

    link = process.env.APP_URL + `/?team_reset_token=${token}`

    sendTeamInvite(context.data.email, business, link)
    context.result = teamMember
  }

  return context
}

const JoinAdmin = async (context: any) => {
  if (context.data.action === 'join_admin') {
    const user: any = await app.services.users.find({ query: { email: context.data.email } })
    if (user.total > 0) {
      sendAdminInvite(user.data[0], context.params.user, context.data.link)
      context.result = 'invite link sent succesfully'
    } else {
      throw new BadRequest('email must belong to a user')
    }
    return context
  }
  return context
}

const ReferralLink = async (context: any) => {
  if (context.data.action === DEFAULT_VALUES.emailAction.REFERRAL_LINK) {
    if (context.data.emails.length > 0) {
      await context.data.emails.map(async (email: any) => {
        sendReferalMail(email, context.data.link)
      })
      context.result = 'Referral link sent succesfully'
      return context
    } else {
      throw new BadRequest('email must be provided')
    }
  }
  return context
}

// const SaveAction = async (context: any) =>{
//      if(context.data.action === 'save'){
//       const attachment = await  context.data.editedFileLink ?? context.data.link;
//       const file = await app.services.files.get(context.data.fileId)
//       await sendSaveFile(context.params.user, attachment, file)
//       context.result = 'file saved'
//     }
//     return context
// }
const shareFileToGuest = async (context: any) => {
  if (context.data.action === 'shareFileToGuest') {
    const file = await app.services.files.get(context.data.fileId)
    if (!file) {
      throw new Error('file not found')
    }
    await shareToGuest(context.data.email, file, context.data.editedFileLink, context.data.name)
    context.result = 'file sent to mail'
  }
  return context
}

const FileAction = async (context: any) => {
  if (
    context.data.action === 'complete' ||
    context.data.action === 'confirm' ||
    context.data.action === 'sign'
  ) {
    if (!context.data.editedFileLink && !context.data.fileId) {
      throw new Error('you must add editedFileLink, fileId and userId')
    }
    const attachment = context.data.editedFileLink ?? context.data.link
    const file = await app.services.files.get(context.data.fileId)
    const business = await app.services.users.get(file.userId)
    await sendFileActionBusiness(business, attachment, file, context.data.action, context.data.name)
    context.result = context.data.action + ' success'
  }
  return context
}

const contactUs = async (context: any) => {
  if (context.data.action === 'contactUs') {
    if (!context.data.firstName && !context.data.lastName && !context.data.email && !context.data.message) {
      throw new Error('you must provide firstName, lastName, email and message')
    }
    await sendContactUsMail(context.data)
    context.result = 'email sent successfully'
  }
  return context
}

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      ShareLinkToGuest,
      // addUserToParam,
      // sendRequest,
      ReferralLink,
      // ShareFile,
      InviteLink,
      // SaveAction,
      FileAction,
      JoinAdmin,
      shareFileToGuest,
      contactUs
    ],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
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
}
