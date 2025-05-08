import { useState, useEffect } from 'react';

const useTypingEffect = (text, typingSpeed = 150, delay = 9000) => {
	const firstLetter = text.charAt(0); // Get the first letter
	const restOfText = text.slice(1); // Get the rest of the text
	const [typedText, setTypedText] = useState('');
	const [typing, setTyping] = useState(true);

	useEffect(() => {
		if (!typing) {
			const delayTimeout = setTimeout(() => {
				setTypedText('');
				setTyping(true);
			}, delay);
			return () => clearTimeout(delayTimeout);
		}

		let index = 0;
		const typingInterval = setInterval(() => {
			if (index < restOfText.length) {
				setTypedText(restOfText.substring(0, index + 1));
				index++;
			} else {
				clearInterval(typingInterval);
				setTyping(false);
			}
		}, typingSpeed);

		return () => clearInterval(typingInterval);
	}, [restOfText, typingSpeed, typing, delay]);

	return firstLetter + typedText; // Combine the first letter with the typed text
};

export default useTypingEffect;
