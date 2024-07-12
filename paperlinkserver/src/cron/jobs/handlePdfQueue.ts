import app from '../../app'
import { PdfGenerator } from '../../services/pdf-generator/pdf-generator.hooks'

export const handlePdfQueue = async () => {
    const queue: any = await app.services['handle-file-que'].find({query: {status: 'pending'}})
    if (queue.total > 0) { 
        const data = queue.data
        data.map(async (pdfData: any) => {
            //generate pdf
            const pdfContextData ={
                data: {
                    pdf_url: pdfData.pdf_url,
                    data: JSON.parse(pdfData.data),
                    pdfWidth: pdfData.pdfWidth,
                    pdfHeight: pdfData.pdfHeight,
                
                }
            }
            const pdf = await PdfGenerator(pdfContextData);
            const link = pdf.data.downloadLink
            if(link){
                const createLedgerData = await app.services.ledger.create(
                    {
                        userId: pdfData.userId,
                        fileOwner: pdfData.fileOwnerId,
                        fileName: pdfData.fileName,
                        action: pdfData.action,
                        fileId: pdfData.fileId,
                        isGuest: true,
                        guestName: pdfData.guestName,
                    })
                //send email to business
                const sendBusniesEmail = await app.services.request.create({
                        email: pdfData.fileOwnerEmail,
                        action: pdfData.action,
                        userId: pdfData.userId,
                        editedFileLink: link,
                        fileId: pdfData.fileId,
                        name: pdfData.guestName,
                  
                })
                //send email to guest if email is provided
                if (pdfData.guestEmail) {
                    const sendGuestEmail = await app.services.request.create({
                        email: pdfData.guestEmail,
                        action: "shareFileToGuest",
                        userId: pdfData.userId,
                        editedFileLink: link,
                        fileId: pdfData.fileId,
                    })
    
                }
                //update queue status
                const updateQueue = await app.services['handle-file-que'].patch(pdfData.id, {status: 'completed'})
                console.log('Complete Queue', updateQueue)
            }



        })  

    }

    
}