
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

		//All settings
		$('#showtime').is(':checked') ? this.opts.dispTime = 'on' : this.opts.dispTime = 'off';
		$('#statictime').is(':checked') ? this.opts.staticTime = 'on' : this.opts.staticTime = 'off';
		

		//Custom options per settings

		//Static time manual adjustment
		//Update static value or hide the manual adjustment inputs
		$('#statictime').is(':checked') ? this.staticTimeManual() : $('.staticInput').hide();


		return this;

	},

	staticTimeManual: function(){

		$('.staticInput').show();
		var hr = hr = $('input.staticHours').val(),
			min = $('input.staticMinutes').val();

		//Workaround for buggy default val retrieval when using input[number]
		!hr ? hr = 12 : hr = $('input.staticHours').val();
		!min ? min = 25 : min = $('input.staticMinutes').val();

		this.opts.staticSetTime = 'Thu, 01 Jan 1970 '+hr+':'+min+':00';
	},

	applySettings: function(){

		//Initialize the settings
		this.initSettings();
		//Refresh the clock
		startClock(this.opts);
		return this;
	}
}



$('.switch').on('click', function(){
	console.log($('input.staticHours').val());
	console.log($('input.staticMinutes').val());
	clockSettings.applySettings();
});

$('.staticInput input').on('change', function(){
	console.log('val changed');
	clockSettings.applySettings();	
});