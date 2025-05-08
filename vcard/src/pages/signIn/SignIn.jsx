import { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const { email, password } = formData;

	const navigate = useNavigate();

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const auth = getAuth();
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			if (userCredential.user) {
				navigate('/profile');
			}
		} catch (error) {
			toast.error('פרטים משתמש לא נכונים');
		}
	};

	return (
		<Container className="mt-5 text-light animationZoomInOut">
			<Form onSubmit={onSubmit}>
				<h1 className="text-center mb-4">ברוך הבא!</h1>
				<Form.Group as={Row} className="mb-3">
					<Col xs={10} md={8} className="m-auto my-1">
						<Form.Label className="mb-0">מאיל</Form.Label>
						<Form.Control
							type="email"
							name="email"
							value={email}
							onChange={onChange}
							placeholder="mail@example.com"
							className="bgTransperent-2 whitePlaceholder text-light"
						/>
					</Col>
				</Form.Group>

				<Form.Group as={Row} className="mb-5">
					<Col xs={10} md={8} className="m-auto my-1">
						<Form.Label className="mb-0">סיסמה</Form.Label>
						<InputGroup>
							<Form.Control
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={password}
								onChange={onChange}
								placeholder="הזן סיסמה שלך"
								className="bgTransperent-2 whitePlaceholder text-light"
							/>
							<InputGroup.Text className="bgTransperent-2 whitePlaceholder text-light"
								onClick={() => setShowPassword((prevState) => !prevState)}
							>
								{showPassword ? <BsEyeSlash /> : <BsEye />}
							</InputGroup.Text>
						</InputGroup>
						<Link to="/forgot-password">
							<Button variant="outline-danger" className="mt-3">
								שכחת את הסיסמא?
							</Button>
						</Link>
					</Col>
				</Form.Group>

				<div className="d-grid w-50 m-auto my-1">
					<Button
						size="lg"
						variant="outline-primary"
						className="text-white px-5 bgTransperent-5"
						type="submit"
					>
						להתחבר
					</Button>
				</div>
			</Form>
		</Container>
	);
};

export default SignIn;
