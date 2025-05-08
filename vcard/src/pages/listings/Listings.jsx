import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import Stack from 'react-bootstrap/esm/Stack';
import ListingItem from '../../components/listingItem/ListingItem';
import Spinner from '../../components/spinner/Spinner';
import Divider from '../../components/divider/Divider';
import SharePage from '../../components/sharePage/SharePage';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';

const Listings = () => {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);

	const params = useParams();

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Get reference
				const listingsRef = collection(db, 'listings');

				// Create a query
				const q = query(listingsRef, orderBy('address', 'asc'), limit(30));

				// Execute query
				const querySnap = await getDocs(q);

				const listings = [];

				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});

				setListings(listings);
				setLoading(false);
			} catch (error) {
				toast.error('נכסים לא ניתן להציג');
			}
		};

		fetchListings();
	}, [params]);

	return (
		<>
			<BackPrevPage />
			<SharePage />
			<Container className="px-4 animationZoomInOut" fluid>
				<Row className="my-5 mb-1 text-center">
					<Col className="my-5 p-0">
						<Link to="/category/rent">
							<Button
								className="fs-3 px-4 bgTransperent-5 border border-primary boxShadowWhiteBot-10"
								variant="outline-light"
							>
								להשכרה
							</Button>
						</Link>
					</Col>
					<Col className="my-5 p-0">
						<Link to="/category/sale">
							<Button
								className="fs-3 px-4 bgTransperent-5 border border-primary boxShadowWhiteBot-10"
								variant="outline-light"
							>
								למכירה
							</Button>
						</Link>
					</Col>
				</Row>

				{loading ? (
					<Spinner />
				) : listings && listings.length > 0 ? (
					<>
						<Row>
							<p className="mt-5 fs-1 fw-bold text-center text-light">
								כל הנכסים
							</p>
							<Stack className="p-0" gap={3}>
								{listings.map((listing) => (
									<div className="text-center p-3 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10">
										<ListingItem
											listing={listing.data}
											id={listing.id}
											key={listing.id}
											showLinkButton={true}
										/>
									</div>
								))}
							</Stack>
						</Row>
					</>
				) : (
					<p className="mt-5 fs-1 fw-normal text-center text-light">
						אין נכסים
					</p>
				)}
				<Divider />
			</Container>
		</>
	);
};

export default Listings;
