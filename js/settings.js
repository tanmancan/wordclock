
//Setting control script
var clockSettings = {

	//Default Settings
	opts: {
		staticTime: 'off', // 'on' or 'off' to display a static time
		staticSetTime: 'Thu, 01 Jan 1970 12:25:00', //Default static time. Custom time format must be valid with Date()
		dispTime: 'off', //'on' or 'off' - shows current time or staticTime(if set)
		refreshRate: 1000 //in milliseconds
	},

	
	initSettings: function(){

		$('#showtime').is(':checked') ? this.opts.dispTime = 'on' : this.opts.dispTime = 'off';
		$('#statictime').is(':checked') ? this.opts.staticTime = 'on' : this.opts.staticTime = 'off';
		
		return this;

	},
	applySettings: function(){

		this.initSettings();
		startClock(this.opts);
		return this;
	}
}



$('.switch').on('click', function(){

	clockSettings.applySettings();
});