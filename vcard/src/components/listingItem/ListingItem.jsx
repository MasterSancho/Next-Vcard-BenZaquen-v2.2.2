import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Ratio from 'react-bootstrap/esm/Ratio';
import Image from 'react-bootstrap/esm/Image';
import Button from 'react-bootstrap/esm/Button';
import styles from './ListingItem.module.css';

const ListingItem = ({ listing, id, showLinkButton, onDelete, onEdit }) => {
	return (
		<Container className={styles.listingItem} fluid>
			<Row>
				<Col className={styles.listingItem_Details}>
					<p className="m-0 py-1 lh-1 fs-3">
						{listing.type === 'rent' ? 'להשכרה' : 'למכירה'}{' '}
						{listing.propertyType}
					</p>

					<p className="m-0 mb-1 lh-1 fs-6">ב{listing.address}</p>

					{listing.price > 0 && (
						<p className="m-0 mb-1 lh-1 fs-6">
							{listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							{listing.type === 'rent' && ' / לחודש'}
						</p>
					)}

					<p className="m-0 lh-1 fs-6">
						{listing.bedrooms > 0 && (
							<span>
								{listing.bedrooms > 1 ? `${listing.bedrooms} חדרים ` : '1 חדר'}
							</span>
						)}
					</p>
					{showLinkButton && (
						<Button
							variant="outline-primary"
							className={styles.listingItem_Details_ShowLink}
						>
							<Link
								to={`/category/${listing.type}/${id}`}
								className="text-light"
							>
								פרטים נוספים
							</Link>
						</Button>
					)}

					{onEdit && (
						<Button
							variant="success"
							className={styles.listingItem_Details_Edit}
							onClick={onEdit}
						>
							Edit
						</Button>
					)}
					{onDelete && (
						<Button
							variant="danger"
							className={styles.listingItem_Details_Delete}
							onClick={onDelete}
						>
							Delete
						</Button>
					)}
				</Col>
				<Col className="p-0" xs={5}>
					<Ratio aspectRatio="1x1" className={styles.listingItem_Image_Ratio}>
						<Image
							alt={listing.name}
							src={listing.imgUrls[0]}
							className={styles.listingItem_Image_Ratio_Image}
						/>
					</Ratio>
				</Col>
			</Row>
		</Container>
	);
};

export default ListingItem;
