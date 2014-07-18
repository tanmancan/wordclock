var wordClock = new function(){

	this.defaults = {
		staticTime: false, // true or flase
		staticSetTime: 'Thu, 01 Jan 1970 12:25:00', //String argument for Date()
		refreshRate: 1000, //in milliseconds
		debug: false //true or false
	}

	this.settings = {};


	this.setOptions = function(options){
		var settings = $.extend( {}, this.defaults, options );
		return settings;
	}

	this.initClock = function(options){

		//Set up settings and options
		this.settings = this.setOptions(options);
		that = this;

		var refreshId = setInterval(function(){that.startClock()}, this.settings.refreshRate );

		return this;
	}

	this.startClock = function(){

		//reset display on each interval
		$('.clockPhrase:not([data-time-permanent])').removeClass('active');

		//Begin calculating time and turn on correct display
		this.minuteLogic();
		
		//debug settings
		if(this.settings.debug == true)this.debug();

		return this;
	}

	this.debug = function(){

		$('#debug').text(this.getHours()+':'+this.getMinutes()+':'+this.getSeconds());

		return this;
	}

	this.error =  function(msg){

		$('#debug').text('Error: '+msg);
		clearInterval(refreshId);
	}

	this.getTime = function(){

		if(this.settings.staticTime == false){
			var timeNow = new Date();
		}else if(this.settings.staticTime == true){
			var timeNow = new Date(this.settings.staticSetTime);
			if(timeNow == 'Invalid Date' || timeNow == NaN){
				this.error('Invalid dateformat used in staticSetTime');
			}
		}else{
			this.error('StaticTime incorrect value');
			return false;
		}
		
		return timeNow;
	}

	this.getHours = function(){
		var hourConvert = this.getTime().getHours();
		if(hourConvert > 12){
			return hourConvert - 12;
		}else if(hourConvert == 0 || hourConvert == 24){
			hourConvert = 12;
			return hourConvert;
		}else{
			return hourConvert;
		}
		return this;
	}

	this.getMinutes = function(){
		return this.getTime().getMinutes();
	}
	this.getSeconds = function(){
		return this.getTime().getSeconds();
	}

	this.displayOn = function(type, value){
		//Turn on display item based on data attribute and value
		$('[data-time-'+type+'="'+value+'"]').addClass('active');
		return this;
	}

	this.displayOff = function(type, value){
		//Turn off display item based on data attribute and value
		$('[data-time-'+type+'="'+value+'"]').removeClass('active');
		return this;
	}


	this.hourLogic = function(showMinute){

		//Get tense value & add to hours display if tense is 'to'
		//i.e. 5 minutes TO 10 when it is 9 o'clock
		var hourOffset = this.tenseLogic();
		//console.log(this.getHours() + hourOffset);
		//Set hour display
		this.displayOn('hours', this.getHours() + hourOffset);

		//showMinute determins if 0'clock display is active
		showMinute == false ? this.displayOff('hours', 0) : this.displayOn('hours', 0);
		
		return this;
	}

	this.minuteLogic = function(){

		//Set whether to show o'clock display
		this.getMinutes() % 5 == 0 && this.getMinutes() != 0 ? this.hourLogic(false) : this.hourLogic(true);

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
	}


	this.minuteLabel = function(){
		//Quicker to reuse - turn on 'minute label' display
		this.displayOn('minutes', 0);
	}


	this.tenseLogic = function(){

		//Determine wheter to use 'past' or 'to' indicator
		if(this.getMinutes() % 5 == 0 && this.getMinutes() <= 30 && this.getMinutes() != 0){
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
		}else{
			return 0;
		}
		return this;
	}

	return this;

}

wordClock.initClock({
		staticTime: false,
		staticSetTime: 'Thu, 01 Jan 1970 12:25:00',
		debug: false
	});