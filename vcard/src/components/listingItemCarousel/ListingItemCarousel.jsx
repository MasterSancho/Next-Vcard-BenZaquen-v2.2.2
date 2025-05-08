import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Carousel from 'react-bootstrap/Carousel';
import ListingItem from '../listingItem/ListingItem';
import Divider from '../../components/divider/Divider';
import Row from 'react-bootstrap/esm/Row';

const ListingItemCarousel = () => {
	const [loading, setLoading] = useState(true);
	const [listings, setListings] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchListings = async () => {
			const listingsRef = collection(db, 'listings');
			const q = query(listingsRef, orderBy('address', 'asc'), limit(30));
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

		fetchListings();
	}, []);

	if (loading) {
		return <></>;
	}

	if (listings.length === 0) {
		return <></>;
	}

	return (
		listings && (
			<div className="text-white text-center">
				<h2>מאגר נכסים</h2>
				<div className="p-3 bgTransperent-2 border border-primary rounded boxShadowWhiteBot-10">
					<Carousel indicators={false} fade>
						{listings
							.filter(({ data }) => data.imgUrls && data.imgUrls.length > 0)
							.map(({ data, id }) => (
								<Carousel.Item
									as={Row}
									key={id}
									interval={5000}
									onClick={() => navigate(`/category/${data.type}/${id}`)}
								>
									<ListingItem listing={data} id={id} showLinkButton={true} />
								</Carousel.Item>
							))}
					</Carousel>
				</div>
				<Divider />
			</div>
		)
	);
};

export default ListingItemCarousel;
