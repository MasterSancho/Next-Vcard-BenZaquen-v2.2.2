import {
	FaPhone,
	FaWhatsapp,
	FaFacebook,
	FaInstagram,
	FaEnvelope,
	FaHome,
	FaWaze,
	FaSms,
	FaUserPlus,
} from 'react-icons/fa';

export const headerData = {
	video: './assets/video.mp4',
	poster: './assets/poster.jpg',
};

export const avatarData = {
	image: './assets/avatar.jpeg',
	alText: ' תמונה של שלמה בן זקן',
	name: 'שלמה בן זקן',
	role: 'יועץ הנדל"ן האישי שלך',
};

export const linksData = [
	{
		href: 'tel:9720526014411',
		icon: FaPhone,
		text: 'חייג אלי',
		label: 'Call me directly',
	},
	{
		href: 'https://api.whatsapp.com/send?phone=9720526014411',
		icon: FaWhatsapp,
		text: 'וואטסאפ',
		label: 'Message me on WhatsApp',
	},
	{
		href: 'mailto:IsraelHomeSales@gmail.com',
		icon: FaEnvelope,
		text: 'מייל',
		label: 'Send an email',
	},

	{
		href: 'https://www.facebook.com/shlomo.benzaquen.5/',
		icon: FaFacebook,
		text: 'פייסבוק',
		label: 'Visit Facebook page',
	},
	{
		href: 'https://www.instagram.com/Remaxmomentum/',
		icon: FaInstagram,
		text: 'אינסטגרם',
		label: 'Visit Instagram profile',
	},
	{
		href: 'https://waze.com/ul/hsv9h8ugxe',
		icon: FaWaze,
		text: 'נווט',
		label: 'Navigate with Waze',
	},

	{
		href: 'https://remaxjerusalem.com/he/agents/shlomo-benzaquen?agents[0]=49',
		icon: FaHome,
		text: 'נכסים שלי',
		label: 'Explore properties',
	},
	{
		href: 'https://shlomo-benzaquen.web.app/listings',
		icon: FaHome,
		text: 'מאגר נכסים',
		label: 'Explore properties',
	},
	{
		href: 'https://www.madlan.co.il/agent/re_agent_bLSQlIGO28n',
		icon: FaHome,
		text: 'מדלן',
		label: 'Visit Madlan profile',
	},
];

export const linkShareData = [
	{
		icon: FaWhatsapp,
		label: 'WhatsApp',
		getUrl: (currentUrl) =>
			`https://api.whatsapp.com/send?text=${encodeURIComponent(
				currentUrl
			)} %0A%0A`,
		ariaLebel: 'Share on WhatsApp',
	},
	{
		icon: FaFacebook,
		label: 'Facebook',
		getUrl: (currentUrl) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
				currentUrl
			)} %0A%0A`,
		ariaLebel: 'Share on Facebook',
	},
	{
		icon: FaSms,
		label: 'SMS',
		getUrl: (currentUrl) =>
			`sms:?body=כרטיס ביקור של שלמה בן זקן - יועץ הנדל"ן האישי שלך ${encodeURIComponent(
				currentUrl
			)} %0A%0A`,
		ariaLebel: 'Share on SMS',
	},
	{
		icon: FaEnvelope,
		label: 'Email',
		getUrl: (currentUrl) =>
			`mailto:?subject=${encodeURIComponent(
				'כרטיס ביקור של שלמה בן זקן - יועץ הנדל"ן האישי שלך'
			)}&body=${encodeURIComponent(currentUrl)} %0A%0A`,
		ariaLebel: 'Share on Email',
	},
];

export const addContactData = {
	href: '/assets/contact.vcf',
	icon: FaUserPlus,
	label: 'הוסף אותי לאנשי הקשר ',
	ariaLabel: 'Add to contacts',
};

export const imagesPaths = [
	'/assets/gallery/img01.jpeg',
	'/assets/gallery/img02.jpeg',
	'/assets/gallery/img03.jpeg',
	'/assets/gallery/img04.jpeg',
	'/assets/gallery/img05.jpeg',
	'/assets/gallery/img06.jpeg',
	'/assets/gallery/img07.jpeg',
	'/assets/gallery/img08.jpeg',
	'/assets/gallery/img09.jpeg',
	'/assets/gallery/img10.jpeg',
	'/assets/gallery/img11.jpeg',
	'/assets/gallery/img12.jpeg',
	'/assets/gallery/img13.jpeg',
	'/assets/gallery/img14.jpeg',
	'/assets/gallery/img15.jpeg',
	'/assets/gallery/img16.jpeg',
	'/assets/gallery/img17.jpeg',
];
