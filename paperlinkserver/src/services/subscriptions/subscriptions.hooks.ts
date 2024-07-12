import { HooksObject } from '@feathersjs/feathers'
import * as authentication from '@feathersjs/authentication'
import app from '../../app'
import { DEFAULT_VALUES } from '../../utils/constants'
import moment from 'moment'
import { BadRequest } from '@feathersjs/errors'
import getSubscriptionRelatedHook from '../../hooks/get-subscription-related-hook'
import { sendJoinMail } from '../../utils/Mail/sendJoinEmail'
import { findAncestor } from 'typescript'
import { sendPackageSubscription } from '../../utils/email-sender/package-subscription'
import { sendPackageSubscriptionCancel } from '../../utils/email-sender/package-subscription-cancel'
import sendReferralCredit from '../../utils/email-sender/referal-rewards'
import { sendSubscriptionSuccess } from '../../utils/email-sender/subscription-success'
import { userInfo } from 'os'
import addUserId from '../../hooks/add-user-id'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { sendRegistrationEmail } from '../../utils/email-sender/registration'
import { sendWelcomeEmail } from '../../utils/email-sender/welcome'

// Don't remove this comment. It's needed to format import lines nicely.
require('dotenv').config()
const { authenticate } = authentication.hooks
const stripe = require('stripe')(process.env.STRIPE_S_Key)

/**
 * ***steps to subscribing
 * get the packages by id
 * get the user
 * get the card by user id
 * submit in sequence to stripe subscription id
 * update stripe subscription
 *
 */

export const chargeUser = async (user: any, amount: any) => {
  //check if user has card
  const cards: any = await app.services.cards.find({ query: { userId: user.id } })

  if (cards.total === 0) {
    throw new BadRequest('user does not have a card, create a card to proceed')
  }

  const card = cards.data[0]
  const token = await stripe.tokens.create({
    card: {
      number: card.card_number,
      exp_month: parseInt(card.exp_month),
      exp_year: parseInt(card.exp_year),
      cvc: card.cvv
    }
  })
  const charge = await stripe.charges.create(
    {
      amount: amount * 100,
      currency: 'usd',
      source: token.id,
      description: `${user.email} subscribed`
    },
    {
      idempotencyKey: Date.now().toString()
    }
  )

  return charge
}

const subscribe = async (context: any) => {
  if (context.data.action == 'subscribe') {
    const user = context.params.user
    let plan = DEFAULT_VALUES.subscriptionsPlan.MONTHLY
    let amount = 0.0
    let interval = 'month'
    let startDate = moment().format('x')
    let endDate = moment().add(30, 'days').format('x')
    
    //price calculation
    let monthly =
    DEFAULT_VALUES.packagesPrices.businessPage +
    DEFAULT_VALUES.packagesPrices.paperlink * context.data.paperlink +
    DEFAULT_VALUES.packagesPrices.teamMembers * context.data.teamMembers +
    DEFAULT_VALUES.packagesPrices.fillablePdf * context.data.fillablePdf +
    DEFAULT_VALUES.packagesPrices.whiteGloverServices * context.data.whiteGloveService
   
    
    context.data.monthlyPrice = monthly
    context.data.yearlyPrice = monthly * 12

    context.data.yearlyDiscountedPrice = context.data.yearlyPrice - parseFloat((context.data.yearlyPrice * DEFAULT_VALUES.packagesPrices.discountPercent).toFixed(2))
    
    console.log(context.data)
    
      //set amount and plan
      if (context.data.plan === DEFAULT_VALUES.subscriptionsPlan.YEARLY) {
        plan = DEFAULT_VALUES.subscriptionsPlan.YEARLY
        amount = context.data.yearlyDiscountedPrice
        interval = 'year'
        endDate = moment().add(365, 'days').format('x')
      } else {
        amount = context.data.monthlyPrice
      }

    //calculate discount here  
    const charge: any = await chargeUser(user, amount)
    if (!charge || charge.status !== 'succeeded') {
      throw new BadRequest('failed to charge users card')
    }
    context.params.charge = charge

    if (context.data.isUpdate === true) {
      const prevSub: any = await app.services.subscriptions.find({ query: { userId: user.id } })
      await app.services.subscriptions.remove(prevSub.data[0].id)
    }

    //create subscription
    context.data.stripeChargeId = charge.id
    context.data.plan = plan
    context.data.amount = amount
    context.data.startDate = parseInt(startDate)
    context.data.endDate = parseInt(endDate)
    context.data.paymentType = DEFAULT_VALUES.subscriptionsPaymentType.CARD
    context.data.status =
      charge?.status === 'succeeded' ? DEFAULT_VALUES.subscriptionsStatus.ACTIVE : charge?.status

  }
  return context
}


