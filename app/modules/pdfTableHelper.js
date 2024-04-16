const PDFTable = require("pdfkit-table");

module.exports.pdfTableHelper = function pdfTableHelper(doc, data) {
    const datas = [];

    datas.push({
        competence: "Формируемые компетенции(код и наименование)",
        indicator: "Индикаторы достижения компетенций (код и формулировка)",
        results: "Планируемые результаты обучения по дисциплине (модулю)",
    });

    for (const key in data) {
        const competence = data[key].competence;
        const indicator = data[key].indicator;
        const results = data[key].results;

        if (competence || indicator || results) {
            datas.push({
                competence: competence,
                indicator: indicator,
                results: results
            });
        }
    }

    const headers = [
        { label: "", property: 'competence', headerColor: '#ffffff', renderer: null },
        { label: "", property: 'indicator', headerColor: '#ffffff', renderer: null },
        { label: "", property: 'results', headerColor: '#ffffff', renderer: null },
    ];

    const table = {
        headers: headers,
        datas: datas,
        addPage: true
    };

    const options = {
        columnSpacing: 5,
        padding: 5,
        divider: {
            header: { disabled: false, width: 1, opacity: 1 },
            horizontal: { disabled: false, width: 1, opacity: 1 },
        },
        prepareHeader: () => doc.fontSize(12),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            const { x, y, width, height } = rectCell;

            if (indexColumn === 0) {
                doc.lineWidth(.5).moveTo(x, y).lineTo(x, y + height).stroke();
            }

            doc.lineWidth(.5).moveTo(x + width, y).lineTo(x + width, y + height).stroke();
            doc.fontSize(12).fillColor('#292929');
        }
    }

    doc.table(table, options);
};
