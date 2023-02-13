import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, subject: string, text: string, url: URL) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.SMTPHOST,
			port: Number(process.env.SMTPPORT),
			secure: false,
			auth: {
				user: process.env.SMTPLOGIN,
				pass: process.env.SMTPPASS,
			},
		});

		await transporter.sendMail({
			from: process.env.SMTPFROM,
			to: email,
			subject,
			html: `<a href=${url}>${text}</a>`,
		});
	} catch (err) {
		console.log('Failed to send email - ' + err);
	}
};

