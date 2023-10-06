import {audio, statments} from "./statments.js";

let context, analyser, src, array, logo;

logo = document.getElementById("logo").style;


export function setEqualizer(){
	
	if(!context){
		preparation();
	}
	if(!audio.paused){
		audio.play();
		loop();
	}else{
		audio.pause();
	}
}

export function preparation(){
	context = new AudioContext();
	analyser = context.createAnalyser();
	src = context.createMediaElementSource(audio);
	src.connect(analyser);
	analyser.connect(context.destination);
	loop();
}

export function loop(){
	if(!audio.paused){
		window.requestAnimationFrame(loop);
	}
	array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	
	logo.minHeight = (array[40])+"px";
	logo.width =  (array[40])+"px";
	
	const chunks = [];
	let acamulator = 0;
	array.forEach((item, key) => {
		acamulator += item;
		if (key % 64 === 0) {
			chunks.push(acamulator / 64);
			acamulator = 0;
		}
	});
	
	document.querySelectorAll('.line').forEach((el, key) => {
		el.style.height = chunks[key]/3 + 'px';
	})
}

function formatNumber(number) {
	return typeof number === 'number' && number < 10 ? `0${number}` : number;
}

export function setAudioProgress(audio, timePercent) {
	const audioProgress = document.querySelector('.js-player-audio-progress');
	const duration = audio.duration;
	statments.currentTime = typeof timePercent !== 'number'
		? duration * audioProgress.value / 100
		: duration * timePercent
	audio.currentTime = statments.currentTime;
	audioProgress.style.background = `linear-gradient(to right, #0bdbac 0%, #0bdbac ${audioProgress.value}%, #ffffff ${audioProgress.value}%)`;
	displayReadableTime(statments.currentTime);
}

export function displayReadableTime(currentTime) {
	const songTimer = document.querySelector('.js-player-timer');
	const hours = Math.floor(currentTime / 3600) > 0 ? Math.floor(currentTime / 3600) : '';
	const minutes = Math.floor(currentTime / 60);
	const seconds = Math.floor(currentTime % 60);
	const showHours = formatNumber(hours) + (formatNumber(hours) === '' ? '' : ':');
	songTimer.textContent = `${showHours}${formatNumber(minutes)}:${formatNumber(seconds)}`;
}
