import React, { useReducer, useState } from 'react';
import Divider from '../divider/Divider';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

// Define initial state and reducer function
const formReducer = (state, action) => {
	switch (action.type) {
		case 'SET_FIELD_VALUE':
			const { name, value, regex } = action.payload;
			const filteredValue = regex
				? value.replace(new RegExp(regex, 'g'), '')
				: value;
			return { ...state, [name]: filteredValue };
		case 'RESET_FORM':
			return action.initialValues;
		default:
			return state;
	}
};

const CustomForm = ({
	fields,
	initialValues,
	validations,
	onSubmit,
	buttonLabel,
}) => {
	const [formState, dispatch] = useReducer(formReducer, initialValues);
	const [sending, setSending] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		dispatch({
			type: 'SET_FIELD_VALUE',
			payload: {
				name,
				value,
				regex: validations[name]?.regex,
			},
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSending(true);
		try {
			await onSubmit(formState);
			dispatch({ type: 'RESET_FORM', initialValues });
			toast.success('Your message has been sent successfully!');
		} catch (error) {
			console.error('Failed to send form:', error);
			toast.error('Failed to send the message, please try again later.');
		} finally {
			setSending(false);
		}
	};

	return (
		<>
			<Form onSubmit={handleSubmit} className="formMaxWidth">
				{fields.map((field) => (
					<Form.Group className="mb-3" key={field.name}>
						<Form.Label className="text-light mb-0">{field.label}</Form.Label>
						{field.type === 'password' ? (
							<InputGroup>
								<Form.Control
									type={field.showPassword ? 'text' : 'password'}
									name={field.name}
									value={formState[field.name]}
									onChange={handleChange}
									placeholder={field.placeholder}
									required={field.required}
								/>
								<InputGroup.Text
									onClick={() => field.setShowPassword(!field.showPassword)}
								>
									{field.showPassword ? <BsEyeSlash /> : <BsEye />}
								</InputGroup.Text>
							</InputGroup>
						) : (
							<Form.Control
								as={field.type === 'textarea' ? 'textarea' : 'input'}
								type={field.type !== 'textarea' ? field.type : undefined}
								rows={field.rows || undefined}
								name={field.name}
								value={formState[field.name]}
								onChange={handleChange}
								placeholder={field.placeholder}
								required={field.required}
							/>
						)}
						{field.helperText && (
							<Form.Text className="text-light">{field.helperText}</Form.Text>
						)}
					</Form.Group>
				))}
				<div className="d-grid w-50 m-auto my-5">
					<Button
						variant="outline-light"
						size="lg"
						disabled={sending}
						type="submit"
					>
						{sending ? 'שולח...' : buttonLabel}
					</Button>
				</div>
			</Form>
			<Divider />
		</>
	);
};

export default CustomForm;
