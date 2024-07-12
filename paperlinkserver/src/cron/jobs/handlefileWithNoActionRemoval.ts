import app from '../../app'


export const removeFileWithNoAction = async () => {
  const files:any = await app.service('files').find({query: {fileAction: null}})
  files.data.map(async (file: any) => {
      const user = await app.service('users').get(file.userId)
      await app.service('users').patch(file.userId, {totalPages: user.totalPages - file.pages})
      await app.service('files').remove(file.id)
  })
}