const { pool } = require('../../config/db');
const RpdChangeableValues = require('../models/rpd_changeable_values');
const RpdProfileTemplates = require('../models/rpd_profile_templates');
const RpdComplects = require('../models/rpd_complects');

async function generateCoverPage(id) {
    //data
    let uniName = null;
    let approvalField = null;
    let jsonData = null;

    try {
        uniName = await new RpdChangeableValues(pool).getChangeableValue("uniName");
        approvalField = await new RpdChangeableValues(pool).getChangeableValue("approvalField");
        complectData = await new RpdComplects(pool).findRpdComplectData(id);
        jsonData = await new RpdProfileTemplates(pool).getJsonProfile(id);
    } catch (error) {
        console.log(error);
    }

    const htmlCoverPage = `
    <html>
    <head>
        <title>Пример</title>
        <style>
            @font-face {
                font-family: 'Times';
                src: url('../fonts/times-new-roman-cyr-normal.ttf') format('truetype');
            }
            .page {
                font-family: 'Times';
                line-height: 1.5;
            }
            .cover-page-name {
                font-size: 16px;
                font-weight: 600;
                text-align: center;
            }
            .cover-page-faculty {
                font-size: 16px;
                text-align: center;
                padding-top: 20px;
            }
            .cover-page-approval {
                font-size: 16px;
                text-align: end;
                padding: 60px 0;
            }
            .cover-page-title {
                font-size: 20px;
                text-align: center;
                padding-top: 20px;
            }
            .cover-page-subtitles {
                font-size: 16px;
                text-align: center;
                padding-top: 20px;
            }
            .cover-page-subtitles-name {
                font-size: 18px;
                text-align: center;
            }
            .cover-page-year {
                font-size: 16px;
                text-align: center;
                padding-top: 100px;
            }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="cover-page-name">
                <div>${uniName.value}</div>
            </div>
            <div class="cover-page-faculty">
                <div>${complectData.faculty}</div>
                <div>${jsonData.department}</div>
            </div>
            <div class="cover-page-approval">
                <div>${approvalField.value}</div>
            </div>
            <div class="cover-page-title"><b>Рабочая программа дисциплины</b></div>
            <div class="cover-page-title">${jsonData.disciplins_name}</div>
            <div class="cover-page-subtitles">
                <div>Направление подготовки</div>
                <div class="cover-page-subtitles-name"><u>${jsonData.direction}</u></div>
            </div>
            <div class="cover-page-subtitles">
                <div>Уровень высшего образования</div>
                <div class="cover-page-subtitles-name"><u>${jsonData.education_level}</u></div>
            </div>
            <div class="cover-page-subtitles">
                <div>Направленность (профиль) программы</div>
                <div class="cover-page-subtitles-name"><u>${complectData.profile}</u></div>
            </div>
            <div class="cover-page-subtitles">
                <div>Форма(ы) обучения</div>
                <div class="cover-page-subtitles-name"><u>${complectData.education_form}</u></div>
            </div>
            <div class="cover-page-year">Дубна, ${complectData.year}</div> 
        </div>
    </body>
    </html>`;

    return htmlCoverPage;
}

