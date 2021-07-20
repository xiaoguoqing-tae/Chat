function dateTime(time) {
	var nowdate = new Date().getTime(),
		getdate = new Date(time).getTime(),
		data = new Date(time),
		data1 = new Date(),
		Y = data1.getFullYear(),
		M = data1.getMonth()+1,
		D = data1.getDate(),
		H = data1.getHours(),
		Mi = data1.getMinutes(),
		S = data1.getSeconds();
		if(String(M).length<2){
			M="0"+M
		}
		if(String(D).length<2){
			D = "0"+D
		}
		let a = Y+'-'+M+'-'+D+" "+'00'+':'+'00'+':'+'00'
		let b = Y+'-'+M+'-'+(Number(D)+1)+" "+'00'+':'+'00'+':'+'00'
		let c = Y+'-'+M+'-'+(Number(D)-1)+" "+'00'+':'+'00'+':'+'00'
		let newTime1 = targetTime(a)
		let newTime2 = targetTime(b)
		let newTime3 = targetTime(c)
	if (newTime1< getdate && getdate<newTime2 ) {
		return gethms(time)
	} else if (getdate<newTime1&&getdate>newTime3) {
		return '昨天' + gethms(time)
	} else if (nowdate - getdate < 24 * 60 * 60 * 1000 * 7) {
		var week;
		if (data.getDay() == 0) week = "星期日" + gethms(time)
		if (data.getDay() == 1) week = "星期一" + gethms(time)
		if (data.getDay() == 2) week = "星期二" + gethms(time)
		if (data.getDay() == 3) week = "星期三" + gethms(time)
		if (data.getDay() == 4) week = "星期四" + gethms(time)
		if (data.getDay() == 5) week = "星期五" + gethms(time)
		if (data.getDay() == 6) week = "星期六" + gethms(time)
		return week;
	} else {
		return formatDateTime(time)
	}
	//将时间戳转换为时间
	function formatDateTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
	}
	//取出几小时几分钟几秒
	function gethms(inputTime) {
		var date = new Date(inputTime);
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		return h + ':' + minute
	}
	//指定时间转时间戳
	function targetTime(t){
		var d = t.split(" ")[0],
			h = t.split(" ")[1],
			date = new Date()
		date.setYear(d.split("-")[0])
		date.setMonth(d.split("-")[1]-1)
		date.setDate(d.split("-")[2])
		date.setHours(h.split(":")[0])
		date.setMinutes(h.split(":")[1])
		date.setSeconds(h.split(":")[2])
		
		return date.getTime()
	}
}

function paixu(key,desc) {
	return function(a, b) {
		let value1 = a[key];
		let value2 = b[key];
		if (desc == true) {
			// 升序排列
			return value1 - value2;
		} else {
			// 降序排列
			return value2 - value1;
		}
	};
}
function fileName(e){
	let old = new Date();
	let Y = old.getFullYear();
	let M = old.getMonth()+1;
	let D = old.getDate();
	if(M<10){
		M = '0'+M
	}
	if(D<10){
		D = '0'+D
	}
	return Y+M+D
}
	//将时间戳转换为时间
	function formatDateTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	}


function formatMsgTime (time) {	var nowdate = new Date().getTime(),
		getdate = new Date(time).getTime(),
		data = new Date(time)
	var num = nowdate - getdate
	if (num < 60 * 1000) {
		return "刚刚"
	} else if (60 * 1000< num && num < 60*60*1000) {
		return Math.round((nowdate - getdate)/(1000*60))+"分钟前"
	} else if(60 * 60 * 1000< num && num < 24 * 60 * 60 * 1000){
		return Math.round((nowdate - getdate)/(1000*60 *60))+"小时前"
	} else if(60 * 60 * 1000 * 24< num && num < 60 * 60 * 1000 * 24 * 15){
		return Math.round((nowdate - getdate)/(1000*60 *60*24))+"天前"
	} else {
		return formatDateTime(time)
	}
	//将时间戳转换为时间
	function formatDateTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
	}
	//取出几小时几分钟几秒
	function gethms(inputTime) {
		var date = new Date(inputTime);
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		minute = minute < 10 ? ('0' + minute) : minute;
		return h + ':' + minute
	}  };
function spaceTime(old,now){
	var oldT = new Date(old).getTime()
	var nowT = new Date(now).getTime()
	if(oldT>(nowT+(5*60*1000))||nowT>(oldT+(5*60*1000))){
		return new Date(now)
	}else{
		return ""
	}
}

export {
	dateTime,fileName,formatDateTime,formatMsgTime,spaceTime
}
