import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Divider from '../divider/Divider';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/esm/Modal';

const Recommendations = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [show, setShow] = useState(false);
	const [selectedRec, setSelectedRec] = useState(null);


	useEffect(() => {
		const fetchRecommendations = async () => {
			const q = query(
				collection(db, 'recs'),
				where('status', '==', 'approved')
			);
			const querySnapshot = await getDocs(q);
			const recs = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setRecommendations(recs);
		};

		fetchRecommendations();
	}, []);

	const handleShow = (rec) => {
		setSelectedRec(rec);
		setShow(true);
	};

	const handleClose = () => setShow(false);

	return (
		recommendations.length > 0 && (
			<div className="text-light text-center">
				<h2>המלצות</h2>
				<div className="p-3 bgTransperent-2 border rounded boxShadowWhiteBot-10">
					<Carousel>
						{recommendations.map((rec) => (
							<Carousel.Item key={rec.id} onClick={() => handleShow(rec)}>
								<Card className="mb-5 bg-transparent text-light border-0">
									<Card.Header>{rec.author}</Card.Header>
									<Card.Body>
										<Card.Text>{rec.comment}</Card.Text>
									</Card.Body>
								</Card>
							</Carousel.Item>
						))}
					</Carousel>
				</div>
				<Divider />
				<Modal
					show={show}
					onHide={handleClose}
					size="lg"
					className="text-light text-center"
				>
					<Modal.Header
						closeButton
						closeVariant="white"
						className="border-0 modalBgColor"
					></Modal.Header>
					<Modal.Body className="modalBgColor">
						{selectedRec && (
							<Carousel
								interval={3000}
								fade
								controls={true}
								activeIndex={recommendations.findIndex(
									(rec) => rec.id === selectedRec.id
								)}
								onSelect={(index) => setSelectedRec(recommendations[index])}
							>
								{recommendations.map((rec, index) => (
									<Carousel.Item key={index} className="mb-5">
										<h4>{rec.author}</h4>
										<p>{rec.comment}</p>
									</Carousel.Item>
								))}
							</Carousel>
						)}
					</Modal.Body>
				</Modal>
			</div>
		)
	);
};

export default Recommendations;
