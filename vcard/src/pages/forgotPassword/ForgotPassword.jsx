import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');

	const onChange = (e) => setEmail(e.target.value);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, email);
			toast.success('קישור לאיפוס סיסמה נשלח למאיל');
		} catch (error) {
			toast.error('לא ניתן לשלוח קישור לאיפוס סיסמה');
		}
	};

	return (
		<Container className="mt-5 text-light animationZoomInOut">
			<Form onSubmit={onSubmit}>
				<h1 className="text-center mb-4">איפוס סיסמא</h1>

				<Form.Group as={Row} className="mb-3">
					<Col xs={10} md={8} className="m-auto my-1">
						<Form.Label className="mb-0">מאיל:</Form.Label>
						<Form.Control
							type="email"
							placeholder="הזן מאיל לאיפוס סיסמה"
							id="email"
							value={email}
							onChange={onChange}
							className="bgTransperent-2 whitePlaceholder text-light"
						/>

						<Link to="/sign-in">
							<Button variant="outline-danger" className="mt-3">
								להתחבר
							</Button>
						</Link>
					</Col>
				</Form.Group>

				<div className="d-grid w-50 m-auto">
					<Button
						variant="outline-primary"
						size="lg"
						className="text-white px-5 bgTransperent-5"
						type="submit"
					>
						שלח
					</Button>
				</div>
			</Form>
		</Container>
	);
};

export default ForgotPassword;
