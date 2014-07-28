// The MIT License (MIT)

// Copyright (c) 2014 Tanveer Karim

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


var wordClock = new function(){

	this.defaults = {
		staticTime: 'off', // 'on' or 'off' to display a static time
		staticSetTime: 'Thu, 01 Jan 1970 12:25:00', //Default static time. Custom time format must be valid with Date()
		dispTime: 'off', //'on' or 'off' - shows current time or staticTime(if set)
		refreshRate: 1000 //in milliseconds
	}

	this.settings = {};

	var refreshId;

	this.setOptions = function(options){
		var settings = $.extend( {}, this.defaults, options );

		//dispTime validation
		switch(settings.dispTime){
		    case 'on':
		        $('.dispTime').data('time-permanent', 1).html('');
		        break;
		    case 'off':
		    	$('.dispTime').data('time-permanent', 0).html('clock');
		        break;
		    default:
		        this.error('Invalid dispTime option. Must be "on" or "off"');
		}
		//staticTime + staticSetTime validation
		switch(settings.staticTime){
		    case 'on':
		        var validTime = new Date(settings.staticSetTime);
				if(validTime == 'Invalid Date' || validTime == NaN){
					this.error('Invalid dateformat used in staticSetTime');
				}
		        break;
		    case 'off':
		        break;
		    default:
		        this.error('Invalid staticTime option.  Must be "on" or "off"');
		}
		if(typeof settings.refreshRate != 'number')this.error('refreshRate must be a number(in milliseconds)');

		return settings;
	}

	this.initClock = function(options){

		//Set up settings and custom options
		this.settings = this.setOptions(options);
		that = this;

		//Turn on/turn off the display that do not refresh with time change
		$('.clockPhrase').each(function(index, element){
			var thisDisp = $(element);
			//console.log(thisDisp);
			//console.log(thisDisp.data('time-permanent'));
			if (thisDisp.data('time-permanent') == 1) {
				thisDisp.addClass('active');
			}else{
				thisDisp.removeClass('active');
			}
		});

		//Start display update cycle
		refreshId = setInterval(function(){that.refreshClock()}, this.settings.refreshRate );

		return this;
	}

	this.refreshClock = function(){

		//reset display on each cycle
		$('.clockPhrase.active:not([data-time-permanent])').removeClass('active');

		//Begin calculating time and turn on corresponding displays
		this.minuteCircuit();
		this.hourCircuit();
		
		//Show realtime clock
		if(this.settings.dispTime == 'on')this.dispTime();

		return this;
	}

	this.dispTime = function(){

		$('.dispTime').text(this.getHours()+':'+this.getMinutes()+':'+this.getSeconds());

		return this;
	}

	this.error =  function(msg){
		//Create Error Container
		clearInterval(refreshId);
		$('body').html('<div class="error">Error: '+msg+'</div>');
	}

	this.getTime = function(){

		if(this.settings.staticTime == 'off'){
			var timeNow = new Date();
		}else if(this.settings.staticTime == 'on'){
			var timeNow = new Date(this.settings.staticSetTime);
		}else{
			this.error('StaticTime incorrect value');
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


	this.hourCircuit = function(){

		//Decide whether to show 'to' or 'past' and retrieve offset value for hours
		var hourOffset = this.timeOffset(),
			hourNow = this.getHours();

		//Adjust hours when displaying 'to' or 'past'
		if(hourNow + hourOffset > 12){
			hourNow = 1;
		}else{
			hourNow += hourOffset;
		}

		//Set hour display
		this.displayOn('hours', hourNow);

		//Set whether to show the "o'clock" display
		if(this.getMinutes() % 5 == 0 && this.getMinutes() != 0){
			this.displayOff('hours', 0);
		}else{
			this.displayOn('hours', 0);
		}
		
		return this;
	}

	this.minuteCircuit = function(){

		var minRemaining = 60 - this.getMinutes();

		switch (minRemaining){
			//'five' minutes display
			case 5: 
			case 55:
				this.displayOn('minutes', 5);
				this.displayOn('minutes', 0);
				break;
			//10
			case 10:
			case 50:
				this.displayOn('minutes', 10);
				this.displayOn('minutes', 0);
				break;
			//15
			case 15:
			case 45:
				this.displayOn('minutes', 15);
				break;
			//20
			case 20:
			case 40:
				this.displayOn('minutes', 20);
				this.displayOn('minutes', 0);
				break;
			//25 - 'twenty' + 'five'
			case 25:
			case 35:
				this.displayOn('minutes', 20);
				this.displayOn('minutes', 5);
				this.displayOn('minutes', 0);
				break;
			//30 - 'half'
			case 30:
				this.displayOn('minutes', 30);
				break;
			default:
				null;

		}

		return this;
	}


	this.timeOffset = function(){

		//Determine whether to use 'past' or 'to' indicator
		if(this.getMinutes() % 5 == 0 && this.getMinutes() <= 30 && this.getMinutes() != 0){
			//activate 'past' display
			this.displayOn('offset', 1);
			//No need to offset hour display
			return 0;
		}else if(this.getMinutes() % 5 == 0 && this.getMinutes() > 30){
			//activate 'to' display
			this.displayOn('offset', 0);
			//Return hour offset #
			//Add to hours display since offset is 'to'
			//i.e. 5 minutes TO 10 when it is 9 o'clock
			return 1;
		}else{
			return 0;
		}
		return this;
	}

	return this;

};

function startClock(options){
	wordClock.initClock(options);
}
