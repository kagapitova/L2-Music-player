import {audio} from "./main.js";

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
