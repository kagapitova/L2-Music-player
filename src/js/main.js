import playList from './tracks.js'
import { statments } from "./statments.js";
import {setEqualizer} from "./equalizer.js";

export const audio = new Audio();
const playListContainer = document.querySelector('.play-list');
const prevTrack = document.querySelector('.play-prev');
const nextTrack = document.querySelector('.play-next');
const songTimer = document.querySelector('.js-player-timer');
const audioProgress = document.querySelector('.js-player-audio-progress');
const volumeProgress = document.querySelector('.js-player-volume-progress');
const playVolumeBtn = document.querySelector('.js-player-btn-volume');
const songDuration = document.querySelector('.js-player-duration');

window.localStorage.setItem('playlist', JSON.stringify(playList));

function formatNumber(number) {
	return typeof number === 'number' && number < 10 ? `0${number}` : number;
}


playList.forEach(el => {
	const li = document.createElement('li');
	li.classList.add('play-item')
	li.textContent = el.title
	playListContainer.append(li)
})

const allTracks = document.querySelectorAll('.play-item');
allTracks.forEach((el)=>{
	el.addEventListener('click',()=>{
	
	})
})

function playAudio() {
	audio.src = playList[statments.trackNum].src;
	audio.currentTime = 0;
	if(playSwitcher.classList.contains('pause')){
		audio.play();
		statments.isPlaying = true;
	}
	statments.isPlaying = false;
}


const playSwitcher = document.querySelector('.play')
playSwitcher.addEventListener('click',()=>{
	playSwitcher.classList.toggle('pause')
	playAudio()
	setEqualizer()
	curentTrack[statments.trackNum].classList.add('item-active')
	
})
prevTrack.addEventListener('click', ()=>{
	if(statments.trackNum === 0){
		statments.trackNum += playList.length -1
	} else {
		statments.trackNum --
	}
	playAudio()
	curentTrack.forEach(el =>{
		el.classList.remove('item-active')
	})
	curentTrack[statments.trackNum].classList.add('item-active')
	setEqualizer();
})
nextTrack.addEventListener('click', ()=>{
	if(statments.trackNum === playList.length -1){
		statments.trackNum = 0
	} else {
		statments.trackNum ++
	}
	playAudio()
	curentTrack.forEach(el =>{
		el.classList.remove('item-active')
	})
	curentTrack[statments.trackNum].classList.add('item-active')
	setEqualizer();
})

function handleProgress() {
	const duration = audio.duration;
	statments.currentTime = (statments.currentTime === 'NaN') ? statments.currentTime : audio.currentTime;
	const percent = (statments.currentTime / duration) * 100;
	audioProgress.value = (isNaN(percent)) ? 0 : percent;
	audioProgress.style.background = `linear-gradient(to right, #0bdbac 0%, #0bdbac ${percent}%, #ffffff ${percent}%)`;
	displayReadableTime(statments.currentTime);
	
	if (statments.currentTime === duration) {
		audio.pause();
		statments.isPlaying = false;
	}
}
function setProgress() {
	const duration = audio.duration;
	console.log(duration)
	statments.currentTime = duration * audioProgress.value / 100;
	audio.currentTime = statments.currentTime;
	audioProgress.style.background = `linear-gradient(to right, #0bdbac 0%, #0bdbac ${audioProgress.value}%, #ffffff ${audioProgress.value}%)`;
	displayReadableTime(statments.currentTime);
}

function displayReadableTime(currentTime) {
	const hours = Math.floor(currentTime / 3600) > 0 ? Math.floor(currentTime / 3600) : '';
	const minutes = Math.floor(currentTime / 60);
	const seconds = Math.floor(currentTime % 60);
	const showHours = formatNumber(hours) + (formatNumber(hours) === '' ? '' : ':');
	songTimer.textContent = `${showHours}${formatNumber(minutes)}:${formatNumber(seconds)}`;
}


audioProgress.addEventListener('click', setProgress);

function setHendlers(index) {
	audio.src = playList[index].src;
	songDuration.textContent = playList[index].duration;
	volumeProgress.value = statments.lastVolumeValue;
	handleProgress();
	handleProgressVolume(statments.lastVolumeValue);
}


function toggleVolume() {
	const prevVolumeValue = statments.lastVolumeValue;
	
	if (!playVolumeBtn.classList.contains('icon-volumeMute')) {
		mute();
		handleProgressVolume(statments.lastVolumeValue);
		statments.lastVolumeValue = prevVolumeValue;
	}
	else {
		unmute();
		statments.lastVolumeValue = prevVolumeValue;
		handleProgressVolume(statments.lastVolumeValue);
	}
}

function mute() {
	playVolumeBtn.classList.add('icon-volumeMute');
	audio.muted = true;
	statments.lastVolumeValue = 0;
}

function unmute() {
	playVolumeBtn.classList.remove('icon-volumeMute');
	audio.muted = false;
}

function handleProgressVolume(volumeValue) {
	statments.lastVolumeValue = +volumeValue;
	volumeProgress.value = statments.lastVolumeValue;
	audio.volume = statments.lastVolumeValue / 100;
	const volumeMax = 100;
	const percent = (statments.lastVolumeValue / volumeMax) * 100;
	volumeProgress.style.background = `linear-gradient(to right, #0bdbac 0%, #0bdbac ${percent}%, #ffffff ${percent}%)`;
	if (statments.lastVolumeValue === 0) {
		mute();
	} else {
		unmute();
	}
}

const curentTrack = document.querySelectorAll('.play-item');
setHendlers(statments.trackNum);


audio.addEventListener('timeupdate', handleProgress);
playVolumeBtn.addEventListener('click', toggleVolume);
volumeProgress.addEventListener('input', () => {
	handleProgressVolume(volumeProgress.value);
});
