import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';
import SharePage from '../../components/sharePage/SharePage';
import Divider from '../../components/divider/Divider';

const RecommendationForm = () => {
	const [formData, setFormData] = useState({
		author: '',
		phone: '',
		comment: '',
	});

	const [sending, setSending] = useState(false);

	const { author, phone, comment } = formData;
	const navigate = useNavigate();

	const onSubmit = async (e) => {
		e.preventDefault();

		// Perform validation first
		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			Object.values(errors).forEach((msg) => toast.error(msg));
			return;
		}

		const newRecommendation = {
			...formData,
			timestamp: serverTimestamp(),
			status: 'pending',
		};

		try {
			setSending(true);
			await addDoc(collection(db, 'recs'), newRecommendation);
			toast.success('Recommendation submitted successfully!');
			navigate('/');
			setFormData({
				author: '',
				phone: '',
				comment: '',
			});
		} catch (error) {
			toast.error('Failed to submit recommendation.');
		} finally {
			setSending(false);
		}
	};

	const validateForm = () => {
		let errors = {};
		// const phoneDigits = formData.phone.replace(/\D/g, '');
		const nameRegex = /^[a-zA-Zא-ת .,?!]+$/;
		const messageRegex = /^[a-zA-Zא-ת0-9 .,?!]+$/;

		// if (phoneDigits.length !== 10) {
		// 	errors.phone = 'Phone number must be exactly 10 digits';
		// }

		if (!nameRegex.test(formData.author)) {
			errors.author = 'Name can only contain letters and .,?!';
		}

		if (!messageRegex.test(formData.comment)) {
			errors.comment = 'Message can only contain letters, numbers, and .,?!';
		}

		return errors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'phone') {
			const filteredValue = value.replace(/\D/g, '').slice(0, 10);
			setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		} else if (name === 'author') {
			const filteredValue = value.replace(/[^a-zA-Zא-ת .,?!@]/g, '');
			setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		} else if (name === 'comment') {
			const filteredValue = value.replace(/[^a-zA-Zא-ת0-9 .,?!@]/g, '');
			setFormData((prev) => ({ ...prev, [name]: filteredValue }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	return (
		<>
			<BackPrevPage />
			<SharePage />
			<Container className="my-5 animationZoomInOut" fluid>
				<Form onSubmit={onSubmit}>
					<h1 className="text-center text-light mb-4">השאר המלצה</h1>
					<Form.Group as={Row} className="mb-3">
						<Col xs={10} sm={8} className="mx-auto">
							<Form.Label className="mb-0 text-light">שם:</Form.Label>
							<Form.Control
								type="text"
								name="author"
								value={author}
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

					{/* <Form.Group as={Row} className="mb-3">
						<Col xs={10} sm={8} className="mx-auto">
							<Form.Label className="mb-0 text-light">טלפון:</Form.Label>
							<Form.Control
								type="number"
								name="phone"
								value={phone}
								onChange={handleChange}
								placeholder="הזן מספר טלפון שלך"
								aria-label="Phone Number"
								className="bgTransperent-2 whitePlaceholder text-light"
								required
							/>
							<Form.Text className="text-light">הזן 10 מספרי הטלפון</Form.Text>
						</Col>
					</Form.Group> */}

					<Form.Group as={Row} className="mb-3">
						<Col xs={10} sm={8} className="mx-auto">
							<Form.Label className="mb-0 text-light">המלצה:</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								name="comment"
								value={comment}
								onChange={handleChange}
								placeholder="הזן את ההמלצה שלך כאן"
								aria-label="Message"
								className="bgTransperent-2 whitePlaceholder text-light"
								required
							/>
						</Col>
					</Form.Group>

					<Row className="my-5">
						<Col xs={10} sm={8} className="text-center m-auto">
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
						</Col>
					</Row>
				</Form>
				<Divider />
			</Container>
		</>
	);
};

export default RecommendationForm;
