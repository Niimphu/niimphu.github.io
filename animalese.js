const textInput = document.getElementById('textInput');
const button = document.getElementById('readText');
let isPlaying = false;

const letters = [
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/A.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/B.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/C.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/D.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/E.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/F.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/G.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/H.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/I.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/J.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/K.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/L.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/M.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/N.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/O.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/P.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/Q.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/R.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/S.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/T.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/U.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/V.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/W.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/X.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/Y.mp3',
	'https://raw.githubusercontent.com/Niimphu/niimphu.github.io/main/audio/Z.mp3'
];

let letterAudio = [];

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

button.addEventListener('click', () => {
	if (context.state === "suspended") {
		context.resume();
		setup();
	}

	if (!isPlaying) {
		isPlaying = true;
		readText(textInput.value);
	}
});

async function setup() {
	letterAudio = await Promise.all(letters.map(url => loadAudio(url)));
	delay(100);
}

async function loadAudio(url) {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	return await context.decodeAudioData(arrayBuffer);
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function readText(text) {
	const sentences = parseText(text);

	for (let i = 0; i < sentences.length; i++) {
		console.log(sentences[i]);
		const len = sentences[i].length;
		for (let j = 0; j < len; j++) {
			const letter = sentences[i].charAt(j).toLowerCase();

			if (isLetter(letter)) {
				playLetter(letter);
			}
			else {
				await delay(10); // additional delay between words
			}
			await delay(30); // delay between letters
		}
		await delay(250); // delay between sentences
	}
	await delay(250);
	isPlaying = false;
}

function playLetter(letter) {
	const i = letter.charCodeAt(0) - 97;

	if (i >= 0 && i < letterAudio.length) {
		const source = context.createBufferSource();
		source.buffer = letterAudio[i];
		source.playbackRate.value = 0.7;
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
