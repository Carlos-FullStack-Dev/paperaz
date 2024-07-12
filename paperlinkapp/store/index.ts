// eslint-disable-next-line import/named
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import UserTypeEnum from '~/models/UserTypeEnum'
import FileAction from '~/models/FileAction'

export const state = () => ({
  saveEmailExist: "",
  guestModalFunc: () => {},
  base64Signature: null,
  base64Initial: null,
  fillAsGuest: true,
  toast: { active: false, msg: "", msg_mobile: ''},
  pageName: '',
  pdfPageName: {},
  pdfUser: [],
  savedFiles: [{ favourite: 0 }],
  originalPdfFiles: [],
  filterUser: '',
  setPackage: {},
  initialUser: {},
  createPackage: undefined,
  beTeamMember: true as any,
  editAnnotation: true,
  loadedPdfFile: {},
  pdfExit: false,
  pdfScale: 1.305,
  pdfOffset_y: 0,
  pdfOffset_x: 0,
  pdfOffset_w: 0,
  pdfOffset_h: 0,
  scrollPosition: false,
  upload_state: false,
  showCongratulationsModal: false,
  agreeSign: -1,
  file: {},
  saveUser: {},
  ledgerParams: "",
  clickAction: null,
  dateFormat: "mm/dd/yyyy",
  timeFormat: "h:MM TT",
  totalFile: 0,
  isFromBusinessPage: true,
  pdfZoomScale: 1,
  pdfpagesDim: {
    width: 0,
    height: 0
  },
  pdfAnnotations: [] as any,
  addToPagetextvalue: undefined,
  addToPageFirstName: undefined,
  addToPageLastName: undefined,
  descriptionForNoteTool: "",
  isVisited: false,
  isBack: false,
  isAccountSwitch: false,
  activeAnnotationTool: {},
  activeToolValue: '',
  deferredPrompt: null,
  canInstallPWA: false
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  getActiveTool( state: any){
    return state.activeAnnotationTool
  },
  getActiveToolValue( state: any){
     return  state.activeToolValue
  },
  getAddToPageTextvalue( state: any){
    return state.addToPagetextvalue
  },
  getIsAccountSwitch(state: any){
    return state.isAccountSwitch
  },
  getDescriptionForNoteTool( state: any){
    return state.descriptionForNoteTool
  },
  getAddToPageFirstName( state: any){
    return state.addToPageFirstName
  },
  getAddToPageLastName( state: any){
    return state.addToPageLastName
  },
  getSaveUser( state: any){
    return state.saveUser
  },
  getPdfAnnotations(state: any){
    return state.pdfAnnotations
  },
  getPdfZoomScale( state: any){
    return state.pdfZoomScale
  },
  getPdfpagesDim( state: any){
    return state.pdfpagesDim
  },
  getFrombusinessPage( state: any){
    return state.isFromBusinessPage
  },
    getFileManagerFile( state: any){
    return state.file
  },
  getPackageInfo( state: any){
    return state.setPackage
  },
  getClickAction( state: any){
    return state.clickAction
  },
  getLedgerParams( state: any){
    return state.ledgerParams
  },
  getToast(state: any){
    return state.toast
  },
  getSaveEmailExist(state: any){
    return state.saveEmailExist
  },
  getUserSignature(state: any) {
    return state.base64Signature
  },
  getFillAsGuest(state: any){
    return state.fillAsGuest
  },
  getUserInitial(state: any) {
    return state.base64Initial
  },
  showGuestModal(state: any) {
    return state.guestModalFunc
  },
  setDeferredPrompt(state, deferredPrompt) {
    state.deferredPrompt = deferredPrompt;
  },
  clearDeferredPrompt(state) {
    state.deferredPrompt = null;
  },
  setCanInstallPWA(state, value) {
    state.canInstallPWA = value;
  },
  profilePhoto(state: any) {
    const user = state.auth.user
    if (!user) return ''

    if (user.profilePicture != null) return user.profilePicture

    return '/img/placeholder_picture.png'
  },
  userType(state: any) {
    const user = state.auth.user
    if (!user) return ''
    // return UserTypeEnum.PAID

    return user.role

    // return UserTypeEnum.FREE === 'free_user'

    // const userType = (<any>UserTypeEnum)[user.role]

    // if (!userType) return UserTypeEnum.FREE
    // else return userType

    // // switch (user.role) {
    // //   case 'free_user':
    // //     return UserTypeEnum.FREE
    // //   case 'paid_user':
    // //     return UserTypeEnum.PAID
    // //   default:
    // //     return UserTypeEnum.FREE
    // // }
  },

  getDateFormat(state:any){
    return state.dateFormat
  },

  isVisited(state: any) {
    return state.isVisited
  },

  isBack(state:any) {
    return state.isBack
  },
  
  getTotalFile(state:any){
    return state.totalFile
  },
  getTimeFormat(state:any){
    return state.timeFormat
  }
  
}

export const mutations: MutationTree<RootState> = {
  // -- Setting the user --
  RESET_PDF_STATE(state){
    state.base64Signature = null
    state.base64Initial = null
    state.pdfAnnotations = []
    state.addToPagetextvalue = undefined
    state.agreeSign = -1
    state.file = {}
    state.pdfPageName = {}
    state.pdfUser = []
  },
  SET_SAVE_PAGE_TEXT_VALUE(state, payload) {
    console.log(payload)
    switch (payload?.type) {
      case 'name':
        state.addToPagetextvalue = payload?.text
        break;
      case 'first_name':
        state.addToPageFirstName = payload?.text
        break;
      case 'last_name':
        state.addToPageLastName = payload?.text
        break;
      default:
        break;
    }
  },
  SET_ACTIVE_TOOL_VALUE( state, payload){
    state.activeToolValue = payload
  },
  SET_ACTIVE_ANNOTATION_TOOL(state, tool){
     state.activeAnnotationTool = tool
  },
  SET_ACCOUNT_SWITCH(state, payload){
     state.isAccountSwitch = payload
  },
  SET_SAVE_USER(state, payload) {
    state.saveUser = payload
  },
  SET_DESCRIPTION_NOTE_TOOL(state, payload) {
    state.descriptionForNoteTool = payload
  },
  SET_PDF_ANNOTATIONS(state, payload) {
    state.pdfAnnotations =  [...state.pdfAnnotations,  ...payload]
  },
  RESET_PDF_ANNOTATIONS(state) {
    state.pdfAnnotations =  []
  },
  SET_PDF_ZOOM_SCALE(state, payload) {
    state.pdfZoomScale = payload
  },
  SET_PDF_DIMENSIONS(state, payload) {
    state.pdfpagesDim = payload
  },
  SET_BUSINESS_PAGE(state, payload) {
    state.isFromBusinessPage = payload
  },
  SET_PAGE_USER(state, user) {
    state.initialUser = user
  },
  SET_DATEFORMAT(state, date) {
    state.dateFormat = date
  },
  SET_TOTALFILE(state, date) {
    state.totalFile = date
  },
  SET_TIMEFORMAT(state, time) {
    state.timeFormat = time
  },
  CLICK_TOOL_ACTION(state, payload) {
    state.clickAction = payload
  },
  SET_LEDGER_PARAMS(state, params) {
    state.ledgerParams = params
  },
  SET_TOAST(state, payload) {
    state.toast = payload
  },
  SET_SAVE_EMAIL_EXIST(state, payload) {
    state.saveEmailExist = payload
  },
  SET_FILL_AS_GUEST(state, payload) {
    state.fillAsGuest = payload
  },
  SET_FILE_SIGNATURE(state, payload) {
    state.base64Signature = payload
  },
  SET_FILE_INITIAL(state, payload) {
    state.base64Initial = payload
  },
  SET_GUEST_MODAL_FUNCTION(state, callback) {
    state.guestModalFunc = callback
  },
  SET_CONGRAT_SUCCESS(state) {
    state.showCongratulationsModal = true
  },
  SET_AGREE_SIGN(state, payload) {
    state.agreeSign = payload ?? 0
  },
  UN_SET_AGREE_SIGN(state) {
    state.agreeSign = 0
  },
  // -- Setting the routed page name --
  SET_PAGE_NAME(state, { name }: { name: string }) {
    state.pageName = name
  },

  // -- Setting the pdf page name --
  SET_PDF_PAGE_NAME(state, pdfRouteObj: object) {
    state.pdfPageName = pdfRouteObj
  },
  // -- Setting the pdf page name --
  SET_PDF_EXIT(state, pdfExitPayload: boolean) {
    state.pdfExit = pdfExitPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_Y(state, pdfOffsetPayload: number) {
    state.pdfOffset_y = pdfOffsetPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_X(state, pdfOffsetPayload: number) {
    state.pdfOffset_x = pdfOffsetPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_W(state, pdfOffsetPayload: number) {
    state.pdfOffset_w = pdfOffsetPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_H(state, pdfOffsetPayload: number) {
    state.pdfOffset_h = pdfOffsetPayload
  },
  // -- All info from a package --
  PACKAGE_INFO(state, info) {
    state.setPackage = info
  },

  // -- All info from a package --
  TEAM_MEMBER(state, team) {
    state.beTeamMember = team
  },

  // -- Setting a variable for custom package --
  PACKAGE_CREATE(state, condition) {
    state.createPackage = condition
  },

  // -- Getting all user file --
  FILTER_USERs(state, filter) {
    // set the initial state
    state.pdfUser = state.originalPdfFiles
    switch (filter.toLowerCase()) {
      case FileAction.LEDGER:
        ;(state.pdfUser as any) = state.pdfUser
        break
      case FileAction.SHARED:
        ;(state.pdfUser as any) = (state.pdfUser as any).filter(
          (e: any) => e.shared != null
        )
        break
      case FileAction.SAVED:
        ;(state.pdfUser as any) = (state.pdfUser as any).filter(
          (e: any) => e.favourites.length > 0
        )
        break
      default:
        ;(state.pdfUser as any) = (state.pdfUser as any).filter(
          (e: any) => e.fileAction == filter.toLowerCase()
        )
        break
    }
  },
  FILTER_SAVED_USERs(state, filter) {
    // set the initial state
    state.savedFiles = state.originalPdfFiles
    switch (filter.toLowerCase()) {
      case FileAction.LEDGER:
        ;(state.savedFiles as any) = state.savedFiles
        break
      case FileAction.SHARED:
        ;(state.savedFiles as any) = (state.savedFiles as any).filter(
          (e: any) => e.shared != null
        )
        break
      case FileAction.SAVED:
        ;(state.savedFiles as any) = (state.savedFiles as any).filter(
          (e: any) => e.favourites.length > 0
        )
        break
      default:
        ;(state.savedFiles as any) = (state.savedFiles as any).filter(
          (e: any) => e.fileAction == filter.toLowerCase()
        )
        break
    }
  },

  // -- Resetting the state of the total user-files --
  ADD_USER(state, pdfFiles) {
    state.pdfUser = pdfFiles
    state.originalPdfFiles = pdfFiles
  },
  ADD_SAVE_USER(state, pdfFiles) {
    state.savedFiles = pdfFiles
    state.originalPdfFiles = pdfFiles
  },
  SEARCH_SAVED_FILES(state, search) {
    let ary = [{ favourite: 0 }]
    if (search == '') {
      state.savedFiles = state.originalPdfFiles
    } else {
      ary.pop()
      state.originalPdfFiles.map((val: any) => {
        val['fileName'].toLowerCase().indexOf(search) != -1 && ary.push(val)
      })
      state.savedFiles = [...ary]
    }
  },
  SET_EDIT_ANNOTATION(state, condition) {
    state.editAnnotation = condition
  },
  SET_LOADED_PDF(state, pdfFile) {
    state.loadedPdfFile = pdfFile
  },
  SET_UPLOAD_STATE(state, val) {
    state.upload_state = val
  },
  SET_PDF_PAGE_BOTTOM(state) {
    state.scrollPosition = true
  },
  SET_NOT_PDF_PAGE_BOTTOM(state) {
    state.scrollPosition = false
  },
  SET_FILE(state, file) {
    state.file = file
  },
  SET_VISITED(state) {
    state.isVisited = true;
  },
  SET_ISBACK(state) {
    state.isBack = true;
  },

}

export const actions: ActionTree<RootState, RootState> = {}
