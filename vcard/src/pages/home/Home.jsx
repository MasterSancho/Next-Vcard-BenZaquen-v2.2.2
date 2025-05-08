import Header from '../../components/header/Header';
import Container from 'react-bootstrap/esm/Container';
import Avatar from '../../components/avatar/Avatar';
import Links from '../../components/links/Links';
import AddContact from '../../components/addContact/AddContact';
import LinkShare from '../../components/linkShare/LinkShare';
import Divider from '../../components/divider/Divider';
import About from '../../components/about/About';
import YouTube from '../../components/youtube/YouTube';
import GoogleMap from '../../components/googleMap/GoogleMap';
import Footer from '../../components/footer/Footer';
import ListingItemCarousel from '../../components/listingItemCarousel/ListingItemCarousel';
import Recommendations from '../../components/recommendations/Recommendations';
import Gallery from '../../components/gallery/Gallery';

const Home = () => {
	return (
		<>
			<Header />
			<Container className="animationZoomInOut" fluid>
				<Avatar />
				<Links />
				<AddContact />
				<LinkShare />
				<Divider />
				<ListingItemCarousel />
				<Gallery />
				<About />
				<Divider />
				<YouTube />
				<Divider />
				<Recommendations />
				<GoogleMap />
				<Divider />
				<Footer />
			</Container>
		</>
	);
};

export default Home;
