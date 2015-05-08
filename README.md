# Pure Battery
HTML5 Battery API, JQuery + Bootstrap

## 시작하기

```javascript
$("#div").pureBattery(options);
```

## Options
PureBattery을 생성 할 시 전달할 수 있다.

옵션명|유형|기본값|설명
----|----|----|----
width|string|'50px'|가로 크기
height|string|'22px'|세로크기
fontColor|string|#ffffff|베터리 용량 클자 색상
borderColor|string|#333333|베터리  Border Line 색상
backgroundColor|string|#555555|배터리 용량의 백그라운드 색상
chargingIcon|string|glyphicon-flash|충전 중 일때의 아이콘(bootstrap Glyphicons 사용)
warningLevel|integer|50|배터리 경고 표시 범위 (bootstrap progress progress-bar-warning 사용)
dangerLevel|integer|30|배터리 위험 표시 범위 (bootstrap progress progress-bar-danger 사용)
progressStep|integer|5|배터리 용량에 다른 Progress 범위?
test|boolean|false|장비의 배터리 정보를 사용하지 않고 배터리 정보를 입력 가능하게 하는 개발자 모드 사용


#### test option

`test` option이 true인 경우 사용 가능한 option.

옵션명|유형|기본값|설명
----|----|----|----
charging|boolean|(이전의 배터리 정보에 따른다.)|배터리 충전 여부
level|integer|(이전의 배터리 정보에 따른다.)|배터리 용량


## Method

+ __.pureBattery(`'option'`)__

옵션 정보를 반환합니다.
```javascript
$("#div").pureBattery('option');
```

+ __.pureBattery(`'option'`, optionName)__

`optionName`에 해당하는 값을 반환합니다.
```javascript
$("#div").pureBattery('option', 'width');
```

+ __.pureBattery(`'option'`, optionName, value)__

`optionName`에 대한 값을 입력합니다.
```javascript
$("#div").pureBattery('option', 'width', '100%');
```

+ __.pureBattery(`'option'`, options)__

하나 또는 여러개의 option을  값을 입력합니다.
```javascript
$("#div").pureBattery('option', {width: '100%', height: '50%'});
```

+ __.pureBattery(`'test'`, testOptionName, value)__

배터리 정보를 변경한다. (`test` option이 true로 되어 있는 경우)
```javascript
$("#div").pureBattery('test', 'level', 50);
```

+ __.pureBattery(`'test'`, testOptions)__

배터리 정보를  변경한다. (`test` option이 true로 되어 있는 경우)
```javascript
$("#div").pureBattery('test', {charging: true, level: 50});
```


## Event
PureBattery는 배터리 용량 변화에 대한 이벤트를 제공합니다.

이벤트|설명
-----|-----
battery-stable|배터리가 안정적인 상태일 경우 (option `dangerLevel` > 일 경우)
battery-danger|배터리가 위험한 상태일 경우 (option `dangerLevel` <= 일 경우)

```javascript
$("#div").on('battery-stable', function(e){
	//do something...
})
```