async function generateApprovalPage(id) {
    //data
    let jsonData = null;

    try {
        jsonData = await new RpdProfileTemplates(pool).getJsonProfile(id);
    } catch (error) {
        console.log(error);
    }

    const htmlApprovalPage = `
    <html>
    <head>
        <title>Пример</title>
        <style>
            @font-face {
                font-family: 'Times';
                src: url('../fonts/times-new-roman-cyr-normal.ttf') format('truetype');
            }
            .page {
                font-family: 'Times';
                line-height: 1.5;
            }
            .approval-page-teachers {
                display: flex;
                justify-content: space-between;
                text-align: center;
            }
            .approval-page-teacher {
                position: absolute;
                left: 20%;
            }
            .approval-page-direction {
                position: absolute;
            }
            .approval-page-teachers-caption {
                font-size: 12px;
            }
            .approval-page-caption {
                font-size: 12px;
                text-align: center;
            }

        </style>
    </head>
    <body>
        <div class="page">
            <div>Преподаватель (преподаватели):</div>
            <div class="approval-page-teachers">
                <div>
                    <div class="approval-page-teacher">${jsonData.teacher}</div>
                    <div>________________________________________________________</div>
                    <div class="approval-page-teachers-caption"><i>Фамилия И.О., должность, ученая степень (при наличии),<br/>ученое звание (при наличии), кафедра</i></div>
                </div>
                <div>
                    <div>_______________</div>
                    <div class="approval-page-teachers-caption"><i>подпись</i></div>
                </div>
            </div>
            <div style="padding-top: 20px">Рабочая программа разработана в соответствии с требованиями ФГОС ВО по направлению подготовки высшего образования</div>
            <div class="approval-page-direction">${jsonData.direction}</div>
            <div>______________________________________________________________________________</div>
            <div class="approval-page-caption"><i>(код и наименование направления подготовки (специальности))</i></div>
            <div style="padding-top: 20px">Программа рассмотрена на заседании кафедры</div>
            <div>______________________________________________________________________________</div>
            <div class="approval-page-caption"><i>(название кафедры)</i></div>
            <div style="padding-top: 20px">Протокол заседания № _____ от «____» _______ 20___ г.</div>
            <div style="padding-top: 20px">Заведующий кафедрой   _____________________</div>
            <div style="padding-left: 190px; font-size: 12px;"><i>(Фамилия И.О., подпись)</i></div>
            <div style="padding-top: 40px">СОГЛАСОВАНО</div>
            <div style="padding-top: 20px">Заведующий выпускающей кафедрой   _____________________</div>
            <div style="padding-left: 290px; font-size: 12px;"><i>(Фамилия И.О., подпись)</i></div>
            <div style="padding-top: 20px">«____» _______ 20___ г.</div>
            <div style="padding-top: 40px">Эксперт (рецензент):</div>
            <div>______________________________________________________________________________</div>
            <div class="approval-page-caption"><i>(Ф.И.О., ученая степень, ученое звание, место работы, должность; если текст рецензии не прикладывается –<br/>подпись эксперта (рецензента), заверенная по месту работы)</i></div>
        </div>
    </body>
    </html>`;

    return htmlApprovalPage;
}

function contentResultFunc(data) {
    let summ = {
        result: 0,
        lectures: 0,
        seminars: 0,
        lect_and_sems: 0,
        independent_work: 0,
    }

    Object.keys(data).forEach(value => {
        summ.result += data[value].lectures + data[value].seminars + data[value].independent_work;
        summ.lectures += data[value].lectures; 
        summ.seminars += data[value].seminars;
        summ.lect_and_sems += data[value].lectures + data[value].seminars;
        summ.independent_work += data[value].independent_work;
    });

    return summ;
}

