import Container from 'react-bootstrap/esm/Container';
import Ratio from 'react-bootstrap/esm/Ratio';

const YouTube = () => {
	return (
		<Container
			className="p-3 bgTransperent-2 border border-primary rounded boxShadowWhiteBot-10"
			fluid
		>
			<Ratio aspectRatio="16x9">
				<iframe
					src="https://www.youtube.com/embed/videoseries?list=PLp3Y7IwVl4aQTcSuZPt2FR1NO0G-kbuXA"
					title="Youtube video playlist"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
					allowFullScreen
				></iframe>
			</Ratio>
		</Container>
	);
};

export default YouTube;
