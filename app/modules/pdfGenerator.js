const PDFDocument = require('pdfkit-table');
// const PDFTable = require("pdfkit-table");
const fs = require('fs');
const RpdChangeableValues = require('../modules/rpdChangeableValues');
const RpdProfileTemplates = require('../modules/rpdProfileTemplates');
const { pdfTextHelper } = require('../modules/pdfTextHelper');
const { pdfTableHelper } = require('../modules/pdfTableHelper');
const { pdfTableHelperHours } = require('../modules/pdfTableHelperHours')

function splitObjectIntoChunks(originalObject, chunkSize) {
  let result = [];
  let tempObject = {};
  let counter = 0;
  let chunkIndex = 0;

  for (let key in originalObject) {
    tempObject[key] = originalObject[key];
    counter++;

    if (counter === chunkSize) {
      result[chunkIndex] = tempObject;
      tempObject = {};
      counter = 0;
      chunkIndex++;
    }
  }

  // Добавление последнего объекта, если он не пустой
  if (counter > 0) {
    result[chunkIndex] = tempObject;
  }

  return result;
}

function generatePDF() {
  return new Promise(async (resolve, reject) => {
    //fonts
    const TimesNewRomanNormal = "app/fonts/times-new-roman-cyr-normal.ttf";
    const TimesNewRomanBold = "app/fonts/times-new-roman-cyr-bold.ttf";
    const TimesNewRomanItalic = "app/fonts/times-new-roman-cyr-italic.ttf";
    const TimesNewRomanBoldItalic = "app/fonts/times-new-roman-cyr-bolditalic.ttf";

    //data
    let uniName = null;
    let approvalField = null;
    let jsonData = null;

    try {
      uniName = await RpdChangeableValues.getChangeableValue("uniName");
      approvalField = await RpdChangeableValues.getChangeableValue("ApprovalField");
      jsonData = await RpdProfileTemplates.getJsonProfile("ivt_bakalavr");
    } catch (error) {
      reject(error);
    }

    //creating pdf
    const doc = new PDFDocument({ size: 'A4' });

    doc.font(TimesNewRomanBold).fontSize(12);
    doc.text(uniName.value, { align: 'center' }).moveDown(1.5);

    doc.font(TimesNewRomanNormal).fontSize(12);
    doc.text("Факультет системного анализа и управления", { align: 'center' }).moveDown(0.5);
    doc.text("Кафедра системного анализа и управления", { align: 'center' }).moveDown(5.5);

    doc.text(approvalField.value, { align: 'right' }).moveDown(5.5);

    doc.font(TimesNewRomanBold).fontSize(16);
    doc.text("Рабочая программа дисциплины", { align: 'center' }).moveDown(1.5);
    doc.font(TimesNewRomanNormal).fontSize(16);
    doc.text(jsonData.disciplins_name, { align: 'center' }).moveDown(1.5);

    doc.fontSize(12).text("Направление подготовки", { align: 'center' }).moveDown(0.5);
    doc.fontSize(14).text(jsonData.direction_of_study, { align: 'center', underline: 'black' }).moveDown(1.5);

    doc.fontSize(12).text("Уровень высшего образования", { align: 'center' }).moveDown(0.5);
    doc.fontSize(14).text(jsonData.level_education, { align: 'center', underline: 'black' }).moveDown(1.5);

    doc.fontSize(12).text("Направленность (профиль) программы", { align: 'center' }).moveDown(0.5);
    doc.fontSize(14).text(jsonData.profile, { align: 'center', underline: 'black' }).moveDown(1.5);

    doc.fontSize(12).text("Форма(ы) обучения", { align: 'center' }).moveDown(0.5);
    doc.fontSize(14).text(jsonData.form_education, { align: 'center', underline: 'black' }).moveDown(3.5);

    doc.text(`Дубна, ${jsonData.year}`, { align: 'center' });

    doc.addPage();

    doc.fontSize(12).text("Преподаватель (преподаватели):").moveDown(1);
    // doc.moveTo(70, 120).lineTo(500, 120).moveTo(700, 120).lineTo(900, 120).stroke();
    doc.text("_______________________________________________________         ______________").moveUp(1.2);
    doc.text(jsonData.teacher, { align: 'center', width: '320' }).moveDown(0.2);

    doc.font(TimesNewRomanItalic).fontSize(10).text("Фамилия И.О., должность, ученая степень (при наличии),                                      подпись", { align: 'center' }).moveDown(0.1);
    doc.text("ученое звание (при наличии), кафедра", { align: 'center', width: '320' }).moveDown(2.5);

    doc.font(TimesNewRomanNormal).fontSize(12).text("Рабочая программа разработана в соответствии с требованиями ФГОС ВО по направлению подготовки высшего образования:", { align: 'justify' }).moveDown(1);
    doc.text("___________________________________________________________________________").moveUp(1.2);
    doc.text(jsonData.direction_of_study, { align: 'center' }).moveDown(0.2);
    doc.font(TimesNewRomanItalic).fontSize(10).text("(код и наименование направления подготовки (специальности))", { align: 'center' }).moveDown(1.5);

    doc.font(TimesNewRomanNormal).fontSize(12).text("Программа рассмотрена на заседании кафедры:").moveDown(1);
    doc.text("___________________________________________________________________________").moveDown(0.2);
    doc.font(TimesNewRomanItalic).fontSize(10).text("(название кафедры)", { align: 'center' }).moveDown(2.5);

    doc.font(TimesNewRomanNormal).fontSize(12).text("Протокол заседания № _____ от «____» _______ 20___ г.").moveDown(0.5);
    doc.text("Заведующий кафедрой      __________________________________").moveDown(0.2);
    doc.font(TimesNewRomanItalic).fontSize(10).text("(Фамилия И.О., подпись)", { align: 'right', width: '300' }).moveDown(3.5);

    doc.font(TimesNewRomanNormal).fontSize(12).text("СОГЛАСОВАНО").moveDown(1);
    doc.text("Заведующий выпускающей кафедрой  _______________________").moveDown(0.2);
    doc.font(TimesNewRomanItalic).fontSize(10).text("(Фамилия И.О., подпись)", { align: 'right', width: '340' }).moveDown(3.5);
    doc.font(TimesNewRomanNormal).fontSize(12).text("«____» _______ 20___ г.").moveDown(1);
    doc.text("Эксперт (рецензент): ").moveDown(1);
    doc.text("___________________________________________________________________________").moveDown(1);
    doc.text("___________________________________________________________________________").moveDown(0.2);
    doc.font(TimesNewRomanItalic).fontSize(10).text("(Ф.И.О., ученая степень, ученое звание, место работы, должность; если текст рецензии не прикладывается – подпись эксперта (рецензента), заверенная по месту работы)", { align: 'center' });

    doc.addPage();

    doc.font(TimesNewRomanBold).fontSize(12).text("1. Цели и задачи освоения дисциплины").moveDown(1);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.goals);

    doc.font(TimesNewRomanBold).text("2. Место дисциплины в структуре ОПОП").moveDown(1);
    doc.font(TimesNewRomanNormal).text(`Дисциплина «${jsonData.disciplins_name}» относится к ${jsonData.place} учебного плана направления «${jsonData.direction_of_study}». Дисциплина преподается в ${jsonData.semester} семестре, на 1 курсе, форма промежуточной аттестации – ${jsonData.certification}`, { align: 'justify', indent: 20 }).moveDown(1);
    doc.text(jsonData.place_more_text, { align: 'justify', indent: 20 }).moveDown(1);

    doc.addPage();
    doc.font(TimesNewRomanBold).text("3. Планируемые результаты обучения по дисциплине (модулю)").moveDown(2);
    doc.font(TimesNewRomanNormal);
        
    pdfTableHelper(doc, jsonData.competencies);

    doc.font(TimesNewRomanBold).text("4. Объем дисциплины").moveDown(2);
    doc.font(TimesNewRomanNormal).text(`Объем дисциплины составляет ${jsonData.zet} зачетных единиц, всего 144 академических часов. `, { align: 'justify' }).moveDown(1);

    doc.font(TimesNewRomanBold).text("5. Содержание дисциплины").moveDown(2);
    doc.font(TimesNewRomanNormal);

    const chunkedObjects = splitObjectIntoChunks(jsonData.content, 9);
    for (chunk in chunkedObjects) {
      console.log(chunk, chunkedObjects.length);
      pdfTableHelperHours(doc, chunkedObjects[chunk], chunk);
      if(chunk < chunkedObjects.length - 1) doc.addPage();
    }

    doc.font(TimesNewRomanBold).text("Содержание дисциплины", {align: 'center'}).moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.content_more_text);
    pdfTextHelper(doc, jsonData.content_template_more_text);

    doc.font(TimesNewRomanBold).text("6. Перечень учебно-методического обеспечения по дисциплине").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.methodological_support_template);

    doc.font(TimesNewRomanBold).text("7. Фонды оценочных средств по дисциплине").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.assessment_tools_template);

    doc.font(TimesNewRomanBold).text("8. Ресурсное обеспечение").moveDown(0.5);
    doc.text("Перечень литературы").moveDown(0.5);
    doc.text("Основная литература").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.textbook);

    doc.font(TimesNewRomanBold).text("Дополнительная литература").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.additional_textbook);

    doc.font(TimesNewRomanBold).text("Профессиональные базы данных и информационные справочные системы").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.professional_information_resources);

    doc.font(TimesNewRomanBold).text("Необходимое программное обеспечение").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.software);

    doc.font(TimesNewRomanBold).text("Необходимое материально-техническое обеспечение").moveDown(0.5);
    doc.font(TimesNewRomanNormal);
    pdfTextHelper(doc, jsonData.logistics_template);

    // Генерируем имя файла
    const filename = 'generated.pdf';

    // Сохраняем сформированный PDF файл
    doc.pipe(fs.createWriteStream(filename))
      .on('finish', () => {
        resolve(filename);
      })
      .on('error', (err) => {
        reject(err);
      });

    // Завершаем создание PDF
    doc.end();
  });
}

module.exports = generatePDF;