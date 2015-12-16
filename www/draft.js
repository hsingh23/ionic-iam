var meditationLen = 2 * 60;
var times = [
	8*60+30,
	2*60,
	10+10,15,10,
	5, 55,15,15,15,15,
	15,15,15,15,15,15,
	15,15,15,15,15,15,
	30,90,120,
	10,8,8,8,8,8,8,
	30,
	meditationLen,
	120,5*60,0
];
var pos = 0;
var playTingAfterTime = function(){
	if (pos < times.length){
		// play sound
		pos+=1;
		setTimeout(playTingAfterTime,times[pos]*100);
	}
};

playTingAfterTime();