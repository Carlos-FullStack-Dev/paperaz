
import cron from  'node-cron'
import { endPackagePromotion } from './jobs/endPackagePromotion';
import { autoSubscribe } from './jobs/autoSubscribe';
// import { updateSubcriptionStatus } from './jobs/updateSubcriptionStatus';
import { defaultSetup } from './jobs/defaultSetup';
import { fakers } from './jobs/fakers';
import { adminSetup } from './jobs/adminSetup';
import { createTree } from './jobs/createTreeLog';
import { totalRevenue } from './jobs/dailyTotalRevenue';
import { notify3DaysToBilling } from './jobs/notifyUsers3daysToBilling';
import { handlePdfQueue } from './jobs/handlePdfQueue';
import { removeFileWithNoAction } from './jobs/handlefileWithNoActionRemoval';
import { handleTotalPages } from './jobs/handletotalPages';



export const jobs = async ()=>{

  // //every minute
  cron.schedule('* * * * *', async() => {
    try {     
      // fakers()
      adminSetup();
      defaultSetup();
      // autoSubscribe()
      // createTree()
      // endPackagePromotion()
      // notify3DaysToBilling()
      handlePdfQueue()
      // handleTotalPages()
    } catch (error) {
      console.log(error)
    }
  });
  
  //every 5 minute
  // cron.schedule('5 * * * *', async() => {
    
    // });
    
    //once aday by 12:00
    cron.schedule('0 0 * * *', async() => {
        totalRevenue()
        });
        
        cron.schedule('0 0 * * *', async() => {
            removeFileWithNoAction()
        });


}