const buyMoreFeature = async (context: any) => {
  if (context.data.action === 'buyMoreFeature') {
    let subscription = await app.services.subscriptions.get(context.id)
    let amount =
      DEFAULT_VALUES.packagesPrices.paperlink * context.data.additional_paperlink +
      DEFAULT_VALUES.packagesPrices.teamMembers * context.data.additional_teamMembers +
      DEFAULT_VALUES.packagesPrices.fillablePdf * context.data.additional_fillablePdf + 
      subscription.isWhiteGloveService === false &&  context.data.isWhiteGloveService === true ? DEFAULT_VALUES.packagesPrices.whiteGloverServices  : 0 

    context.data.paperlink = context.data.additional_paperlink + subscription.paperlink
    context.data.teamMembers = context.data.additional_teamMembers + subscription.teamMembers
    context.data.fillablePdf = context.data.additional_fillablePdf + subscription.fillablePdf

    context.data.amount = subscription.amount + amount

    // buy more feature emails
    // await sendPackageSubscription(paidUser, context.data.packageName)

    // create billings info
    
  }

  return context
}


const cancelSubscription =async(context: any)=>{
  if(context.data.action === 'cancelSubscription'){
    context.data.status = DEFAULT_VALUES.subscriptionsStatus.EXPIRED
    context.data.isCancelled = true
    var date = new Date()
    var current_date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    await sendPackageSubscriptionCancel(context.params.user, current_date)
  }
  return context
}

const activateSubscription =async(context: any)=>{
  if(context.data.action === 'activateSubscription'){
    context.data.status = DEFAULT_VALUES.subscriptionsStatus.ACTIVE
    context.data.isCancelled = false
    var date = new Date()
    var current_date = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    await sendPackageSubscriptionCancel(context.params.user, current_date)
  }
  return context
}



