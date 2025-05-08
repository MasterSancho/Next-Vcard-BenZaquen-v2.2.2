import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
	doc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
	deleteDoc,
} from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import ListingItem from '../../components/listingItem/ListingItem';
import Stack from 'react-bootstrap/esm/Stack';
import { FaHome, FaPlus } from 'react-icons/fa';
import Divider from '../../components/divider/Divider';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';

const MAX_LISTINGS = 15; // Maximum allowed listings

const Profile = () => {
	const auth = getAuth();
	const storage = getStorage();
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, 'listings');

			const q = query(
				listingsRef,
				where('userRef', '==', auth.currentUser.uid),
				orderBy('timestamp', 'desc')
			);

			const querySnap = await getDocs(q);

			let listings = [];

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});

			setListings(listings);
			setLoading(false);
		};

		fetchUserListings();
	}, [auth.currentUser.uid]);

	const onLogout = () => {
		auth.signOut();
		navigate('/');
	};

	const onDelete = async (listingId) => {
		if (window.confirm('אתה בטוח שאתה רוצה למחוק את הנכס?')) {
			try {
				// Find the listing to be deleted
				const listing = listings.find((listing) => listing.id === listingId);

				// Delete associated images from Firebase Storage
				if (listing.data.imgUrls && listing.data.imgUrls.length > 0) {
					const deletePromises = listing.data.imgUrls.map(async (url) => {
						const imageRef = ref(storage, url);
						await deleteObject(imageRef);
					});
					await Promise.all(deletePromises); // Wait for all images to be deleted
				}

				// Delete the listing document from Firestore
				await deleteDoc(doc(db, 'listings', listingId));

				// Update state
				const updatedListings = listings.filter(
					(listing) => listing.id !== listingId
				);
				setListings(updatedListings);

				toast.success('נכס נמחק בהצלחה');
			} catch (error) {
				toast.error('הייתה שגיאה במחיקת הנכס');
			}
		}
	};

	const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

	return (
		<>
			<BackPrevPage />
			<Container className="my-5 px-4 text-center text-light animationZoomInOut">
				<Row className="py-4">
					<Col>
						<p className="m-0 fs-1">ברוך הבא </p>
						<p className="m-0 fs-1">{auth.currentUser.displayName}</p>
					</Col>
					<Col xs={4}>
						<Button
							variant="outline-danger"
							type="button"
							onClick={onLogout}
							className="bgTransperent-5"
						>
							להתנתק
						</Button>
					</Col>
				</Row>

				<Row className="my-4">
					<Link to="/profile/recommendations">
						<Button
							variant="outline-light"
							size="lg"
							className="bgTransperent-5 rounded border border-primary boxShadowWhiteBot-10"
						>
							המלצות
						</Button>
					</Link>
				</Row>

				<Row className="my-4">
					{listings.length < MAX_LISTINGS ? (
						<Link to="/create-listing">
							<Button
								variant="outline-light"
								size="lg"
								className="bgTransperent-5 rounded border border-primary boxShadowWhiteBot-10"
							>
								<FaPlus fill="#fff" size={20} />
								<span> נכס למכירה / להשכרה </span>
								<FaHome fill="#fff" size={20} />
							</Button>
						</Link>
					) : (
						<>
							<Button
								variant="outline-danger"
								size="lg"
								className="bgTransperent-5 rounded border border-danger boxShadowWhiteBot-10"
								disabled
							>
								<FaPlus fill="#fff" size={20} />
								<span> נכס למכירה / להשכרה </span>
								<FaHome fill="#fff" size={20} />
							</Button>

							{/* Message when max listings reached */}
							<p className="mt-2 text-danger fw-bold">
								🚨 הגעת למספר המקסימלי של נכסים (15)
							</p>
						</>
					)}
				</Row>

				{!loading && listings?.length > 0 ? (
					<>
						<Row>
							<p className="mt-2 fs-1 fw-bold text-center text-light">
								נכסים שלי
							</p>
							<Stack className="p-0" gap={3}>
								{listings.map((listing) => (
									<div
										key={listing.id}
										className="p-3 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10"
									>
										<ListingItem
											key={listing.id}
											listing={listing.data}
											id={listing.id}
											onDelete={() => onDelete(listing.id)}
											onEdit={() => onEdit(listing.id)}
										/>
									</div>
								))}
							</Stack>
						</Row>
					</>
				) : (
					<p className="fs-1 fw-bold text-center text-light">אין נכסים להציג</p>
				)}
			</Container>
			<Divider />
		</>
	);
};

export default Profile;
