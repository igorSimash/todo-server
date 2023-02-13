import UK from './ukrainian/Ukrainian.json';
import i18next from 'i18next';
import Pol from './polish/Polish.json';
import Eng from './english/English.json';

const resources = {
	'en-US': {
		mailSubject: Eng.mail.subject,
		mailText: Eng.mail.text,
	},
	'uk-UA': {
		mailSubject: UK.mail.subject,
		mailText: UK.mail.text,
	},
	'pl-PL': {
		mailSubject: Pol.mail.subject,
		mailText: Pol.mail.text,
	},
};

i18next
	.init({
		resources,
		lng: 'en-US', // Default language
	});

export default i18next;
