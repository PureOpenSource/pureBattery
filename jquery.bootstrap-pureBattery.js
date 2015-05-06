/*********************************************************************************************
 * PureBattery. v0.1-beta
 * ===========================================================================================
 * homepage: http://pureopensource.github.io/pureBattery/
 * 
 * Copyright 2015 Pure OpenSource.
 * Licensed under MIT (https://github.com/PureOpenSource/pureBattery/blob/master/LICENSE)
 *********************************************************************************************/

+function($) {
	'use strict';
	
	/**
	 * Pure Battery - Class Definition. 
	 */
	
	var PureBattery = function(element, options){
		this.options = options;
		this.$element = element;
		
		this.orginalBatteryInfo = null;
		this.testBatteryInfo = null;
		
		this.makeBattery();
		this.addBatteryEvent();
	}
	
	PureBattery.VERSION = '0.1-beta';
	
	PureBattery.DEFIN = {
		progressBarId: 'pure-battery-progressbar',
		levelValueId: 'pure-battery-value-span',
		
		dangerCallbackEvent: 'battery-danger',
		StableCallbackEvent: 'battery-stable',
	}
	
	PureBattery.DEFAULTS = {
		test: false,
		width: '50px',
		height: '22px',
		fontColor: '#ffffff',
		borderColor: '#333333',
		backgroupColor: '#555555', 
		chargingIcon: 'glyphicon-flash',
		warningLevel: 50,
		dangerLevel: 30,
		progressStep: 5,
	}
	
	// initial battery.
	PureBattery.prototype.makeBattery = function(){
		var $element = this.$element;
		var options = this.options;
		
		if(!$element.prop('style').width){
			$element.css({'width': options.width});
		}
		if(!$element.prop('style').height){
			$element.css({'height': options.height});
		}
		options.width = $element.prop('style').width;
		options.height = $element.prop('style').height;
		
		var main = $('<div></div>')
		.css({'width': '100%', 'height': '100%', 'display': 'inline-block'})
		.appendTo($element);
		
		var progress = $('<div></div>')
		.addClass('progress pure-battery-progress')
		.css({'width': '100%', 'height': '100%'})
		.css({'background-color': options.backgroupColor, 'border-color': options.borderColor})
		.appendTo(main);
		
		$('<div></div>')
		.attr('id', PureBattery.DEFIN.progressBarId)
		.attr('role', 'progressbar')
		.attr('aria-valuemin', '0')
		.attr('aria-valuemax', '100')
		.addClass('progress-bar')
		.css({'width': '100%'})
		.appendTo(progress);
	}
	
	// option method.
	PureBattery.prototype.updateBattery = function(){
		var $element = this.$element;
		var options = this.options;
		
		$element.css({'width': options.width});
		$element.css({'height': options.height});

		$element.find(".pure-battery-progress").css({'background-color': options.backgroupColor, 'border-color': options.borderColor});
	}
	
	// Battery Status.
	PureBattery.prototype.updateBatteryStatus = function(battery){
		var $element = this.$element;
		var options = this.options;

		// test method.
		if(options.test){
			if(this.testBatteryInfo == null) this.testBatteryInfo = this.orginalBatteryInfo;
			battery = $.extend({}, this.testBatteryInfo, battery);
			
			this.testBatteryInfo = battery;
		}
		// no test. options method.
		else if(!battery){
			battery = this.orginalBatteryInfo;
		}
		// battery event
		else{
			this.orginalBatteryInfo = battery;
		}
		
		var charging = battery.charging;
		var level = Math.round(battery.level * 100);
		var levelStep = level;
		if(options.progressStep > 0){
			// progressStep
			levelStep = Math.floor(level / options.progressStep) * options.progressStep;
			
			// min width
			if(levelStep <= 0){
				levelStep = 5;
			}
		}
		battery.viewLevel = level;
		
		var progressbar = $element.find('#'+PureBattery.DEFIN.progressBarId);
		
		progressbar.removeClass(function (index, css){
			return (css.match (/(^|\s)progress-bar-\S+/g) || []).join(' ');
		});
		progressbar.find('#'+PureBattery.DEFIN.levelValueId).remove();
		
		var batteryValue = $('<span></span>')
			.attr('id', PureBattery.DEFIN.levelValueId)
			.css({'color': options.fontColor});
			
		if(charging){
			progressbar.addClass('progress-bar-info');
			progressbar.append(batteryValue.addClass('glyphicon ' + options.chargingIcon));
		}else{
			if(level > options.warningLevel){
				progressbar.addClass('progress-bar-success');
			}
			else if(level > options.dangerLevel){
				progressbar.addClass('progress-bar-warning');
			}
			else{
				progressbar.addClass('progress-bar-danger');
			}
		}
		
		if(!charging || (charging && level < 100)){
			progressbar.append(batteryValue.html(level + '%'));			
		}
		progressbar.css({'width': levelStep + '%'});
		
		this.eventTrigger(battery);
	}
	
	// Battery addEventListerner.
	PureBattery.prototype.addBatteryEvent = function(){
		var THIS = this;
		var options = this.options;
		
		navigator.getBattery().then(function(battery) {
			// initial value.
			THIS.orginalBatteryInfo = battery;
			
			// initial battery status.
			THIS.updateBatteryStatus(battery);
			
			var eventFunction = function(){
				if(options.test) return;
	  			THIS.updateBatteryStatus(battery);
			}
			
	  		battery.addEventListener('chargingchange', eventFunction, false);
	  		battery.addEventListener('levelchange', eventFunction, false);
	  	});			
	}
	
	// Battery Danger, Stable Event Trigger execute.
	PureBattery.prototype.eventTrigger = function(battery){
		var options = this.options;

		var event = null;
		if(!battery.charging && battery.viewLevel <= options.dangerLevel){
			event = $.Event(PureBattery.DEFIN.dangerCallbackEvent);
		}
		else{
			event = $.Event(PureBattery.DEFIN.StableCallbackEvent);
		}
		// custom event object.
		event.battery = {
				level: battery.viewLevel,
				charging: battery.charging,
				dangerLevel: options.dangerLevel
			};
		this.$element.trigger(event);
	}
	
	// PureBattery option get, set method.
	PureBattery.prototype.option = function(name, value){
		// Options object return;
		if(name == undefined && value == undefined){
			return this.options;
		}
		
		if(typeof name == 'object'){
			$.extend(this.options, name);
		}
		else if(typeof name == 'string' && this.options[name] != undefined){
			if(value == undefined){
				return this.options[name];
			}
			
			this.options[name] = value;
		}
		else{
			console.warn('not supported option.', name, value);
			return;
		}
		
		this.updateBattery();
		this.updateBatteryStatus();
		
		return;
	}

	// option 'test' true. battery level, charging test method.
	PureBattery.prototype.test = function(name, value){
		if(!this.options.test){
			console.log("disable test option. ", this.options.test);
			return;
		}
		
		var testObject = {};
		
		if(typeof name == 'object'){
			testObject = name;
		}
		else if(typeof name == 'string' && this.batteryInfo[name] != undefined){
			testObject[name] = value;
		}
		else{
			console.warn('not supported option.', name, value);
			return;			
		}
		
		if(testObject.level) testObject.level = testObject.level / 100;
		
		this.updateBatteryStatus(testObject);
		
		return;
	}
	
	/**
	 * Pure Battery - Plug-in Definition.
	 */
	
	function Plugin(option, _relatedTarget, _relatedValue){
		var $this = $(this);
		
		if(!navigator.getBattery){
			console.warn('navigator.gerBattery API\'s not supported browser.');
			return $this;
		}
		
		var data    = $this.data('pure.pureBattery');
		var options = $.extend({}, PureBattery.DEFAULTS, $this.data, typeof option == 'object' && option);

		if(!data) $this.data('pure.pureBattery', (data = new PureBattery(this, options)));
		if(typeof option == 'string'){
			var returnValue = data[option](_relatedTarget, _relatedValue);
			return returnValue == undefined ? $this : returnValue;
		}
	}
	
	var old = $.fn.pureBattery; 
	
	$.fn.pureBattery = Plugin;
	$.fn.pureBattery.Constructor = PureBattery;
	
	/**
	 * Pure Battery - no Conflict
	 */
	
	$.fn.pureBattery.noConflict = function(){
		$.fn.pureBattery = old;
		return this;
	}
	
}(jQuery);