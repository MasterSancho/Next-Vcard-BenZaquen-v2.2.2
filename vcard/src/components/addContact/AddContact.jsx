import React from 'react';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import { addContactData } from '../../staticData';

const AddContact = () => {
	const { href, ariaLabel, label } = addContactData;

	return (
		<Row className="my-5 text-center">
			<Col>
				<Button
					as="a"
					href={href}
					download
					variant="outline-light"
					size="lg"
					aria-label={ariaLabel}
					className="bgTransperent-5 border border-primary boxShadowWhiteBot-10"
				>
					<span className="fs-5">{label}</span>
					<addContactData.icon
						size="4vw"
						className="widthClamp-1542 maxHeight-5"
					/>
				</Button>
			</Col>
		</Row>
	);
};

export default AddContact;
