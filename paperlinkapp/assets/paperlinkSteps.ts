import { isMobile } from 'mobile-device-detect'

export function paperlinkSteps() {
  const mobileSteps = [
    {
      intro: 'Thank you for going paperless!',
    },
    {
      intro: 'Search all files on Paperdaz by name',
      element: document.querySelector('.bottom-nav-search')
    },
    {
      intro: 'Search files you have completed,confirmed or signed here.',
      element: document.querySelector('.ledger-container .search-container'),
    },
    {
      intro: 'Click here to see your saved files .',
      element: document.querySelector('.bottom-nav-save'),
    },
    {
      intro: 'Search all files on Paperdaz by name',
      element: document.querySelector('.ledger-container'),
    },
    {
      intro: ' All files Completed, Signed, or Confirmed will be emailed to your not saved on our platform for security and privacy.',
    },
  ]
  
  const webSteps = [
    {
      intro: 'Thank you for going paperless!',
    },
    {
      intro: 'Search all files on Paperdaz by name',
      element: document.querySelector('#dashboard-navbar')
    },
    {
      intro: 'Search files you have completed,confirmed or signed here.',
      element: document.querySelector('.ledger-container .search-container'),
    },
    {
      intro: 'Click here to see your saved files .',
      element: document.querySelector('.saved-files'),
    },
    {
      intro: 'Search all files on Paperdaz by name',
      element: document.querySelector('.ledger-container'),
    },
    {
      intro: ' All files Completed, Signed, or Confirmed will be emailed to your not saved on our platform for security and privacy.',
    },
  ]

  return isMobile ? mobileSteps : webSteps
}
