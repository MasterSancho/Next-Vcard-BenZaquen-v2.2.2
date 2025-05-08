import { useState, useEffect } from 'react';
import { imagesPaths } from '../../staticData';
import Carousel from 'react-bootstrap/esm/Carousel';
import Ratio from 'react-bootstrap/esm/Ratio';
import Image from 'react-bootstrap/esm/Image';
import Modal from 'react-bootstrap/esm/Modal';
import Row from 'react-bootstrap/esm/Row';
import Divider from '../divider/Divider';

const Gallery = () => {
	const [show, setShow] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [images, setImages] = useState([]);


	useEffect(() => {
		setImages(imagesPaths);
	}, []);

	const handleShow = (index) => {
		setSelectedImageIndex(index);
		setShow(true);
	};

	const handleClose = () => setShow(false);

	return (
		<>
			<h2 className="text-light text-center fs-1 animationZoomInOut">
			גלריה תמונות
			</h2>
			<div className="p-3 bgTransperent-2 border border-primary rounded boxShadowWhiteBot-10">
				<Row>
					<Carousel controls={true} className="animationZoomInOut" fade>
						{images.map((image, index) => (
							<Carousel.Item key={index} interval={3000}>
								<Ratio aspectRatio="16x9">
									<Image
										src={image}
										alt={`Gallery image ${index + 1}`}
										onClick={() => handleShow(index)}
										className="objectFitContain"
									/>
								</Ratio>
							</Carousel.Item>
						))}
					</Carousel>
				</Row>
			</div>
			<Divider />
			<Modal show={show} onHide={handleClose} size="lg">
				<Modal.Header
					closeButton
					closeVariant="white"
					className="border-0 modalBgColor"
				></Modal.Header>
				<Modal.Body className="m-1 p-0 text-center modalBgColor">
					{images.length > 0 && (
						<Carousel
							activeIndex={selectedImageIndex}
							onSelect={setSelectedImageIndex}
							controls={true}
							fade
						>
							{images.map((image, index) => (
								<Carousel.Item key={index}>
									<Image
										src={image}
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

export default Gallery;
