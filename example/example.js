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
	
	//////////////////////////////////////////////////////////////
	
	$("#customWidthValue").on("change", function(){
		var width = $(this).val();
		example.changeWidth(width);
	})
	$("#customWidth").on("click", function(){
		var width = $("#customWidthValue").val();
		example.changeWidth(width);
	});
	$("#defaultWidth").on("click", function(){
		$("#customWidthValue").val(50).change();
	})
	
	$("#moveBtn").on("click", function(){
		if(example.info.isStart){
			$(this).button("loading", "Stoping...").button('loading')
				.data("resetText", "Start");
			
			clearInterval(example.info.procTest);
			clearInterval(example.info.procRandom);
		}else{
			$(this).button("loading", "Starting...").button('loading')
				.data("resetText", "Stop");
			example.startProcess();
		}
		
		$(this).button('reset');
		
		example.info.isStart = !example.info.isStart;
	});
	
	$("#customLevelValue").on("change", example.customTestOption);
	$("#customLevel").on("click", example.customTestOption);
	$("#customCharge").on("change", example.customTestOption);
	
	
	///////////////////////////////////////////////////////////
	$("#pureBattery-default").pureBattery();
	$("#pureBattery-custom_wh").pureBattery();
	$("#pureBattery-custom_o_wh").pureBattery({
		width: "100px",
		height: "30px"
	});
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
	
	$("#pureBattery-not_charging-random").pureBattery({test: true});
	$("#pureBattery-charging-random").pureBattery({test: true});
	$("#pureBattery-not_charging-minus").pureBattery({test: true});
	$("#pureBattery-charging-plus").pureBattery({test: true});
	
	$("#pureBattery-demo").pureBattery({test: true});
	
	example.init();
});

var example = {
		info: {
			isStart: true,
			procTest: null,
			procRandom: null,
		},
		
		init: function(){
			$("#pureBattery-not_charging-minus").data("battery_level", 100);
			$("#pureBattery-charging-plus").data("battery_level", 0);
			
			setTimeout(example.startProcess, 1000);				
		},
		
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
		
		randomLevel: function(){
			$("#pureBattery-not_charging-random").pureBattery("test", {"charging": false, "level": (Math.random() * 100) + 1});
			$("#pureBattery-charging-random").pureBattery("test", {"charging": true, "level": (Math.random() * 100) + 1});
		},
		
		testLevel: function(){
			var levelMinus = $("#pureBattery-not_charging-minus").data("battery_level");
			var levelPlus = $("#pureBattery-charging-plus").data("battery_level");
			
			$("#pureBattery-not_charging-minus").pureBattery("test", {"charging": false, "level": (levelMinus--)});
			$("#pureBattery-charging-plus").pureBattery("test", {"charging": true, "level": (levelPlus++)});
			
			if(levelMinus < 0){
				levelMinus = 100;
			}
			if(levelPlus > 100){
				levelPlus = 0;
			}
			
			$("#pureBattery-not_charging-minus").data("battery_level", levelMinus);
			$("#pureBattery-charging-plus").data("battery_level", levelPlus);				
		},			
		
		startProcess: function(){
			example.info.procTest = setInterval(example.testLevel, 150);
			
			example.randomLevel();
			example.info.procRandom = setInterval(example.randomLevel, 3000);				
		},
		
		changeWidth: function(width){
			$(".change-width").css({"width": width+"px"});
		},
		
		customTestOption: function(e){
			var charging = $("#customCharge").prop("checked");
			var level = $("#customLevelValue").val();
			
			console.log(charging, level);
			
			$("#pureBattery-demo").pureBattery('test', {"charging": charging, "level": level});
			
			$("#customCharge").parent().find("span").html(charging ? "Charging" : "Not Charging");
		}
}