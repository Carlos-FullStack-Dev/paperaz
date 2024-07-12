require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const puppeteer = require('puppeteer');
const cors = require('cors');




var app = express();


app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get('/', (req, res)=>{
    res.send('isaac at pdfgen')
})
app.get('/test', (req, res)=>{
  (async () => {
    // Launch a headless browser instance
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox'],
      headless: true
    });
  
    // Open a new page in the browser
    const page = await browser.newPage();
  
    // Navigate to a website
    await page.goto('https://www.example.com');
  
    // Take a screenshot of the page
    await page.screenshot({ path: 'example.png' });
  
    // Close the browser
    await browser.close();
    res.send('finish')
  })();
  // res.send('done')
})

app.post('/generate', async(req, res)=>{
  try {
    
    console.log(9999, req.body)

    let receiptData = req.body;

    const fs = require('fs');
    const AWS = require('aws-sdk');
    
    const s3 = new AWS.S3({
      endpoint: process.env.DO_SPACES_ENDPOINT,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
      region: 'nyc3'
    });
    
    const receiptTemplate = fs.readFileSync('./receipt_template.html', 'utf-8');
    
    async function generatePDF(html) {
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox'],
        headless: true
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4' });
      await browser.close();
      console.log(7777, pdf)
      return pdf;
    }
    
    function compileTemplate(template, data) {
      const handlebars = require('handlebars');
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(data);
    }
    
    async function generateReceipt(receiptData) {
      const html = compileTemplate(receiptTemplate, receiptData);
      const pdf = await generatePDF(html);
      const timestamp = Date.now();
      const fileName = `receipts/receipt-${timestamp}.pdf`;
      const uploadParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
        Body: pdf,
        ContentType: 'application/pdf',
        ACL: 'public-read',
      };

      console.log(666, process.env.DO_SPACES_BUCKET, )
    
      return s3.upload(uploadParams, (err, data) => {
        if (err) {
          console.log(88888, err);
         return res.send(error)
        } else {
          console.log(99999, `Receipt uploaded successfully at ${data.Location}`);
          return res.send(data.Location)
        }
      });
    }
    await generateReceipt(receiptData);

  } catch (error) {
    res.send(error)
  }
});

module.exports = app;
