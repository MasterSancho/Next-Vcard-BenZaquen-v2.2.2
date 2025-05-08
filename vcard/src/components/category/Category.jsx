import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Stack from 'react-bootstrap/esm/Stack';
import Spinner from '../spinner/Spinner';
import ListingItem from '../listingItem/ListingItem';
import Divider from '../divider/Divider';
import SharePage from '../sharePage/SharePage';
import BackPrevPage from '../backPrevPage/BackPrevPage';

const Category = () => {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);

	const params = useParams();

	useEffect(() => {
		const fetchListings = async () => {
			try {
				const listingsRef = collection(db, 'listings');

				const q = query(
					listingsRef,
					where('type', '==', params.categoryName),
					orderBy('address', 'asc'),
					limit(30)
				);

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
				toast.error('לא ניתן להציג נכסים');
			}
		};

		fetchListings();
	}, [params.categoryName]);

	return (
		<>
			<BackPrevPage />
			<SharePage />
			<Container className="animationZoomInOut">
				<Row className="my-5">
					<p className="mt-4 fs-1 text-center text-white">
						{params.categoryName === 'rent' ? 'נכסים להשכרה' : 'נכסים למכירה'}
					</p>
				</Row>

				{loading ? (
					<Spinner />
				) : listings && listings.length > 0 ? (
					<>
						<Row>
							<Stack className="" gap={3}>
								{listings.map((listing) => (
									<div
										key={listing.id}
										className="text-center p-3 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10"
									>
										<ListingItem
											listing={listing.data}
											id={listing.id}
											showLinkButton={true}
										/>
									</div>
								))}
							</Stack>
						</Row>
					</>
				) : (
					<p className="my-5 fs-1 fw-normal text-center text-light">
						אין נכסים להציג
					</p>
				)}
				<Divider />
			</Container>
		</>
	);
};

export default Category;
