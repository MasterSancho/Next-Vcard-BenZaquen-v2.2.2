import Col from 'react-bootstrap/esm/Col';

const LinkIcon = ({ href, icon, text, label }) => {
	const url = typeof href === 'function' ? href() : href;

	return (
		<Col>
			<a href={url} aria-label={label}>
				{icon}
				<p className="fs-6 lh-1">{text}</p>
			</a>
		</Col>
	);
};

export default LinkIcon;
