$(document).ready(function(){
	$("#custom-options-form").find("input").on("input", function(){
		example.customOption($(this));
	});
	
	$("#custom-options-form").find("button.btn-info").on("click", function(e){
		example.customOption($(this).closest(".input-group").find("input"));
	});
	
	$("#custom-options-form").find("button.btn-default").on("click", function(e){
		example.customOption($(this).closest(".input-group").find("input"), true);
	});
	$("#customOption_test_Value").on("change", function(){
		var test = $(this).prop("checked");
		$("#pureBattary-custom_options").pureBattery('option', 'test', test);
		
		if(test){
			example.customOptionTest();
		}
	});
	$("#customOption_level_Value").on("input", function(){
		example.customOptionTest();
	});
	$("#customOption_charging_Value").on("change", function(){
		example.customOptionTest();
	});
	
	///////////////////////////////////////////////////////////
	$("#pureBattary-custom_options").pureBattery();
	$("#pureBattary-custom_options").on("battery-danger", function(e){
		var battery = e.battery;
		
		var html = '<strong>Warning!</strong> Battery Level: ' + battery.level;
		
		$("#customOptionDanger").removeClass(function (index, css){
			return (css.match (/(^|\s)alert-\S+/g) || []).join(' ');
		});
		
		$("#customOptionDanger").addClass('alert-warning').html(html);
	});
	$("#pureBattary-custom_options").on("battery-stable", function(e){
		var battery = e.battery;
		
		var html = '<strong>Stable!</strong> Battery Level: ' + battery.level;
		
		$("#customOptionDanger").removeClass(function (index, css){
			return (css.match (/(^|\s)alert-\S+/g) || []).join(' ');
		});
		
		$("#customOptionDanger").addClass('alert-success').html(html);
	});
	
	example.init();
});

var example = {
		customOption: function(inputElement, isDefalut){
			var optionName = inputElement.data("option");
			var optionValue = inputElement.val();
			
			if(isDefalut){
				optionValue = inputElement.data("default");
				inputElement.val(optionValue);
			}
			
			if(inputElement.prop("type") == 'range' || inputElement.prop("type") == 'color'){
				inputElement.next().html(optionValue);
			}
			
			$("#pureBattary-custom_options").pureBattery('option', optionName, optionValue);
		},
		
		customOptionTest: function(){
			var charging = $("#customOption_charging_Value").prop("checked");
			var level = $("#customOption_level_Value").val();
			
			var $levelPrint = $("#customOption_level_Value").next();
			$levelPrint.html(level);
			
			$("#pureBattary-custom_options").pureBattery('test', {charging: charging, level: level});
		},
}