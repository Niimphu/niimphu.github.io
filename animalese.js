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
let osc;
let osc2;
let gain;

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function readText(paragraph) {
	const text = parseParagraph(paragraph);
	// getPronunciation(encodedSentence).then(console.log).catch(console.error);

	// for (let i = 0; i < textValue.length; i++) {
	// 	playLetter(textValue[i]);
	// 	await delay(100);
	// }
	await delay(500);
	isPlaying = false;
}

function parseParagraph(paragraph) {
	const sentences = splitOnPunctuation(paragraph);
	let text = new Map();
	
	for (let i = 0; i < sentences.length; i++) {
		let sentence = sentences[i];
		let punctuation = sentence.charAt(sentence.length - 1);
		if (isLetter(punctuation)) {
			punctuation = ".";
		}
		else {
			sentence = sentence.slice(0, -1);
		}

		const words = sentence.split(" ");
		text.set(i, { words, punctuation });
		console.log("New sentence:", text.get(i));
	}
	
	return text;
}

function splitOnPunctuation(str) {
	return str.split(/[.,!?;:]+/);
}

function isLetter(str) {
	return str.length === 1 && str.toLowerCase() != str.toUpperCase();
}


async function getPronunciation(word) {
	const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
	if (response.ok) {
		const data = await response.json();
		return data[0].phonetics[0]?.text || "Pronunciation not available";
	} else {
		throw new Error("Word not found");
	}
}


const phonetics = {
	A: "AH", B: "BUH", C: "CUH", D: "DUH", E: "EH", F: "EFF", G: "GUH",
	H: "HAH", I: "IH", J: "JAY", K: "KAY", L: "ELL", M: "EM", N: "EN",
	O: "OH", P: "PUH", Q: "QUH", R: "AR", S: "ESS", T: "TUH", U: "UH",
	V: "VEE", W: "WUH", X: "EX", Y: "YUH", Z: "ZEE"
};

function playLetter(letter) {
	context = new AudioContext();
	const phonetic = phonetics[letter];

	if (!phonetic) {
		console.warn(`No phonetic found for letter: ${letter}`);
		return; // Return early if no phonetic exists for this letter
	}

	const osc = context.createOscillator();
	const gain = context.createGain();

	// Set up the oscillator
	osc.type = 'sine'; // You can experiment with 'square', 'triangle', etc.
	osc.frequency.setValueAtTime(200, context.currentTime); // Base frequency

	// Modulate frequency for each phonetic sound
	if (phonetic.includes("UH")) osc.frequency.setValueAtTime(300, context.currentTime);
	if (phonetic.includes("AH")) osc.frequency.setValueAtTime(400, context.currentTime);
	if (phonetic.includes("EE") || phonetic.includes("IH")) osc.frequency.setValueAtTime(500, context.currentTime);

	// Smoothly control volume (envelope)
	gain.gain.setValueAtTime(0, context.currentTime); // Start at 0 volume
	gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.1); // Fade in
	gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5); // Fade out

	// Connect nodes and start
	osc.connect(gain);
	gain.connect(context.destination);
	osc.start();
	osc.stop(context.currentTime + 0.5); // Stop after 0.5 seconds
}
