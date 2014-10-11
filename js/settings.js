// The MIT License (MIT)

// Copyright (c) 2014 Tanveer Karim
// tkarimdesign.com

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


//Setting control script
var clockSettings = {

	//Default Settings
	opts: {
		theme: 'glass',
		staticTime: 'off', // 'on' or 'off' to display a static time
		staticSetTime: 'Thu, 01 Jan 1970 12:25:00', //Default static time. Custom time format must be valid with Date()
		dispTime: 'off', //'on' or 'off' - shows current time or staticTime(if set)
		refreshRate: 1000 //in milliseconds
	},

	
	initSettings: function(){

		//All settings
		
		$('#showtime').is(':checked') ? this.opts.dispTime = 'on' : this.opts.dispTime = 'off';
		$('#statictime').is(':checked') ? this.opts.staticTime = 'on' : this.opts.staticTime = 'off';
		this.opts.theme = $('#theme').val();
		

		//Custom options per settings

		//Static time manual adjustment
		//Update static value or hide the manual adjustment inputs
		$('#statictime').is(':checked') ? this.staticTimeManual() : $('.staticInput').hide();


		return this;

	},

	staticTimeManual: function(){

		$('.staticInput').show();
		var hr  = $('input.staticHours').val(),
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
	//console.log($('input.staticHours').val());
	//console.log($('input.staticMinutes').val());
	clockSettings.applySettings();
});

$('.staticInput input, #theme').on('change', function(){
	//console.log('val changed');
	clockSettings.applySettings();	
});