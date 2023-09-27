import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js';
import playList from "./tracks.js";
import {statments} from "./statments.js";

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

const playWave = document.querySelector(".play-wave");
const muteWave = document.querySelector(".player__btn-wave");
 function setWave(){
	wavesurfer.load(playList[statments.trackNum].src);
	
	 playWave.addEventListener("click", ()=>{
		 wavesurfer.playPause();
		 playWave.classList.toggle('pause')
		
	 });

}

setWave();