const afterSubscription = async (context: any) => {
  if (context.data.action !== 'retry') {
    if (context.params.user.role === DEFAULT_VALUES.users.roles.FREE_USER) {
      if (context.data.packageId) {
        await app.services.packages.patch(context.data.packageId, {
          numberOfSubscribers: context.data._package.numberOfSubscribers + 1
        })
      }

      if (context.data.companyEmail) {
        let user = context.params.user
        const paidUser = await app.services.users.create({
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: context.data.companyName,
          email: context.data.companyEmail,
          password: user.referralCode,
          role: DEFAULT_VALUES.users.roles.PAID_USER,
          status: DEFAULT_VALUES.users.status.ACTIVE,
          mainAccountId: user.id
        })

        //update user role, email
        await app.services.users.patch(paidUser.id, {
          subscriptionId: context.result.id,
          role: DEFAULT_VALUES.users.roles.PAID_USER,
          email: `${context.data.companyName.toLowerCase()}${paidUser.id}@paperdaz.com`
        })

        //update subscription
        await app.services.subscriptions.patch(context.result.id, {
          userId: paidUser.id
        })
        await sendPackageSubscription(paidUser, context.data.packageName)
      }
    }

  }

  if (context.data.action === 'subscribe') {
    const uniqueId = Date.now().toString()
    await app.services.users.patch(context.params.user.id, {
      subscriptionId: context.result.id,
      role: DEFAULT_VALUES.users.roles.PAID_USER,
      teamId: uniqueId
    })

    await app.services.teammembers.create({
      userId: context.params.user.id,
      teamsId: uniqueId,
      isOwner: true,
      ownersId: context.params.user.id,
      companyName: context.params.user.companyName,
      companyFirstName: context.params.user.firstName,
      companyLastName:  context.params.user.lastName,
      companyEmail:  context.params.user.email,
      teamMemberEmail:  context.params.user.email,
      companyProfilePicture :context.params.user.profilePicture,
      businessPage : context.params.user.businessPage,
    })

    const demoFiles = [
      {
        fileName: 'paperlink confirm.pdf',
        downloadLink:
          'https://paperdazfile.nyc3.digitaloceanspaces.com/assets/paperlink_assets/demofiles2/Paperdaz_TermsConditions.pdf',
        paperLink: '11' + Date.now().toString(),
        key: '',
        userId: context.params.user.id,
        role: context.params.user.role,
        userName: context.params.user.firstName + ' ' + context.params.user.lastName,
        leavesEarned: 0,
        uploadedBy: context.params.user.id,
        pages: 1,
        position: 1,
        fileAction: DEFAULT_VALUES.fileActions.CONFIRM,
        annotaions: '',
        tags: 'demo',
      },
      {
        fileName: 'paperlink complete.pdf',
        downloadLink:
          'https://paperdazfile.nyc3.digitaloceanspaces.com/assets/paperlink_assets/demofiles2/Paperlink_Complete.pdf',
        paperLink: '22' + Date.now().toString(),
        key: '',
        userId: context.params.user.id,
        role: context.params.user.role,
        userName: context.params.user.firstName + ' ' + context.params.user.lastName,
        leavesEarned: 0,
        uploadedBy: context.params.user.id,
        pages: 1,
        position: 2,
        fileAction: DEFAULT_VALUES.fileActions.COMPLETE,
        annotaions: "[{\"parentWidth\":800,\"parentHeight\":1035.2890625,\"reAdjust\":true,\"type\":\"appendLastName\",\"top\":155,\"left\":430,\"_top\":159,\"_left\":431,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":1,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.2890625,\"reAdjust\":true,\"type\":\"appendFirstName\",\"top\":156,\"left\":164,\"_top\":161,\"_left\":165,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":2,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendDate\",\"top\":159,\"left\":667,\"_top\":159,\"_left\":667,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":3,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":false,\"discription\":\"\",\"x1\":667,\"y1\":159},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendName\",\"top\":785,\"left\":140,\"_top\":785,\"_left\":140,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":4,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":false,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.2890625,\"reAdjust\":true,\"type\":\"appendSignature\",\"top\":852,\"left\":75,\"_top\":850,\"_left\":93,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":5,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":93,\"y1\":850},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendInitial\",\"top\":851,\"left\":391,\"_top\":851,\"_left\":391,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":6,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":false,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.2890625,\"reAdjust\":true,\"type\":\"appendDate\",\"top\":849,\"left\":550,\"_top\":850,\"_left\":544,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":7,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":544,\"y1\":850}]",
        tags: 'demo',
      },
      {
        fileName: 'paperlink complete fillables.pdf',
        downloadLink:
          'https://paperdazfile.nyc3.digitaloceanspaces.com/assets/paperlink_assets/demofiles2/Paperlink_Complete_Fillable.pdf',
        paperLink: '33' + Date.now().toString(),
        key: '',
        userId: context.params.user.id,
        role: context.params.user.role,
        userName: context.params.user.firstName + ' ' + context.params.user.lastName,
        leavesEarned: 0,
        uploadedBy: context.params.user.id,
        pages: 1,
        position: 3,
        fileAction: DEFAULT_VALUES.fileActions.COMPLETE,
        annotaions: "[{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendFirstName\",\"top\":156,\"left\":152,\"_top\":156,\"_left\":152,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":2,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendLastName\",\"top\":157,\"left\":411,\"_top\":157,\"_left\":411,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":3,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendDate\",\"top\":155,\"left\":646,\"_top\":155,\"_left\":646,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":4,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":646,\"y1\":155},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendName\",\"top\":780,\"left\":150,\"_top\":780,\"_left\":150,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":5,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendSignature\",\"top\":850,\"left\":94,\"_top\":850,\"_left\":94,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":6,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":94,\"y1\":850},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendInitial\",\"top\":850,\"left\":397,\"_top\":850,\"_left\":397,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":7,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\"},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendDate\",\"top\":850,\"left\":566,\"_top\":850,\"_left\":566,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":8,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":566,\"y1\":850}]",
        tags: 'demo',
      },
      {
        fileName: 'paperlink sign.pdf',
        downloadLink:
          'https://paperdazfile.nyc3.digitaloceanspaces.com/assets/paperlink_assets/demofiles2/SignAction.pdf',
        paperLink: '44' + Date.now().toString(),
        key: '',
        userId: context.params.user.id,
        role: context.params.user.role,
        userName: context.params.user.firstName + ' ' + context.params.user.lastName,
        leavesEarned: 0,
        uploadedBy: context.params.user.id,
        pages: 1,
        position: 4,
        fileAction: DEFAULT_VALUES.fileActions.SIGNED,
        annotaions: "[{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendSignature\",\"top\":322,\"left\":94,\"_top\":322,\"_left\":94,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":4,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":94,\"y1\":322},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendInitial\",\"top\":322,\"left\":429,\"_top\":322,\"_left\":429,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":5,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":429,\"y1\":322},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendDate\",\"top\":321,\"left\":567,\"_top\":321,\"_left\":567,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":6,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":567,\"y1\":321},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendDate\",\"top\":581,\"left\":573,\"_top\":581,\"_left\":573,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":7,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":573,\"y1\":581},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendDate\",\"top\":860,\"left\":572,\"_top\":860,\"_left\":572,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":8,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":572,\"y1\":860},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendInitial\",\"top\":857,\"left\":409,\"_top\":857,\"_left\":409,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":9,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":409,\"y1\":857},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendInitial\",\"top\":579,\"left\":418,\"_top\":579,\"_left\":418,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":10,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":418,\"y1\":579},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendSignature\",\"top\":578,\"left\":84,\"_top\":578,\"_left\":84,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":11,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":84,\"y1\":578},{\"parentWidth\":800,\"parentHeight\":1035.28125,\"reAdjust\":false,\"type\":\"appendSignature\",\"top\":858,\"left\":73,\"_top\":858,\"_left\":73,\"pageScaleX\":1,\"pageScaleY\":1,\"isDeleted\":false,\"id\":12,\"pageNumber\":1,\"isChecked\":true,\"user\":26,\"justMounted\":true,\"discription\":\"\",\"x1\":73,\"y1\":858}]",
        tags: 'demo',
      }
    ]

    demoFiles.map(async (file) => {
      await app.services.files.create(file)
    })



    let recieptLink = ''
    try {
      const generateReceipt :any = await axios.post('http://192.241.145.76:3000/generate', { 
        receiptID: `#${context.result.id}`,
        date: moment(context.result.createdAt).format('MMM DD, YYYY'),
        companyName: context.params.user.companyName ?? context.params.user.firstName,
        cardBrand: context.params.charge.source.brand,
        cardLastFourNumber: context.params.charge.source.last4,
        startDate: moment(context.result.startDate).format('MMM DD, YYYY'),
        endDate: moment(context.result.endDate).format('MMM DD, YYYY'),

        email: context.params.user.email,
        
        businessPageUnitCost: DEFAULT_VALUES.packagesPrices.businessPage,
        businessPageNumber: 1,
        businessPageTotalCost: DEFAULT_VALUES.packagesPrices.businessPage,

        teamMembersUnitCost: DEFAULT_VALUES.packagesPrices.teamMembers,
        teamMembersNumber: context.result.teamMembers,
        teamMembersTotalCost: DEFAULT_VALUES.packagesPrices.teamMembers * context.data.teamMembers,

        paperlinkUnitCost: DEFAULT_VALUES.packagesPrices.paperlink,
        paperlinkNumber: context.result.paperlink,
        peperlinkTotalCost: DEFAULT_VALUES.packagesPrices.paperlink * context.data.paperlink,

        totalMonthly: context.data.monthlyPrice,
        totalYearly: context.data.yearlyPrice,

        yearlyDiscount: (context.data.yearlyPrice * DEFAULT_VALUES.packagesPrices.discountPercent).toFixed(2),
        discountPercent: DEFAULT_VALUES.packagesPrices.discountPercent * 100,
        totalYearlyDiscounted: context.data.yearlyDiscountedPrice,


        fillablePDFUnitCost: DEFAULT_VALUES.packagesPrices.fillablePdf,
        fillablePDFNumber: context.result.fillablePdf,
        fillablePDFTotalCost: DEFAULT_VALUES.packagesPrices.fillablePdf * context.data.fillablePdf,

        whiteGloveUnitCost:DEFAULT_VALUES.packagesPrices.whiteGloverServices,
        whiteGloveNumber: context.result.whiteGloveService,
        whiteGloveTotalCost: DEFAULT_VALUES.packagesPrices.whiteGloverServices * context.data?.whiteGloveService,

        totalAmount: context.result.amount,


      })

      if(generateReceipt.data && generateReceipt.status === 200){
        recieptLink = generateReceipt.data
      }

      

    } catch (error) {
      console.log(error)
    }

    //jwt token
    const secret = await app.get('authentication').secret
    const token = jwt.sign(
      {
        data: {
          user_id: context.params.user.id,
          firstName: context.params.user.firstName,
          lastName: context.params.user.lastName,
          email: context.params.user.email,
          package: context.data.package ?? null,
          businessPage:  context.params.user.businessPage
        }
      },
      secret
    )
    try {
      await sendRegistrationEmail(context.params.user, token, recieptLink)
      await sendWelcomeEmail(context.params.user, token, recieptLink)

    } catch (error) {
      console.log(error)
    }

    await app.services.billings.create({
      userId: context.params.user.id,
      paperlink: context.result.paperlink,
      teamMember: context.result.teamMembers,
      businessPage: 1,
      discount: 0,
      total: context.result.amount,
      reciept: recieptLink
    })

  }

  return context
}

