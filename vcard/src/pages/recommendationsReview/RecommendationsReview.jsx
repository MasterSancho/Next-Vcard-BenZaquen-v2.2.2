import { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import {
	collection,
	getDocs,
	query,
	updateDoc,
	doc,
	deleteDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/esm/Container';
import Card from 'react-bootstrap/esm/Card';
import Button from 'react-bootstrap/esm/Button';
import Divider from '../../components/divider/Divider';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';

const RecommendationsReview = () => {
	const [recommendations, setRecommendations] = useState([]);
	const [visibleComments, setVisibleComments] = useState({});

	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				const q = query(collection(db, 'recs'));
				const querySnapshot = await getDocs(q);
				const recommendationsArray = [];
				const initialVisibility = {};

				querySnapshot.forEach((doc) => {
					recommendationsArray.push({ id: doc.id, ...doc.data() });
					initialVisibility[doc.id] = false;
				});

				setRecommendations(recommendationsArray);
				setVisibleComments(initialVisibility);
			} catch (error) {
				console.error('Error fetching recommendations:', error);
			}
		};

		fetchRecommendations();
	}, []);

	const handleApprove = async (id) => {
		try {
			const recommendationDoc = doc(db, 'recs', id);
			await updateDoc(recommendationDoc, {
				status: 'approved',
			});
			setRecommendations(
				recommendations.map((rec) =>
					rec.id === id ? { ...rec, status: 'approved' } : rec
				)
			);
		} catch (error) {
			console.error('Error approving recommendation:', error);
		}
	};

	const handleRemove = async (id) => {
		if (
			window.confirm('Are you sure you want to remove this recommendation?')
		) {
			try {
				const recommendationDoc = doc(db, 'recs', id);
				await deleteDoc(recommendationDoc);
				setRecommendations(recommendations.filter((rec) => rec.id !== id));
				toast.success('Recommendation removed successfully');
			} catch (error) {
				console.error('Error removing recommendation:', error);
				toast.error('Failed to remove recommendation');
			}
		} else {
			toast.info('Recommendation removal cancelled');
		}
	};

	const toggleCommentVisibility = (id) => {
		setVisibleComments((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<>
			<BackPrevPage />
			<Container className="my-5 animationZoomInOut">
				<h2 className="text-center text-light my-5 fs-1">כל המלצות</h2>
				{recommendations.map((recommendation) => (
					<Card
						className="my-3 text-center text-light p-3 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10"
						key={recommendation.id}
					>
						<Card.Body>
							<Card.Title>{recommendation.author}</Card.Title>
							<Card.Subtitle className="my-1">
								{recommendation.email}
							</Card.Subtitle>
							<Card.Subtitle className="my-1">
								{recommendation.phone}
							</Card.Subtitle>
							<Button
								variant="outline-light"
								onClick={() => toggleCommentVisibility(recommendation.id)}
								className="mb-2"
							>
								{visibleComments[recommendation.id]
									? 'Hide Details'
									: 'Show Details'}
							</Button>
							{visibleComments[recommendation.id] && (
								<Card.Text>{recommendation.comment}</Card.Text>
							)}
							<div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
								{recommendation.status === 'pending' && (
									<Button
										variant="outline-success"
										onClick={() => handleApprove(recommendation.id)}
									>
										Approve
									</Button>
								)}
								<Button
									variant="outline-danger"
									onClick={() => handleRemove(recommendation.id)}
								>
									Remove
								</Button>
							</div>
						</Card.Body>
					</Card>
				))}
				<Divider />
			</Container>
		</>
	);
};

export default RecommendationsReview;
