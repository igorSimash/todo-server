const i18next = require('i18next');
const UKdata = require('./ukrainian/Ukrainian.json');
const Engdata = require('./english/English.json')
const Poldata = require('./polish/Polish.json')

const resources = {
    "en-US": {
        mail_subject: Engdata.mail.subject,
        mail_text: Engdata.mail.text
    },
    "uk-UA": {
        mail_subject: UKdata.mail.subject,
        mail_text: UKdata.mail.text
    },
    "pl-PL": {
        mail_subject: Poldata.mail.subject,
        mail_text: Poldata.mail.text
    }
}

i18next
    .init({
        resources,
        lng: "en-US", //default language
    });

module.exports = i18next;