const retryPayment = async (context: any) => {
  if (context.data.action === 'retry') {
    let subscription: any = await app.services.subscriptions.find({
      query: { userId: context.params.user.id }
    })
    //check if user has card
    const charge: any = await chargeUser(context.parans.user, subscription.data[0].amount)
    if (!charge) {
      throw new BadRequest('an error occur while charging users card')
    }

    if (charge.status !== 'succeeded') {
      throw new BadRequest('an error occur while charging users card please check card and try again')
    }

    context.params.charge = charge

    //notify user
    await app.services.notification.create({
      userId: context.params.user.id,
      message: `Your Subscription of ${subscription.data[0].packageName}, was successful`
    })
    await sendPackageSubscription(context.params.user, subscription.data[0].packageName)
    //update subscription
    let update = await app.services.subscriptions.patch(subscription.data[0].id, {
      startDate: moment().format('YYYY-MM-DD HH:MM'),
      endDate:
        subscription.data[0].plan === 'monthly'
          ? moment().format('YYYY-MM-DD HH:MM')
          : moment().format('YYYY-MM-DD HH:MM'),
      status: DEFAULT_VALUES.subscriptionsStatus.ACTIVE,
      isCancelled: true
    })
    context.result = update
  }
  return context
}

export default {
  before: {
    all: [],
    find: [getSubscriptionRelatedHook()],
    get: [getSubscriptionRelatedHook()],
    create: [addUserId(), subscribe, retryPayment],
    update: [],
    patch: [addUserId(), buyMoreFeature, cancelSubscription],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [afterSubscription],
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
