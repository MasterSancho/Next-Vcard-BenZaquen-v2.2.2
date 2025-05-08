import React from 'react';
import Row from 'react-bootstrap/esm/Row';
import LinkIcon from '../linkIcon/LinkIcon';
import { linksData } from '../../staticData';

const Links = () => {
	return (
		<div className="text-light text-center">
			<Row className="my-3">
				{linksData.slice(0, 3).map((link, index) => (
					<LinkIcon
						key={index}
						href={link.href}
						icon={React.createElement(link.icon, {
							fill: 'red',
							size: '27px',
						})}
						text={link.text}
						label={link.label}
					/>
				))}
			</Row>
			<Row className="my-3">
				{linksData.slice(3, 6).map((link, index) => (
					<LinkIcon
						key={index}
						href={link.href}
						icon={React.createElement(link.icon, {
							fill: 'red',
							size: '27px',
						})}
						text={link.text}
						label={link.label}
					/>
				))}
			</Row>
			<Row className="my-3">
				{linksData.slice(6).map((link, index) => (
					<LinkIcon
						key={index}
						href={link.href}
						icon={React.createElement(link.icon, {
							fill: 'red',
							size: '27px',
						})}
						text={link.text}
						label={link.label}
					/>
				))}
			</Row>
		</div>
	);
};

export default Links;
