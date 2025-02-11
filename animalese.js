const text = document.getElementById('textInput');
const button = document.getElementById('readText');
let isPlaying = false;

button.addEventListener('click', () => {
	if (!isPlaying) {
		readText(text.value);
		isPlaying = true;
	}
});


const AudioContext = window.AudioContext || window.webkitAudioContext;

let context;

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function readText(text) {
	const sentences = parseText(text);

	for (let i = 0; i < sentences.length; i++) {
		console.log(sentences[i]);
		// for (let i = 0; i < textValue.length; i++) {
		// 	playLetter(textValue[i]);
		// 	await delay(100);
		// }
	}
	await delay(500);
	isPlaying = false;
}

function parseText(text) {
	const sentences = splitOnPunctuation(text);
	
	for (let i = 0; i < sentences.length; i++) {
		let sentence = trimExcessPunctuation(sentences[i].trim());
		const punctuation = sentence.charAt(sentence.length - 1);
		if (isAlNum(punctuation)) {
			sentence += ".";
		}
		sentences[i] = trimConsecutiveWhitespaces(sentence);
	}
	return sentences;
}

function splitOnPunctuation(str) {
	return str.match(/[^.,!?;:]+[.,!?;:]*/g) || [];
}

function isAlNum(char) {
	return /^[a-zA-Z0-9]$/.test(char);
}

function trimExcessPunctuation(str) {
	return str.replace(/([.,!?;:])\1+/g, "$1");
}

function trimConsecutiveWhitespaces(str) {
	return str.replace(/ +(?= )/g,'');
}
