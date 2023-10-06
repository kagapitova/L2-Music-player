import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
import playList from "./tracks.js";
import {audio, statments} from "./statments.js";
import {setAudioProgress} from "./equalizer.js";

export const wavesurfer = WaveSurfer.create({
	container: ".wave",
	waveColor: "#0cebb8",
	progressColor: "#1e594f",
	height: 100,
	responsive: true,
	hideScrollbar: true,
	cursorColor: "#ffffff",
	cursorWidth: 2,
	barWidth: 5,
	barGap: 1.5,
});

export function setWave() {
	wavesurfer.load(playList[statments.trackNum].src);
	setWaveTime(0);
}

export function playWave() {
	wavesurfer.setVolume(0);
	wavesurfer.play();
}

export function stopWave() {
	wavesurfer.setVolume(0);
	wavesurfer.pause();
}

export function setWaveTime(time) {
	wavesurfer.setTime(time);
}

wavesurfer.on('click', (timePercent) => {
		setAudioProgress(audio, timePercent)
})

setWave();
