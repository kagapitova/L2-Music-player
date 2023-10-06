import playList from './tracks.js'
import {audio, statments} from "./statments.js";
import {displayReadableTime, setAudioProgress, setEqualizer} from "./equalizer.js";
import {playWave, setWave, setWaveTime, stopWave} from "./wave.js";

const playListContainer = document.querySelector('.play-list');
const prevTrack = document.querySelector('.play-prev');
const nextTrack = document.querySelector('.play-next');
const audioProgress = document.querySelector('.js-player-audio-progress');
const volumeProgress = document.querySelector('.js-player-volume-progress');
const playVolumeBtn = document.querySelector('.js-player-btn-volume');
const songDuration = document.querySelector('.js-player-duration');

window.localStorage.setItem('playlist', JSON.stringify(playList));

playList.forEach((el, index) => {
	const li = document.createElement('li');
	li.classList.add('play-item')
	li.textContent = el.title
	li.addEventListener('click', () => {
		statments.trackNum = index
		switchTrack();
	})
	playListContainer.append(li)
})

function toggleAudio() {
	statments.isPlaying ? stopAudio() : playAudio();
}

function playAudio() {
	playSwitcher.classList.add('pause')
	audio.play();
	playWave();
	statments.isPlaying = true;
}

function stopAudio() {
	playSwitcher.classList.remove('pause')
	audio.pause();
	statments.isPlaying = false;
	stopWave();
}


const playSwitcher = document.querySelector('.play')
playSwitcher.addEventListener('click',()=>{
	playSwitcher.classList.toggle('pause')
	toggleAudio()
	setEqualizer()
	curentTrack[statments.trackNum].classList.add('item-active')
	
})
prevTrack.addEventListener('click', ()=>{
	if(statments.trackNum === 0){
		statments.trackNum += playList.length -1
	} else {
		statments.trackNum --
	}
	switchTrack();
})
nextTrack.addEventListener('click', ()=>{
	if(statments.trackNum === playList.length -1){
		statments.trackNum = 0
	} else {
		statments.trackNum ++
	}
	switchTrack();
})

function switchTrack() {
	stopAudio();
	curentTrack.forEach(el =>{
		el.classList.remove('item-active')
	})
	curentTrack[statments.trackNum].classList.add('item-active')
	audio.src = playList[statments.trackNum].src;
	setEqualizer();
	setWave();
	audio.currentTime = 0;
	audioProgress.style.background = `linear-gradient(to right, #0bdbac 0%, #0bdbac 0%, #ffffff 0%)`;
}

function handleProgress() {
	if (statments.isProgressChanging) {
		return;
	}
	const duration = audio.duration;
	statments.currentTime = (statments.currentTime === 'NaN') ? statments.currentTime : audio.currentTime;
	const percent = (statments.currentTime / duration) * 100;
	audioProgress.value = (isNaN(percent)) ? 0 : percent;
	audioProgress.style.background = `linear-gradient(to right, #0bdbac 0%, #0bdbac ${percent}%, #ffffff ${percent}%)`;
	displayReadableTime(statments.currentTime);
	
	if (statments.currentTime === duration) {
		stopAudio();
	}
}

audioProgress.addEventListener('click', setProgress);
export function setProgress(time) {
	statments.isProgressChanging = true;
	setAudioProgress(audio, time)
	setWaveTime(statments.currentTime);
	statments.isProgressChanging = false;
}

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
