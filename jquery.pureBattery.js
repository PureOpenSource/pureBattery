/*********************************************************************************************
 * PureBattery with canvas(html5) v0.1
 * ===========================================================================================
 * Copyright 2015 Pure OpenSource.
 * Licensed under MIT (https://github.com/PureOpenSource/pureBattery/blob/master/LICENSE)
 *********************************************************************************************/

+function($){
	'use strict';
	
	
	var PureBattery = function(element, options){
		this.$element = $(element);
		this.options = options;
		
		this.canvasInfo = {};
		
		this._makeBattery();
		this._addBatteryEvent();
	}
	
	PureBattery.DEFAULTS = {
		width: '50px',
		height: '22px',
	}
	
	
	// private functions.
	$.extend(PureBattery.prototype, {
		_makeBattery: function(){
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
			
			var $canvas = $("<canvas></canvas>")
				.css({'width': options.width, 'height': options.height});
			
			$canvas.get(0).width = parseInt(options.width);
			$canvas.get(0).height = parseInt(options.height);
			$element.append($canvas);
			
			this.canvasInfo = {
				$canvas: $canvas,
				canvas: $canvas.get(0),
				context: $canvas.get(0).getContext('2d')
			}
			
			this._changeCanvasDraw();
		},
		
		_changeCanvasDraw: function(){
			var $canvas = this.canvasInfo.$canvas;
			var ctx = this.canvasInfo.context;
			
			var cornerRadius = 20;
			
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(5, 5);
			ctx.lineTo($canvas.width() - 5 - cornerRadius, 5);
			
			ctx.arcTo($canvas.width() - 5, 5);
			
			ctx.lineTo($canvas.width() - 5, $canvas.height() - 5);
			ctx.lineTo(5, $canvas.height() - 5);
			ctx.lineTo(5, 5);
			
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'blue';
			ctx.stroke();
		},
		
		_addBatteryEvent: function(){
			var THIS = this;
			var options = this.options;
			
			navigator.getBattery().then(function(battery) {
				// initial value.
				THIS.orginalBatteryInfo = battery;
				
				// initial battery status.
				THIS._updateBatteryStatus(battery);
				
				var eventFunction = function(){
					if(options.test) return;
		  			THIS._updateBatteryStatus(battery);
				}
				
		  		battery.addEventListener('chargingchange', eventFunction, false);
		  		battery.addEventListener('levelchange', eventFunction, false);
		  	});				
		},
		
		_updateBatteryStatus: function(battery){
			
		},
	});
	
	
	function Plugin(option){
		var $this = $(this);
		
		if(!navigator.getBattery){
			console.warn('navigator.gerBattery API\'s not supported browser.');
			return $this;
		}
		
		var data = $this.data('pure.pureBattery');
		var options = $.extend({}, PureBattery.DEFAULTS, $this.data, typeof option == 'object' && option);
		
		if(!data) $this.data('pure.pureBattery', (data = new PureBattery(this, options)));
		
		return $this;
	}
	
	$.fn.pureBattery = Plugin;
	$.fn.pureBattery.Constructor = PureBattery;
	
}(jQuery)