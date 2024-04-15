const { parseHtmlString } = require('./tagParser');

module.exports.pdfTextHelper = function pdfTextHelper(doc, textObject) {
    const parsedText = parseHtmlString(textObject);

    Object.values(parsedText).forEach(item => {
        const { type, value } = item;

        if (type === 'paragraph') {
            doc.text(value, {
                align: 'justify',
                indent: 20,
                paragraphGap: 10
            });
            doc.moveDown(0.5);
        }
        else if (type === 'numericList' || type === 'list') {
            doc.x += 20;
            value.forEach((li, index) => {
                if (type === 'numericList') {
                    doc.text(`${index + 1}. ${li}`, doc.x, doc.y);
                }
                else if (type === 'list') {
                    doc.text(`• ${li}`, doc.x, doc.y);
                }
                doc.moveDown(0.5);
            });
            doc.x -= 20;
        }
    });

    doc.moveDown(1);
}