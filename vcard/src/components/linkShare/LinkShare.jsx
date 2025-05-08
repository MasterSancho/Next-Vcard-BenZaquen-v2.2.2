import { useEffect, useState } from 'react';
import LinkIcon from '../linkIcon/LinkIcon';
import { linkShareData } from '../../staticData';
import Row from 'react-bootstrap/esm/Row';

const LinkShare = () => {
	const [currentUrl, setCurrentUrl] = useState('');

	useEffect(() => {
		setCurrentUrl(window.location.href);
	}, []);

	return (
		<div className="my-4 px-4 text-light text-center">
			<h2 className="fs-2">שתפו כרטיס ביקור</h2>
			<Row>
				{linkShareData.map((item, index) => (
					<LinkIcon
						key={index}
						href={item.getUrl(currentUrl)}
						icon={<item.icon fill="red" size="25px" />}
						label={item.label}
						aria-label={item.ariaLebel}
					/>
				))}
			</Row>
		</div>
	);
};

export default LinkShare;
