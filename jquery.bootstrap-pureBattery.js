/**
 * 
 */

(function($) {
	var definInfo = {
			dataKey: "pureBatteryOptions",
			progressBarId: "pure-battery-progressbar",
			levelValueId: "pure-battery-value-span",
			
	}
	
	var updateBatteryStatus = function(element, battery) {
		var option = element.data()[definInfo.dataKey];
		
		if(!option){
			return;
		}
		
		var charging = battery.charging;
		var level = Math.round(battery.level * 100);
		var levelStep = level;
		if(option.progressStep > 0){
			levelStep = Math.floor(level / option.progressStep) * option.progressStep;
		}
		
		var progressbar = element.find("#"+definInfo.progressBarId);
		
		progressbar.removeClass("progress-bar-success progress-bar-warning progress-bar-danger progress-bar-info");
		progressbar.find("#"+definInfo.levelValueId).remove();
		
		var batteryValue = $("<span></span>")
			.attr("id", definInfo.levelValueId)
			.css({"color": option.fontColor});
			
			
		if(charging){
			progressbar.addClass("progress-bar-info");
			progressbar.append(batteryValue.addClass("glyphicon " + option.chargingIcon));
		}else{
			if(level > option.warningLevel){
				progressbar.addClass("progress-bar-success");
			}
			else if(level > option.dangerLevel){
				progressbar.addClass("progress-bar-warning");
			}
			else{
				progressbar.addClass("progress-bar-danger");
			}
		}
		
		if(!charging || (charging && level < 100)){
			progressbar.append(batteryValue.html(level + "%"));			
		}
		progressbar.css({"width": levelStep + "%"});
		
		var data = 
			{
				charging: charging, 
				level: level, 
				//chargingTime: battery.chargingTime, 
				//dischargingTime: battery.dischargingTime
			};
		callDangerFunction(data, option);
	}

	var makeBattery = function(element, option){
		if(!element){
			return;
		}
		
		element.data(definInfo.dataKey, option);
		
		if(!element.prop("style").width){
			element.css({"width": option.width});
		}
		if(!element.prop("style").height){
			element.css({"height": option.height});
		}
		
		var main = $("<div></div>")
			.css({"width": "90%", "height": "100%", "display": "inline-block"})
			.appendTo(element);
		
		$('<div style="width: 2px; background-color: #333; height: 11px; margin-top: 5.5px; position: absolute; display: inline-block"></div>').appendTo(element);
		
		var progress = $("<div></div>")
			.addClass("progress pure-battery-progress")
			.css({"width": "100%", "height": "100%"})
			.css({"background-color": option.backgroupColor, "border-color": option.borderColor})
			.appendTo(main);
		
		$('<div></div>')
			.attr("id", definInfo.progressBarId)
			.attr("role", "progressbar")
			.attr("aria-valuemin", "0")
			.attr("aria-valuemax", "100")
			.addClass("progress-bar")
			.css({"width": "100%"})
			.appendTo(progress);
	}
	
	var callDangerFunction = function(data, option){
		if(!data.charging && data.level <= option.dangerLevel && 
				option.dangerCallback && typeof(option.dangerCallback) === 'function'){
			option.dangerCallback(data);
		}
	}
	
	var defaultSettings = {
			test: false,
			width: "50px",
			height: "22px",
			fontColor: '#fff',
			borderColor: '#333',
			backgroupColor: '#555', 
			chargingIcon: 'glyphicon-flash',
			warningLevel: 50,
			dangerLevel: 30,
			progressStep: 5,
			dangerCallback: function(data){
				console.log("pure battery. danger callback. battey.level: %d", data.level);
			},
	};
	
	var defaultOptions = {
			charging: false,
			level: 100
	}
	
	$.fn.pureBattery = function(option, optionName, optionValue){
		var element = $(this);
		
		if(!navigator.getBattery){
			console.warn("not supported browser.");
			return;
		}

		if(option && typeof(option) != 'object'){
			var batteryOption = element.data()[definInfo.dataKey];
			if(batteryOption.test && option === 'test'){
				if(typeof(optionName) === 'object'){
					var userOptions = $.extend({}, defaultOptions, optionName);
					
					userOptions.level = userOptions.level / 100;
					updateBatteryStatus(element, userOptions);
				}else{
					if(optionName === 'level'){
						updateBatteryStatus(element, {charging: false, level: optionValue / 100});					
					}else{
						updateBatteryStatus(element, {charging: optionValue, level: 1});
					}
				}				
			}
			
			return $(this);
		}
		
		if(element.data()[definInfo.dataKey]){
			console.log("exist pure battry.");
			return $(this);
		}
		
		var settings = $.extend({}, defaultSettings, option);
		
		navigator.getBattery().then(function(battery) {
			// 
			makeBattery(element, settings);
			
	  		// Update the battery status initially when the promise resolves ...
	  		updateBatteryStatus(element, battery);

	  		// .. and for any subsequent updates.
	  		battery.onchargingchange = function() {
	  			if(settings.test){
	  				return;
	  			}
	  			updateBatteryStatus(element, battery);
	  		};

	  		battery.onlevelchange = function() {
	  			if(settings.test){
	  				return;
	  			}
	  			updateBatteryStatus(element, battery);
	  		};
	  	});		
		
		return $(this);
	};
})($);