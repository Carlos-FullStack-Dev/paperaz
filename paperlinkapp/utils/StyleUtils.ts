import FileAction from "~/models/FileAction"

class StyleUtilsAbstraction {
  getFileAction(fileAction: FileAction): string {
    switch (fileAction) {
      case FileAction.COMPLETE:
        return 'text-paperdazgreen-400'
      case FileAction.SIGNED:
        return 'text-blue-400'
      case FileAction.CONFIRM:
        return 'text-purple-400'
      default:
        return ''
    }
  } // end method getNameInitials
} // end class StyleUtilsAbstraction
const StyleUtils = new StyleUtilsAbstraction()

export default StyleUtils
