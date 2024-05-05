const puppeteer = require('puppeteer');
const { generateCoverPage, generateApprovalPage, generateContentPage } = require('./page-generator');

async function createPDF(htmlPages) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const fullHtml = htmlPages.join('<div style="page-break-after: always;"></div>');
    
    await page.setContent(fullHtml, {
        waitUntil: 'networkidle0'
    });
    
    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            bottom: '20mm',
            left: '30mm',
            right: '10mm',
        }
    });
    
    
    await browser.close();
    return pdf;
}

async function generatePDF() {
    const htmlCoverPage = await generateCoverPage();
    const htmlApprovalPage = await generateApprovalPage();
    const htmlContentPage = await generateContentPage();

    const pdfBuffer = await createPDF([htmlCoverPage, htmlApprovalPage, htmlContentPage]);
    return pdfBuffer;
}

module.exports = generatePDF;