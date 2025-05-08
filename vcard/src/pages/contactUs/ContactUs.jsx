import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate function
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import SharePage from '../../components/sharePage/SharePage';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';

const ContactUs = ({ handleModalClose }) => {
	const [formData, setFormData] = useState({
		from_name: '',
		message: '',
		phone: '',
	});
	const [sending, setSending] = useState(false);

	const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
	const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
	const userID = process.env.REACT_APP_EMAILJS_USER_ID;

	const navigate = useNavigate(); // Initialize navigate function

	const sendEmail = (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			Object.values(validationErrors).forEach((msg) => toast.error(msg));
			return;
		}
		setSending(true);
		emailjs
			.send(serviceID, templateID, formData, userID)
			.then(
				(result) => {
					console.log('Email successfully sent!', result.text);
					resetForm();
					toast.success('הודעתך נשלחה בהצלחה!');
					navigate('/'); // Redirect to home page after success
				},
				(error) => {
					console.log('Failed to send email:', error.text);
					toast.error('שליחת ההודעה נכשלה, אנא נסה שוב מאוחר יותר.');
				}
			)
			.finally(() => setSending(false));
	};

	const validateForm = () => {
		let errors = {};
		const phoneDigits = formData.phone.replace(/\D/g, '');
		const nameRegex = /^[a-zA-Zא-ת .,?!]+$/;
		const messageRegex = /^[a-zA-Zא-ת0-9 .,?!]+$/;

		// Validate phone
		if (phoneDigits.length !== 10) {
			errors.phone = 'Phone number must be exactly 10 digits';
		}

		// Validate name
		if (!nameRegex.test(formData.from_name)) {
			errors.from_name = 'Name can only contain letters and .,?!';
		}

		// Validate message
		if (!messageRegex.test(formData.message)) {
			errors.message = 'Message can only contain letters, numbers, and .,?!';
		}

		return errors;
	};

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'phone') {
			const filteredValue = value.replace(/\D/g, '').slice(0, 10);
			setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		} else if (name === 'from_name') {
			const filteredValue = value.replace(/[^a-zA-Zא-ת .,?!@]/g, '');
			setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		} else if (name === 'message') {
			const filteredValue = value.replace(/[^a-zA-Zא-ת0-9 .,?!@]/g, '');
			setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	// Function to reset form state
	const resetForm = () => {
		setFormData({ from_name: '', message: '', phone: '' });
		if (handleModalClose) {
			handleModalClose(); // Close the modal if handleModalClose is passed
		}
	};

	return (
		<>
			<BackPrevPage />
			<SharePage />
			<Container className="p-0" fluid>
				<Form onSubmit={sendEmail}>
					<h1 className="text-center text-light mt-4 mb-0 fs-1">תאשיר פרטים</h1>
					<h1 className="text-center text-light fs-1">ונחזור אלייך בהקדם</h1>
					<Form.Group as={Row} className="mb-3">
						<Col xs={10} className="m-auto">
							<Form.Label className="mb-0 text-light">שם:</Form.Label>
							<Form.Control
								type="text"
								name="from_name"
								value={formData.from_name}
								onChange={handleChange}
								placeholder="הזן את שמך המלא"
								aria-label="Full Name"
								className="bgTransperent-2 whitePlaceholder text-light"
								required
							/>
							<Form.Text className="text-light">
								הזן אותיות בעברית או באנגלית
							</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Col xs={10} className="m-auto">
							<Form.Label className="mb-0 text-light">טלפון:</Form.Label>
							<Form.Control
								className="text-right bgTransperent-2 whitePlaceholder text-light"
								type="number"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								placeholder="הזן את מספר הטלפון שלך"
								aria-label="Phone Number"
								required
							/>
							<Form.Text className="text-light">הזן 10 מספרי הטלפון</Form.Text>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Col xs={10} className="m-auto">
							<Form.Label className="mb-0 text-light">הודעה:</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								name="message"
								value={formData.message}
								onChange={handleChange}
								placeholder="הודעה קצרה על הפנייה שלך"
								aria-label="Message"
								className="bgTransperent-2 whitePlaceholder text-light"
							/>
							<Form.Text className="text-light">
								הזן טקסט בעברית או באנגלית
							</Form.Text>
						</Col>
					</Form.Group>
					<div className="d-grid w-50 m-auto my-5">
						<Button
							variant="outline-light"
							size="lg"
							disabled={sending}
							type="submit"
							aria-disabled
							className="px-5 bgTransperent-5"
						>
							{sending ? (
								<>
									<span
										className="spinner-border spinner-border-sm"
										role="status"
										aria-hidden="true"
									></span>
									{' שולח...'}
								</>
							) : (
								'שלח'
							)}
						</Button>
					</div>
				</Form>
			</Container>
		</>
	);
};

export default ContactUs;
