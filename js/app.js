



setInterval(function(){showTime()}, 1000 );
function showTime(){
	wordClock.startClock();
	$('#debug').text(wordClock.getHours()+':'+wordClock.getMinutes()+':'+wordClock.getSeconds());
	
}


var wordClock = {

	getTime: function(){
		var timeNow = new Date(/*2013,2,1,10,35*/);
		return timeNow;
	},
	getHours: function(){
		var twelveHours = this.getTime().getHours();
		if(twelveHours > 12){
			return twelveHours - 12;
		}else if(twelveHours == 0 || twelveHours == 24){
			twelveHours = 12;
			return twelveHours;
		}else{
			return twelveHours;
		}
		return this;
	},
	getMinutes: function(){
		return this.getTime().getMinutes();
	},
	getSeconds: function(){
		return this.getTime().getSeconds();
	},

	displayOn: function(type, value){
		//Turn on display item based on data attribute and value
		$('[data-time-'+type+'="'+value+'"]').addClass('active');
		return this;
	},
	displayOff: function(type, value){
		//Turn off display item based on data attribute and value
		$('[data-time-'+type+'="'+value+'"]').removeClass('active');
		return this;
	},

	hourLogic: function(showMinute){

		//Get tense value & add to hours display if tense is 'to'
		//i.e. 5 minutes TO 10 when it is 9 o'clock
		var hourOffset = this.tenseLogic();

		//Set hour display
		this.displayOn('hours', this.getHours() + hourOffset);

		//showMinute determins if 0'clock display is active
		showMinute == false ? this.displayOff('hours', 0) : this.displayOn('hours', 0);
		
		return this;
	},

	minuteLogic: function(){

		//Set whether to show o'clock display
		this.getMinutes() % 5 == 0 ? this.hourLogic(false) : this.hourLogic(true);

		var minRemaining = 60 - this.getMinutes();

		//if if if
		if(minRemaining == 5 || minRemaining == 55){
			this.displayOn('minutes', 5);
			this.minuteLabel();
		}else if(minRemaining == 10 || minRemaining == 50){
			this.displayOn('minutes', 10);
			this.minuteLabel();
		}else if(minRemaining == 15 || minRemaining == 45){
			this.displayOn('minutes', 15);
		}else if(minRemaining == 30){
			this.displayOn('minutes', 30);
		}else if(minRemaining == 20 || minRemaining == 40){
			this.displayOn('minutes', 20);
			this.minuteLabel();
		}else if(minRemaining == 25 || minRemaining == 35){
			this.displayOn('minutes', 20);
			this.displayOn('minutes', 5);
			this.minuteLabel();
		}

		return this;
	},

	minuteLabel: function(){
		//Quicker to reuse - turn on 'minute label' display
		this.displayOn('minutes', 0);
	},

	tenseLogic: function(){
		//Determine wheter to use 'past' or 'to' indicator
		if(this.getMinutes() % 5 == 0 && this.getMinutes() <= 30){
			//activate 'past' display
			this.displayOn('tense', 1);
			//No need to offset hour display
			return 0;
		}else if(this.getMinutes() % 5 == 0 && this.getMinutes() > 30){
			//activate 'to' display
			this.displayOn('tense', 0);
			//Return hour offset #
			//Add to hours display since tense is 'to'
			//i.e. 5 minutes TO 10 when it is 9 o'clock
			return 1;
		}else if(this.getMinutes() % 5 != 0){
			return false;
		}
		return this;
	},

	startClock: function(){
		//reset display on each interval
		$('.clockPhrase:not([data-time-permanent])').removeClass('active');

		//Calculate time and turn on correct display
		this.minuteLogic();
		return this;
	}

}



