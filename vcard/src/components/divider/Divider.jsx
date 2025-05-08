import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/esm/Image';
import styles from './Divider.module.css';
import logo from './Vision_Logo.png';

const Divider = () => {
	return (
		<section className="my-5 text-center">
			<Row className="align-items-center">
				<Col className="border border-light mb-2"></Col>

				<Col>
					<figure>
						<Image
							src={logo}
							width={150}
							height={150}
							alt="logo"
							className={styles.logoImage}
						/>
					</figure>
				</Col>

				<Col className="border border-light mb-2"></Col>
			</Row>
		</section>
	);
};

export default Divider;
