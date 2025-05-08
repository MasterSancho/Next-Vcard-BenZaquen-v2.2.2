import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
	return (
		<div className="my-4 text-center text-light p-3 bgTransperent-2 rounded">
			<p className="mb-1">רוצים גם אפליקציה כזאת?</p>
			<p className="mb-0">תשירו פרטים ונחזור אליכם בהקדם!</p>
			<div className="fs-2 lh-1 mb-2">&darr;</div>
			<button
				onClick={() => (window.location.href = 'https://api.whatsapp.com/send?phone=9720548955355')}
				aria-label="צור קשר"
				className="border-0 bg-transparent"
>
				<FaWhatsapp
					fill="#dc3545"
					size={30}
					title="לחץ כדי ליצור איתנו קשר עבור אפליקציה משלך"
				/>
			</button>
			<p className="my-4">&copy; {new Date().getFullYear()} WeBroker Group</p>
		</div>
	);
};

export default Footer;
