const textInput = document.getElementById('textInput');
const button = document.getElementById('readText');
let isPlaying = false;

const letters = [
	new Audio('audio/A.mp3'),
	new Audio('audio/B.mp3'),
	new Audio('audio/C.mp3'),
	new Audio('audio/D.mp3'),
	new Audio('audio/E.mp3'),
	new Audio('audio/F.mp3'),
	new Audio('audio/G.mp3'),
	new Audio('audio/H.mp3'),
	new Audio('audio/I.mp3'),
	new Audio('audio/J.mp3'),
	new Audio('audio/K.mp3'),
	new Audio('audio/L.mp3'),
	new Audio('audio/M.mp3'),
	new Audio('audio/N.mp3'),
	new Audio('audio/O.mp3'),
	new Audio('audio/P.mp3'),
	new Audio('audio/Q.mp3'),
	new Audio('audio/R.mp3'),
	new Audio('audio/S.mp3'),
	new Audio('audio/T.mp3'),
	new Audio('audio/U.mp3'),
	new Audio('audio/V.mp3'),
	new Audio('audio/W.mp3'),
	new Audio('audio/X.mp3'),
	new Audio('audio/Y.mp3'),
	new Audio('audio/Z.mp3')
]

let letterAudio = [];

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();


button.addEventListener('click', () => {

	if (context.state === "suspended") {
		setup();
		context.resume();
	}

	if (!isPlaying) {
		isPlaying = true;
		readText(textInput.value);
	}
});

function setup() {
	letterAudio = letters.map(letter => context.createMediaElementSource(letter));

	letterAudio.forEach(source => source.connect(context.destination)); //??
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function readText(text) {
	const sentences = parseText(text);

	for (let i = 0; i < sentences.length; i++) {
		console.log(sentences[i]);
		for (let j = 0; j < sentences[i].length; j++) {
			const letter = sentences[i].charAt(j).toLowerCase();

			if (isLetter(letter)) {
				playLetter(letter);
			}
			else {
				await delay(150);
			}

			await delay(100);
		}
		await delay(250);
	}
	await delay(250);
	isPlaying = false;
}

function playLetter(letter) {
	const i = letter.charCodeAt(0) - 97;

	if (i >= 0 && i < letterAudio.length) {
		const source = context.createBufferSource();
		source.buffer = letterAudio[i];
		source.connect(context.destination);
		source.start();
		console.log("playing: " + letter);
	}
	else {
		console.log("invalid letter: " + letter + " code " + i);
	}
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

function isLetter(char) {
	return /^[a-zA-Z]$/.test(char);
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
