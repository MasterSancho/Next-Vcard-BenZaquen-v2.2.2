import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';

const ContactMe = ({ handleModalClose }) => {
	const [formData, setFormData] = useState({
		from_name: '',
		message: '',
		phone: '',
	});
	const [sending, setSending] = useState(false);

	const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
	const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
	const userID = process.env.REACT_APP_EMAILJS_USER_ID;

	// Function to send email
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

		if (phoneDigits.length !== 10) {
			errors.phone = 'Phone number must be exactly 10 digits';
		}

		if (!nameRegex.test(formData.from_name)) {
			errors.from_name = 'Name can only contain letters and .,?!';
		}

		if (!messageRegex.test(formData.message)) {
			errors.message = 'Message can only contain letters, numbers, and .,?!';
		}

		return errors;
	};

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

	const resetForm = () => {
		setFormData({ from_name: '', message: '', phone: '' });
		handleModalClose();
	};

	return (
		<Form onSubmit={sendEmail} className="formMaxWidth">
			<Form.Group className="mb-3">
				<Form.Label className="mb-0">שם:</Form.Label>
				<Form.Control
					type="text"
					name="from_name"
					value={formData.from_name}
					onChange={handleChange}
					placeholder="הזן את שמך המלא"
					aria-label="Full Name"
					required
				/>
				<Form.Text className="text-light">
					הזן אותיות בעברית או באנגלית
				</Form.Text>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label className="mb-0">טלפון:</Form.Label>
				<Form.Control
					className="text-right"
					type="number"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					placeholder="הזן את מספר הטלפון שלך"
					aria-label="Phone Number"
					required
				/>
				<Form.Text className="text-light">הזן 10 מספרי הטלפון</Form.Text>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label className="mb-0">הודעה:</Form.Label>
				<Form.Control
					as="textarea"
					rows={3}
					name="message"
					value={formData.message}
					onChange={handleChange}
					placeholder="הודעה קצרה על הפנייה שלך"
					aria-label="Message"
				/>
				<Form.Text className="text-light">
					הזן רק טקסט בעברית או באנגלית
				</Form.Text>
			</Form.Group>
			<div className="d-grid w-50 m-auto mt-5">
				<Button
					variant="outline-light"
					size="lg"
					disabled={sending}
					type="submit"
					aria-disabled
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
	);
};

export default ContactMe;
