import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import Image from 'react-bootstrap/esm/Image';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import Spinner from '../../components/spinner/Spinner';
import Divider from '../../components/divider/Divider';
import BackPrevPage from '../../components/backPrevPage/BackPrevPage';
import styles from './CreateListing.module.css';

const CreateListing = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		propertyType: 'דירה',
		type: 'sale',
		bedrooms: 0,
		bathrooms: 0,
		parking: false,
		elevator: false,
		balcony: false,
		address: '',
		meter: 0,
		areaMeter: 0,
		gardenMeter: 0,
		price: 0,
		groundFloor: false,
		floor: 0,
		floors: 0,
		toilet: 0,
		images: {},
		city: '',
		neighborhood: '',
		street: '',
		homeNumber: 0,
		description: '',
	});

	const [thumbnails, setThumbnails] = useState({
		image1: null,
		image2: null,
		image3: null,
		image4: null,
		image5: null,
		image6: null,
		image7: null,
		image8: null,
		image9: null,
		image10: null,
	});

	const {
		image1,
		image2,
		image3,
		image4,
		image5,
		image6,
		image7,
		image8,
		image9,
		image10,
	} = thumbnails;

	const {
		propertyType,
		type,
		bedrooms,
		bathrooms,
		parking,
		elevator,
		balcony,
		meter,
		areaMeter,
		gardenMeter,
		price,
		groundFloor,
		floor,
		floors,
		toilet,
		city,
		neighborhood,
		street,
		homeNumber,
		description,
	} = formData;

	// useEffect to set form data
	useEffect(() => {
		let address = `${city} ${neighborhood} ${street}`;
		if (homeNumber > 0) {
			address += ` ${homeNumber}`;
		}

		setFormData((prevFormData) => ({
			...prevFormData,
			images: {
				image1,
				image2,
				image3,
				image4,
				image5,
				image6,
				image7,
				image8,
				image9,
				image10,
			},
			address,
		}));
	}, [
		image1,
		image2,
		image3,
		image4,
		image5,
		image6,
		image7,
		image8,
		image9,
		image10,
		city,
		neighborhood,
		street,
		homeNumber,
	]);

	const auth = getAuth();
	const navigate = useNavigate();
	const isMounted = useRef(true);

	// Render input with thumbnail
	const renderInputWithThumbnail = (files) => (
		<Form.Group as={Row} className="align-items-center my-1">
			<Col xs={9} sm={9} md={9} className="p-0">
				<Form.Control
					className={styles.bgTransperent}
					type="file"
					id={files}
					onChange={onMutate}
					max="10"
					accept=".jpg,.png,.jpeg"
				/>
			</Col>
			<Col xs={3} sm={3} md={3} className="p-0 text-center lh-1">
				<Image
					src={thumbnails[files] || formData[files]}
					alt="Selected thumbnail"
					className={`p-0 text-center lh-1 text-light ${styles.thumbnail}`}
					thumbnail
				/>
			</Col>
		</Form.Group>
	);

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					// Query Firestore to check user's listings count
					const listingsRef = collection(db, 'listings');
					const q = query(listingsRef, where('userRef', '==', user.uid));
					const querySnap = await getDocs(q);
	
					// If user has 15 or more listings, redirect and show toast
					if (querySnap.size >= 15) {
						toast.error('🚨 הגעת למקסימום הנכסים שניתן להוסיף.');
						navigate('/profile');
						return;
					}
	
					// If under the limit, allow listing creation
					setFormData((prev) => ({ ...prev, userRef: user.uid }));
				} else {
					navigate('/sign-in');
				}
			});
		}
	
		return () => {
			isMounted.current = false;
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);
	

	// onSubmit
	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Store images in Firebase Storage
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

				const storageRef = ref(storage, `images/${fileName}`);

				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log('Upload is ' + progress + '% done');
						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused');
								break;
							case 'running':
								console.log('Upload is running');
								break;
							default:
								break;
						}
					},
					(error) => {
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
						});
					}
				);
			});
		};

		// Filter out null values from thumbnails and convert them to File objects
		const imagesToUpload = Object.values(thumbnails)
			.filter((thumbnail) => thumbnail !== null)
			.map((thumbnail) => {
				const [header, base64Image] = thumbnail.split(',');
				const mimeType = header.match(/:(.*?);/)[1];
				const imageData = atob(base64Image);
				const arraybuffer = new ArrayBuffer(imageData.length);
				const view = new Uint8Array(arraybuffer);
				for (let i = 0; i < imageData.length; i++) {
					view[i] = imageData.charCodeAt(i) & 0xff;
				}
				const blob = new Blob([arraybuffer], { type: mimeType });
				const file = new File([blob], `${uuidv4()}.jpeg`, { type: mimeType });
				return file;
			});

		const imgUrls = await Promise.all(
			imagesToUpload.map((image) => storeImage(image))
		).catch(() => {
			setLoading(false);
			toast.error('תמונות לא הועלו');
			return;
		});

		const formDataCopy = {
			...formData,
			imgUrls,
			timestamp: serverTimestamp(),
		};

		// Remove the images object from formDataCopy
		delete formDataCopy.images;

		// Upload listing
		const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
		setLoading(false);
		toast.success('נכס שמור בהצלחה');
		navigate(`/category/${formDataCopy.type}/${docRef.id}`);
	};

	/// onMutate function
	const onMutate = async (e) => {
		const { id, value, type } = e.target;

		// File input
		if (type === 'file') {
			const file = e.target.files[0];

			if (file) {
				const options = {
					maxSizeMB: 1,
					maxWidthOrHeight: 768,
					useWebWorker: true,
					fileType: 'image/jpeg',
					initialQuality: 0.5,
				};

				try {
					const compressedFile = await imageCompression(file, options);
					const reader = new FileReader();
					reader.onloadend = () => {
						setThumbnails((prevThumbnails) => ({
							...prevThumbnails,
							[id]: reader.result,
						}));
					};
					reader.readAsDataURL(compressedFile);
				} catch (error) {
					console.error('Error compressing image:', error);
				}
			} else {
				setThumbnails((prevThumbnails) => ({
					...prevThumbnails,
					[id]: null,
				}));
			}
		}
		// Button input
		else if (type === 'button') {
			e.preventDefault();

			if (id === 'type') {
				setFormData((prevFormData) => ({
					...prevFormData,
					[id]: value,
				}));
			} else {
				const boolValue = value === 'true';
				setFormData((prevFormData) => ({
					...prevFormData,
					[id]: boolValue,
				}));
			}
		}
		// Text and number input
		else {
			const parsedValue = type === 'number' ? parseInt(value, 10) : value;
			setFormData((prevFormData) => ({
				...prevFormData,
				[id]: parsedValue,
			}));
		}
	};

	if (loading) {
		return <Spinner />;
	}

	return (
		<>
			<BackPrevPage />
			<Container className="animationZoomInOut">
				<header className="mt-5">
					<h1 className="fs-1 text-light text-center">ליצור נכס</h1>
				</header>

				<Form onSubmit={onSubmit}>
					<Row className="gx-3 mt-3">
						<Form.Label className="text-light fs-2 m-0">
							מכירה / השכרה
						</Form.Label>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={type === 'sale' ? 'success' : 'outline-light'}
								id="type"
								value="sale"
								onClick={onMutate}
								className="border"
							>
								מכירה
							</Button>
						</Form.Group>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={type === 'rent' ? 'success' : 'outline-light'}
								id="type"
								value="rent"
								onClick={onMutate}
								className="border"
							>
								השכרה
							</Button>
						</Form.Group>
					</Row>

					<Row className="mt-3">
						<Form.Label className="text-light fs-2 m-0">סוג הנכס</Form.Label>
						<Col xs={6} sm={6}>
							<Form.Select
								className={styles.bgTransperent}
								id="propertyType"
								value={propertyType}
								onChange={onMutate}
							>
								<option value="דירה">דירה</option>
								<option value="דירת גן">דירת גן</option>
								<option value="פנטהאוז">פנטהאוז</option>
								<option value="דופלקס">דופלקס</option>
								<option value="סטודיו">סטודיו</option>
								<option value="יחידת דיור">יחידת דיור</option>
								<option value="בית פרטי">בית פרטי</option>
								<option value="דו משפחתי">דו משפחתי</option>
								<option value="משק חקלאי">משק חקלאי</option>
								<option value="מגרש">מגרש</option>
							</Form.Select>
						</Col>
					</Row>

					<Row className="mt-3">
						<Form.Label className="text-light fs-2 m-0">עיר</Form.Label>
						<Col xs={6} sm={6}>
							<Form.Control
								className={styles.bgTransperent}
								type="text"
								id="city"
								value={city}
								onChange={onMutate}
								maxLength="20"
								minLength="2"
								required
							/>
						</Col>
					</Row>

					<Row className="mt-3">
						<Form.Label className="text-light fs-2 m-0">שכונה</Form.Label>
						<Col xs={6} sm={6}>
							<Form.Control
								className={styles.bgTransperent}
								type="text"
								id="neighborhood"
								value={neighborhood}
								onChange={onMutate}
								maxLength="20"
								minLength="2"
							/>
						</Col>
					</Row>

					<Row className="gx-3 mt-3">
						<Col>
							<Form.Label className="text-light fs-2 m-0">רחוב</Form.Label>
							<Form.Control
								className={styles.bgTransperent}
								type="text"
								id="street"
								value={street}
								onChange={onMutate}
								maxLength="20"
								minLength="2"
							/>
						</Col>
						<Col>
							<Form.Label className="text-light fs-2 m-0">מספר בית</Form.Label>
							<Form.Control
								className={styles.bgTransperent}
								type="number"
								id="homeNumber"
								value={homeNumber}
								onChange={onMutate}
								min="0"
								max="9999999"
							/>
						</Col>
					</Row>

					<Row className="mt-3">
						<Form.Label className="text-light fs-2 m-0">שטח בנוי</Form.Label>
						<Col xs={6} sm={6}>
							<InputGroup>
								<Form.Control
									className={`${styles.bgTransperent} rounded`}
									type="number"
									id="meter"
									value={meter}
									onChange={onMutate}
									min="0"
									max="999999999"
								/>
								<InputGroup.Text className={`${styles.bgTransperent} rounded`}>
									מ"ר
								</InputGroup.Text>
							</InputGroup>
						</Col>
					</Row>

					{propertyType === 'דירת גן' ? (
						<>
							<Row className="mt-3">
								<Form.Label className="text-light fs-2 m-0">
									שטח גינה
								</Form.Label>
								<Col xs={6} sm={6}>
									<InputGroup>
										<Form.Control
											className={styles.bgTransperent}
											type="number"
											id="gardenMeter"
											value={gardenMeter}
											onChange={onMutate}
											min="0"
											max="999999999"
										/>
										<InputGroup.Text className={styles.bgTransperent}>
											מ"ר
										</InputGroup.Text>
									</InputGroup>
								</Col>
							</Row>
						</>
					) : null}

					{propertyType === 'בית פרטי' ||
					propertyType === 'דו משפחתי' ||
					propertyType === 'מגרש' ? (
						<>
							<Row className="mt-3">
								<Form.Label className="text-light fs-2 m-0">
									שטח מגרש
								</Form.Label>
								<Col xs={6} sm={6}>
									<InputGroup>
										<Form.Control
											className={styles.bgTransperent}
											type="number"
											id="areaMeter"
											value={areaMeter}
											onChange={onMutate}
											min="0"
											max="999999999"
										/>
										<InputGroup.Text className={styles.bgTransperent}>
											מ"ר
										</InputGroup.Text>
									</InputGroup>
								</Col>
							</Row>
						</>
					) : null}

					<Row className="gx-3 m-0 mt-3">
						<Form.Label className="text-light fs-2 m-0 p-0">
							{groundFloor ? (
								<span>קומת קרקע ומתוך כמה קומות</span>
							) : (
								<span>קומת קרקע </span>
							)}
						</Form.Label>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								className="px-4 border"
								variant={groundFloor ? 'success' : 'outline-light'}
								id="groundFloor"
								value={true}
								onClick={onMutate}
							>
								כן
							</Button>
						</Form.Group>

						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								className="px-4 border"
								variant={
									!groundFloor && groundFloor !== null
										? 'success'
										: 'outline-light'
								}
								id="groundFloor"
								value={false}
								onClick={onMutate}
							>
								לא
							</Button>
						</Form.Group>

						{groundFloor ? (
							<>
								<Form.Group as={Col} xs="auto">
									<Form.Control
										className={styles.bgTransperent}
										type="number"
										id="floors"
										value={floors}
										onChange={onMutate}
										min="0"
										max="999"
									/>
								</Form.Group>
							</>
						) : null}
					</Row>

					{!groundFloor ? (
						<Row className="gx-3 m-0 mt-3">
							<Form.Label className="text-light fs-2 m-0 p-0">
								קומה ומתוך כמה קומות
							</Form.Label>
							<Col xs="auto">
								<Form.Group>
									<Form.Control
										className={styles.bgTransperent}
										type="number"
										id="floor"
										value={floor}
										onChange={onMutate}
										min="0"
										max="999"
									/>
								</Form.Group>
							</Col>
							<Col xs="auto">
								<Form.Group>
									<Form.Control
										className={styles.bgTransperent}
										type="number"
										id="floors"
										value={floors}
										onChange={onMutate}
										min="0"
										max="999"
									/>
								</Form.Group>
							</Col>
						</Row>
					) : null}

					<Row className="gx-3 mt-3">
						<Col xs="auto">
							<Form.Label className="text-light fs-2 m-0">חדרים</Form.Label>
							<Form.Control
								className={styles.bgTransperent}
								type="number"
								id="bedrooms"
								value={bedrooms}
								onChange={onMutate}
								min="0"
								max="50"
								required
							/>
						</Col>

						<Col xs="auto">
							<Form.Label className="text-light fs-2 m-0">מקלחת</Form.Label>
							<Form.Control
								className={styles.bgTransperent}
								type="number"
								id="bathrooms"
								value={bathrooms}
								onChange={onMutate}
								min="0"
								max="50"
							/>
						</Col>

						<Col xs="auto">
							<Form.Label className="text-light fs-2 m-0">שירותים</Form.Label>
							<Form.Control
								className={styles.bgTransperent}
								type="number"
								id="toilet"
								value={toilet}
								onChange={onMutate}
								min="0"
								max="50"
							/>
						</Col>
					</Row>

					<Row className="gx-2 mt-3">
						<Form.Label className="text-light fs-2 m-0">חניה</Form.Label>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={parking ? 'success' : 'outline-light'}
								className="px-4 border"
								id="parking"
								value={true}
								onClick={onMutate}
							>
								יש
							</Button>
						</Form.Group>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={
									!parking && parking !== null ? 'success' : 'outline-light'
								}
								className="px-4 border"
								id="parking"
								value={false}
								onClick={onMutate}
							>
								אין
							</Button>
						</Form.Group>
					</Row>

					<Row className="gx-2 mt-3">
						<Form.Label className="text-light fs-2 m-0">מעלית</Form.Label>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={elevator ? 'success' : 'outline-light'}
								className="px-4 border"
								id="elevator"
								value={true}
								onClick={onMutate}
							>
								יש
							</Button>
						</Form.Group>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={
									!elevator && elevator !== null ? 'success' : 'outline-light'
								}
								className="px-4 border"
								id="elevator"
								value={false}
								onClick={onMutate}
							>
								אין
							</Button>
						</Form.Group>
					</Row>

					<Row className="gx-2 mt-3">
						<Form.Label className="text-light fs-2 m-0">מרפסת</Form.Label>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={balcony ? 'success' : 'outline-light'}
								className="px-4 border"
								id="balcony"
								value={true}
								onClick={onMutate}
							>
								יש
							</Button>
						</Form.Group>
						<Form.Group as={Col} xs="auto">
							<Button
								type="button"
								variant={
									!balcony && balcony !== null ? 'success' : 'outline-light'
								}
								className="px-4 border"
								id="balcony"
								value={false}
								onClick={onMutate}
							>
								אין
							</Button>
						</Form.Group>
					</Row>

					<Row className="mt-3">
						<Form.Label className="text-light fs-2 m-0">מחיר</Form.Label>
						<Col xs={6} sm={6}>
							<InputGroup>
								<Form.Control
									className={`${styles.bgTransperent} rounded`}
									type="number"
									id="price"
									value={price}
									onChange={onMutate}
									min="0"
									max="999999999"
								/>
								{type === 'rent' ? (
									<InputGroup.Text
										className={`${styles.bgTransperent} rounded`}
									>
										₪ / חודש
									</InputGroup.Text>
								) : (
									<InputGroup.Text
										className={`${styles.bgTransperent} rounded`}
									>
										₪
									</InputGroup.Text>
								)}
							</InputGroup>
						</Col>
					</Row>

					<Row className="mt-3">
						<Form.Label className="text-light fs-2 m-0">תיאור הנכס</Form.Label>
						<Col>
							<Form.Control
								as="textarea"
								className={styles.createListing_Desc}
								type="text"
								id="description"
								value={description}
								onChange={onMutate}
								maxLength="500"
								minLength="2"
							/>
						</Col>
					</Row>

					<Container className="p-0 mt-5">
						<Form.Label className="text-light">
							<p className="fs-2 m-0">תמונות</p>
							<p className="fs-6 m-0">תמונה ראשונה תיהי תמונה ראשית</p>
							<p className="fs-6 m-0">(מקס 10 תמונות)</p>
						</Form.Label>
						{renderInputWithThumbnail('image1')}
						{renderInputWithThumbnail('image2')}
						{renderInputWithThumbnail('image3')}
						{renderInputWithThumbnail('image4')}
						{renderInputWithThumbnail('image5')}
						{renderInputWithThumbnail('image6')}
						{renderInputWithThumbnail('image7')}
						{renderInputWithThumbnail('image8')}
						{renderInputWithThumbnail('image9')}
						{renderInputWithThumbnail('image10')}
					</Container>
					<Row className="my-5">
						<Button
							type="submit"
							variant="outline-light"
							className={`${styles.submitBtn} bgTransperent-5`}
							disabled={loading}
						>
							{loading ? (
								<>
									<span
										className="spinner-border spinner-border-sm"
										role="status"
										aria-hidden="true"
									></span>
									{' שומר...'}
								</>
							) : (
								'שמור נכס'
							)}
						</Button>
					</Row>
				</Form>
				<Divider />
			</Container>
		</>
	);
};

export default CreateListing;