async function generateContentPage(id) {
    //data
    let jsonData = null;
    let cource = null;

    try {
        jsonData = await new RpdProfileTemplates(pool).getJsonProfile(id);
        cource = Math.ceil(Number(jsonData.semester) / 2);
    } catch (error) {
        console.log(error);
    }

    const contentResult = contentResultFunc(jsonData.content);

    const htmlContentPage = `
    <html>
    <head>
        <title>Пример</title>
        <style>
            @font-face {
                font-family: 'Times';
                src: url('../fonts/times-new-roman-cyr-normal.ttf') format('truetype');
            }
            .page {
                font-family: 'Times';
                line-height: 1.5;
            }
            .content-page-title {
                text-indent: 20px;
                font-size: 16px;
                font-weight: 600;
            }
            .content-page-content {
                font-size: 16px;
                text-align: justify;
            }
            .content-page-content p {
                text-indent: 30px;
            }
            .table {
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                height: auto;
                margin: 20px 0;
                font-size: 16px;
            }
            .table, .table td, .table th {
                border: 1px solid black; 
            }
            .table td, .table th, .table tr{
                min-height: 35px;
                padding: 3px; 
            }
            .table th {
                font-weight: 600; 
            }
            .table i {
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="content-page-title">1. Цели и задачи освоения дисциплины</div>
            <div class="content-page-content">${jsonData.goals}</div>
            <div class="content-page-title">2. Место дисциплины в структуре ОПОП</div>
            <div class="content-page-content"><p>Дисциплина «${jsonData.disciplins_name}» относится к ${jsonData.place} учебного плана направления ${jsonData.direction_of_study}.</p></div>
            <div class="content-page-content"><p>Дисциплина преподается в ${jsonData.semester} семестре, на ${cource} курсе.</p></div>
            <div class="content-page-content"><p>${jsonData.place_more_text}</p></div>
            <div class="content-page-title">3. Планируемые результаты обучения по дисциплине (модулю)</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Формируемые компетенции<br/><i>(код и наименование)</i></th>
                        <th>Индикаторы достижения компетенций<br/><i>(код и формулировка)</i></th>
                        <th>Планируемые результаты обучения по дисциплине (модулю)</th>
                    </tr>
                </thead>
                <tbody>
                ${Object.keys(jsonData.competencies).map(row => {
                    const value = jsonData.competencies[row];
                    return `
                        <tr>
                            <td>${value.competence}</td>
                            <td>${value.indicator}</td>
                            <td>${value.results}</td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
            <div class="content-page-title">4. Объем дисциплины</div>
            <div class="content-page-content"><p>Объем дисциплины составляет ${jsonData.zet} зачетных единиц, всего ${contentResult.result} академических часов.</p></div>
            <div class="content-page-title">5. Содержание дисциплины</div>
            <table class="table">
                <tbody>
                    <tr>
                        <th rowspan="3">Наименование разделов и тем дисциплины </th>
                        <th rowspan="3">Всего(академ. часы)</th>
                        <th colspan="4">в том числе:</th>
                    </tr>
                    <tr>
                        <th colspan="3">Контактная работа (работа во взаимодействии с преподавателем)</th>
                        <th rowspan="2">Самостоятельная работа обучающегося</th>
                    </tr>
                    <tr>
                        <th>Лекции</th>
                        <th>Практические (семинарские) занятия</th>
                        <th><b>Всего</b></th>
                    </tr>
                    ${Object.keys(jsonData.content).map(row => {
                        const value = jsonData.content[row];
                        return `
                            <tr>
                                <td>${value.theme}</td>
                                <td>${value.lectures + value.seminars + value.independent_work}</td>
                                <td>${value.lectures}</td>
                                <td>${value.seminars}</td>
                                <td>${value.lectures + value.seminars}</td>
                                <td>${value.independent_work}</td>
                            </tr>
                        `}).join('')}
                    <tr>
                        <td><b>Итого за семестр / курс</b></td>
                        <td><b>${contentResult.result}</b></td>
                        <td><b>${contentResult.lectures}</b></td>
                        <td><b>${contentResult.seminars}</b></td>
                        <td><b>${contentResult.lect_and_sems}</b></td>
                        <td><b>${contentResult.independent_work}</b></td>
                    </tr>
                </tbody>
            </table>
            <div class="content-page-title">Содержание дисциплины</div>
            <div class="content-page-content">${jsonData.content_more_text}</div>
            <div class="content-page-content">${jsonData.content_template_more_text}</div>
            <div class="content-page-title" style="padding-top: 20px">6. Перечень учебно-методического обеспечения по дисциплине</div>
            <div class="content-page-content">${jsonData.methodological_support_template}</div>
            <div class="content-page-title">7. Фонды оценочных средств по дисциплине</div>
            <div class="content-page-content">${jsonData.assessment_tools_template}</div>
            <div class="content-page-title" style="padding: 20px 0">8. Ресурсное обеспечение</div>
            <div class="content-page-title">Перечень литературы</div>
            <div class="content-page-title">Основная литература</div>
            <div class="content-page-content">
                <ol>
                    ${jsonData.textbook.map(row => {
                        return `
                            <li>${row}</li>
                        `
                    }).join('')}
                </ol>
            </div>
            <div class="content-page-title">Дополнительная литература</div>
            <div class="content-page-content">
                <ol>
                    ${jsonData.additional_textbook.map(row => {
                        return `
                            <li>${row}</li>
                        `
                    }).join('')}
                </ol>
            </div>
            <div class="content-page-title">Профессиональные базы данных и информационные справочные системы</div>
            <div class="content-page-content">${jsonData.professional_information_resources}</div>
            <div class="content-page-title" style="padding-top: 20px">Необходимое программное обеспечение</div>
            <div class="content-page-content">${jsonData.software}</div>
            <div class="content-page-title">Необходимое материально-техническое обеспечение</div>
            <div class="content-page-content">${jsonData.logistics_template}</div>
        </div>
    </body>
    </html>`;

    return htmlContentPage;
}

module.exports = {
    generateCoverPage,
    generateApprovalPage,
    generateContentPage
};