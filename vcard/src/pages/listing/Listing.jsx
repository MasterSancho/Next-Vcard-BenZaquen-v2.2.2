import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import Carousel from 'react-bootstrap/esm/Carousel';
import Image from 'react-bootstrap/esm/Image';
import Ratio from 'react-bootstrap/esm/Ratio';
import Modal from 'react-bootstrap/esm/Modal';
import Spinner from '../../components/spinner/Spinner';
import Divider from '../../components/divider/Divider';
import SharePage from '../../components/sharePage/SharePage';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';
import { FaPhone } from 'react-icons/fa';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';

const Listing = () => {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [show, setShow] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const MapApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	const handleShow = (index) => {
		setSelectedImageIndex(index);
		setShow(true);
	};

	const handleClose = () => setShow(false);

	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setListing(docSnap.data());
				setLoading(false);
			}
		};

		fetchListing();
	}, [navigate, params.listingId]);

	if (loading) {
		return <Spinner />;
	}

	const { homeNumber, street, city, imgUrls } = listing;
	let googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${MapApiKey}`;

	if (homeNumber > 0 && street && city) {
		googleMapsUrl += `&q=${homeNumber}+${street.split(' ').join('+')},${city
			.split(' ')
			.join('+')}+israel&zoom=16`;
	} else if (street && city) {
		googleMapsUrl += `&q=${street.split(' ').join('+')},${city
			.split(' ')
			.join('+')}+israel&zoom=16`;
	} else if (city) {
		googleMapsUrl += `&q=${city.split(' ').join('+')}+israel&zoom=16`;
	} else {
		googleMapsUrl += `&q=israel&zoom=16`;
	}

	return (
		<>
			<BackPrevPage />
			<SharePage />

			{listing && listing.imgUrls.length > 0 && (
				<Carousel controls={true} className="animationZoomInOut" fade>
					{listing.imgUrls.map((imgUrl, index) => (
						<Carousel.Item key={index} interval={3000}>
							<Ratio aspectRatio="16x9">
								<Image
									src={imgUrl}
									alt={`Listing image ${index + 1}`}
									onClick={() => handleShow(index)}
									className="objectFitCover"
									rounded
								/>
							</Ratio>
						</Carousel.Item>
					))}
				</Carousel>
			)}

			<Container className="text-light text-center animationZoomInOut">
				<h1 className="fs-1 mt-5">
					{listing.propertyType}{' '}
					<span>{listing.type === 'rent' ? 'להשכרה' : 'למכירה'}</span>
				</h1>
				<div className="py-3 px-4 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10">
					<Row>
						<Col>
							<h4 className="fs-4">ב{listing.address}</h4>
						</Col>
					</Row>
					<Row>
						<>
							{listing.price > 0 && (
								<Col className="fs-3">
									{listing.price
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									₪{listing.type === 'rent' && ' / לחודש'}
								</Col>
							)}
						</>
					</Row>
					<Row>
						<Col className="fs-5">
							{listing.bedrooms > 0 && (
								<span>
									{listing.bedrooms > 1 ? `${listing.bedrooms} חדרים` : '1 חדר'}
								</span>
							)}
						</Col>
					</Row>

					{listing.propertyType !== 'בית פרטי' &&
					listing.propertyType !== 'דו משפחתי' ? (
						<Row>
							{listing.floor && listing.floors ? (
								<Col>
									<h5 className="fs-5">
										קומה: {listing.floor} מתוך {listing.floors}
									</h5>
								</Col>
							) : null}

							{listing.groundFloor && listing.floors ? (
								<Col>
									<h5 className="fs-5">
										קומת קרקע {listing.groundFloor} מתוך {listing.floors}
									</h5>
								</Col>
							) : null}
						</Row>
					) : null}

					<Row>
						<>
							{listing.meter > 0 && (
								<Col>
									<h5 className="fs-5">
										{listing.meter > 1
											? `${listing.meter} מ' בנוי`
											: "1 מ' בנוי"}
									</h5>
								</Col>
							)}

							{listing.gardenMeter > 0 && (
								<Col>
									<h5 className="fs-5">
										{listing.gardenMeter > 1
											? `${listing.gardenMeter} מ' גינה`
											: "1 מ' גינה "}
									</h5>
								</Col>
							)}

							{listing.areaMeter > 0 && (
								<Col>
									<h5 className="fs-5">
										{listing.areaMeter > 1
											? `${listing.areaMeter} מ' מגרש`
											: "1 מ' מגרש"}
									</h5>
								</Col>
							)}
						</>
					</Row>

					<Row>
						{listing.bathrooms > 0 && (
							<Col>
								<h5 className="fs-5">
									{listing.bathrooms > 1
										? `${listing.bathrooms} מקלחות`
										: '1 מקלחת'}
								</h5>
							</Col>
						)}

						{listing.toilet > 0 && (
							<Col>
								<h5 className="fs-5">
									{listing.toilet > 1
										? `${listing.toilet} שירותים`
										: '1 שירותים'}
								</h5>
							</Col>
						)}
					</Row>

					<Row>
						{listing.parking && (
							<Col>
								<h5 className="fs-5">חניה</h5>
							</Col>
						)}
						{listing.balcony && (
							<Col>
								<h5 className="fs-5">מרפסת</h5>
							</Col>
						)}
						{listing.elevator ? (
							<Col>
								<h5 className="fs-5">מעלית</h5>
							</Col>
						) : null}
					</Row>
				</div>

				{listing.description && (
					<>
						<h1 className="fs-1 mt-5">תיאור הנכס</h1>
						<div className="p-3 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10 whiteSpace-PreWrap">
							<Row>
								<Col>
									<h5 className="fs-5">{listing.description}</h5>
								</Col>
							</Row>
						</div>
					</>
				)}

				<>
					<h1 className="fs-1 pt-5">מיקום הנכס</h1>
					<div className="p-3 bgTransperent-2 rounded border border-primary boxShadowWhiteBot-10">
						<Row>
							<Col className="px-3">
								<Ratio aspectRatio="16x9">
									<iframe
										src={googleMapsUrl}
										title="Google map office location"
										allowFullScreen
									></iframe>
								</Ratio>
							</Col>
						</Row>
					</div>
				</>

				<Row className="my-4 text-center">
					<a href="tel:0526014411">
						<Button
							variant="outline-light"
							size="lg"
							className="bgTransperent-5 rounded border border-primary boxShadowWhiteBot-10"
						>
							<FaPhone fill="#fff" size={26} /> <span> להתקשר לסוכן</span>
						</Button>
					</a>
				</Row>

				<Divider />
			</Container>

			<Modal
				className="animationZoomInOut"
				show={show}
				onHide={handleClose}
				size="lg"
			>
				<Modal.Header
					closeButton
					closeVariant="white"
					className="border-0 modalBgColor"
				></Modal.Header>
				<Modal.Body className="m-1 p-0 text-center modalBgColor">
					{imgUrls && imgUrls.length > 0 && (
						<Carousel
							activeIndex={selectedImageIndex}
							onSelect={setSelectedImageIndex}
							controls={true}
							fade
						>
							{imgUrls.map((imgUrl, index) => (
								<Carousel.Item key={index}>
									<Image
										src={imgUrl}
										alt={`Selected image ${index + 1}`}
										fluid
										className="border border-1"
									/>
								</Carousel.Item>
							))}
						</Carousel>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default Listing;
