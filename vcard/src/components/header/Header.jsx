import Ratio from 'react-bootstrap/esm/Ratio';
import { headerData } from '../../staticData';

const Header = () => {
	const { video, poster } = headerData;

	return (
		<Ratio aspectRatio="16x9">
			<video
				src={video}
				type="video/mp4"
				autoPlay
				loop
				muted
				preload="auto"
				poster={poster}
				playsInline
				aria-label="Video Player"
			>
				<source src={video} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</Ratio>
	);
};

export default Header;
