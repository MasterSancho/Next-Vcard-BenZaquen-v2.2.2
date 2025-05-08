import Row from 'react-bootstrap/esm/Row';
import Ratio from 'react-bootstrap/esm/Ratio';

const GoogleMap = () => {
	const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


	return (
		<>
			<h2 className="fs-2 text-light text-center">מיקום המשרד</h2>
			<div className="p-3 bgTransperent-2 border border-primary rounded boxShadowWhiteBot-10 whiteSpace-PreWrap">
				<Row>
					<Ratio aspectRatio="16x9">
						<iframe
							src={`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJs3VIvuzXAhUR7sJRhzi2Lvk&key=${apiKey}`}
							title="Google map office location"
							allowFullScreen
							className="px-1"
						></iframe>
					</Ratio>
				</Row>
			</div>
		</>
	);
};

export default GoogleMap;
