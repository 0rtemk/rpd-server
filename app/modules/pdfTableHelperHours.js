const PDFTable = require("pdfkit-table");

module.exports.pdfTableHelperHours = function pdfTableHelperHours(doc, data, chunk) {
    const datas = [];

    if (chunk == 0) datas.push({
        theme: "Наименование разделов и тем дисциплины",
        all: "Всего (академ. часы)",
        lectures: "Лекции",
        seminars: "Практические (семинарские) занятия",
        lect_and_sems: "Всего часов контактной работы",
        independent_work: "Самостоятельная работа обучающегося"
    });

    for (const key in data) {
        const competence = data[key].competence;
        const theme = data[key].theme;
        const all = data[key].lectures + data[key].seminars + data[key].independent_work;
        const lectures = data[key].lectures;
        const seminars = data[key].seminars;
        const lect_and_sems = data[key].lectures + data[key].seminars;
        const independent_work = data[key].independent_work;

        if (theme || all || lectures || seminars || lect_and_sems || independent_work) {
            datas.push({
                theme: theme,
                all: all,
                lectures: lectures,
                seminars: seminars,
                lect_and_sems: lect_and_sems,
                independent_work: independent_work
            });
        }
    }

    const headers = [
        { label: "", property: 'theme', headerColor: '#ffffff', width: 120, renderer: null },
        { label: "", property: 'all', headerColor: '#ffffff', width: 70, renderer: null },
        { label: "", property: 'lectures', headerColor: '#ffffff', width: 60, renderer: null },
        { label: "", property: 'seminars', headerColor: '#ffffff', width: 70, renderer: null },
        { label: "", property: 'lect_and_sems', headerColor: '#ffffff', width: 70, renderer: null },
        { label: "", property: 'independent_work', headerColor: '#ffffff', width: 70, renderer: null },
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
