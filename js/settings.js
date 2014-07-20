
//Setting control script
var clockSettings = {

	//Preset Settings
	staticOptions: {
		staticTime: 'on',
		staticSetTime: 'Thu, 01 Jan 1970 10:55:00',
		debug: 'on',
		refreshRate: 1000
	},
	debugOn: {
		staticTime: 'off',
		staticSetTime: 'Thu, 01 Jan 1970 10:55:00',
		debug: 'on',
		refreshRate: 1000
	},
	debugOff: {
		staticTime: 'off',
		staticSetTime: 'Thu, 01 Jan 1970 10:55:00',
		debug: 'off',
		refreshRate: 1000
	},

	optShowTime: function(){
		return $('#showtime').is(':checked');
	},
	optStaticTime: function() {
		return $('#statictime').is(':checked');
	},
	initSettings: function(){

		if($('#showtime').is(':checked')) {
		    //startClock(this.debugOn);
		    console.log('checked');
		    return (this.debugOn);
		}else{
			//startClock(this.debugOff);
			console.log('unchecked');
			return (this.debugOff)
		}
		console.log('clicked');
	},
	applySettings: function(){
		startClock(this.initSettings());
		return this;
	}
}

$('#staticTime').on('click', function(){
	startClock(staticOptions);
});

$('.switch').on('click', function(){

	clockSettings.applySettings();
});