import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Modal from 'react-bootstrap/esm/Modal';
import { FaHome, FaRegIdBadge } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import styles from './Navbar.module.css';

const Navbar = () => {
	const [showModal, setShowModal] = useState(false);
	const [animateOut, setAnimateOut] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const auth = getAuth();
	const navigate = useNavigate();
	const location = useLocation();

	// Track authentication status
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsLoggedIn(!!user);
		});
		return unsubscribe; // Cleanup listener on unmount
	}, [auth]);

	const handleModalClose = () => {
		setAnimateOut(true);
		setTimeout(() => {
			setShowModal(false);
			setAnimateOut(false);
		}, 300);
	};

	const handleModalOpen = () => {
		setAnimateOut(false);
		setShowModal(true);
	};

	const pathMatchRoute = (route) => route === location.pathname;

	return (
		<Container
			className={`pt-1 pb-0 text-center text-light bgTransperent-5 ${styles.fixedResponsive}`}
			fluid
		>
			<nav>
				<Row>
					<Col onClick={handleModalOpen}>
						<GiHamburgerMenu fill={showModal ? 'red' : 'white'} size={25} />
						<p className={`m-0 lh-1 ${showModal ? 'text-danger' : ''}`}>
							תפריט
						</p>
					</Col>
					<Col onClick={() => navigate('/listings')}>
						<FaHome
							fill={pathMatchRoute('/listings') ? 'red' : 'white'}
							size={25}
						/>
						<p
							className={`m-0 lh-1 ${
								pathMatchRoute('/listings') ? 'text-danger' : ''
							}`}
						>
							נכסים
						</p>
					</Col>
					<Col onClick={() => navigate('/')}>
						<FaRegIdBadge
							fill={pathMatchRoute('/') ? 'red' : 'white'}
							size={25}
						/>
						<p
							className={`m-0 lh-1 ${pathMatchRoute('/') ? 'text-danger' : ''}`}
						>
							ראשי
						</p>
					</Col>
				</Row>

				<Modal
					show={showModal}
					onHide={handleModalClose}
					dialogClassName={
						animateOut ? styles.modalAnimateOut : styles.modalAnimateIn
					}
					className="text-light"
				>
					<Modal.Header
						closeButton
						closeVariant="white"
						className={`border-0 modalBgColor ${styles.customModalHeader}`}
						dir="ltr"
					>
						<Modal.Title className={styles.customModalTitle}>
							תפריט ראשית
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className={styles.customModalBody}>
						<Link to="/" onClick={handleModalClose}>
							<p className="fs-4">דף הבית</p>
						</Link>
						<Link to="/listings" onClick={handleModalClose}>
							<p className="fs-4">כל הנכסים</p>
						</Link>
						<Link to="/category/rent" onClick={handleModalClose}>
							<p className="fs-4">נכסים להשכרה</p>
						</Link>
						<Link to="/category/sale" onClick={handleModalClose}>
							<p className="fs-4">נכסים למכירה</p>
						</Link>
						<Link to="/recommendation-form" onClick={handleModalClose}>
							<p className="fs-4">להשאיר המלצה</p>
						</Link>
						{/* <Link to="/contact-us" onClick={handleModalClose}>
							<p className="fs-4">להשאיר פרטים</p>
						</Link> */}
						{/* Conditional Links */}
						{!isLoggedIn && (
							<Link to="/sign-in" onClick={handleModalClose}>
								<p className="fs-4">להתחבר</p>
							</Link>
						)}
						{isLoggedIn && (
							<Link to="/profile" onClick={handleModalClose}>
								<p className="fs-4">פרופיל</p>
							</Link>
						)}
					</Modal.Body>
				</Modal>
			</nav>
		</Container>
	);
};

export default Navbar;
