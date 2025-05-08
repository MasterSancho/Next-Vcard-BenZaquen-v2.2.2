import Row from 'react-bootstrap/esm/Row';
import Image from 'react-bootstrap/esm/Image';
import { avatarData } from '../../staticData';
import styles from './Avatar.module.css';

const Avatar = () => {
	const { image, alText, name, role } = avatarData;

	return (
		<>
			<Row className="my-4 text-center">
				<figure>
					<Image
						src={image}
						roundedCircle
						alt={alText}
						className={`${styles.avatarImage} border border-2 border-primary`}
					/>
					<figcaption className="text-light mt-1">
						<h2 className="fs-2 mb-0">{name}</h2>
						<h4 className="fs-5">{role}</h4>
					</figcaption>
				</figure>
			</Row>
		</>
	);
};

export default Avatar;
