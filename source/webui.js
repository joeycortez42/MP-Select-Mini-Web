/*
Name: MP Select Mini Web Javascript
URL: https://github.com/nokemono42/MP-Select-Mini-Web
*/

$(document).ready(function() {
	printerStatus();
	initWebSocket();

	setTimeout(function() {
		startup();
	}, 2000);

	setInterval(function() {
		printerStatus();
	}, 2000);

	$(".movement .home").click(function() {
		axis = $(this).attr("data-axis");

		if (axis == 'all') {
			code = 'G28 X0 Y0 Z0';
			comment = 'all axes';
		} else {
			code = 'G28 ' + axis;
			comment = axis + ' axis';
		}

		sendCmd(code, 'Home ' + comment);
		setPositioning = false;
	});

	$(".movement .direction button").click(function() {
		command = 'G1 ';
		movement = $(this).attr("data-movement");
		rate = $(".movement .rate button.active").attr("data-rate");
		axis = $(this).attr("data-axis");
		comment = 'Move ' + axis;

		if (setPositioning == false) {
			sendCmd('G91', 'Set to Relative Positioning');
			setPositioning = true;
		}

		if (movement == 'up' || movement == 'left') { rate = rate * -1; }
		if (axis == 'Z' && movement == 'down') { comment = 'Raise Z '; }
		if (axis == 'Z' && movement == 'up') { comment = 'Lower Z '; }
		if (axis == 'E' && movement == 'plus') { comment = 'Extrude '; }
		if (axis == 'E' && movement == 'minus') {
			sendCmd(command + axis + '-' + rate, 'Retract ' + rate + 'mm');
			return;
		}
		if (movement == 'disable') {
			sendCmd('M18', 'Disable motor lock');
			return;
		}

		sendCmd(command + axis + rate, comment + ' ' + rate + 'mm');
	});

	$(".movement .rate button").click(function() {
		rate = $(this).attr("data-rate");
		$(".movement .rate button").removeClass('active');
		$(this).addClass('active');
	});

	$('#gCodeSend').click(function() {
		gCode2Send = $('#gcode').val();
		if (gCode2Send == '') { return; }

		sendCmd(gCode2Send, '');
		$('#gcode').val('');
	});

	$("#wre").change(function() {
		delaySendTemp($("#wre").val(), 'extruder');
	});

	$("#sete").click(function() {
		delaySendTemp($("#wre").val(), 'extruder');
	});

	$("#clre").click(function() {
		sendCmd('{C:T0000}', 'Turn off extruder preheat', 'cmd');
	});

	$("#wrp").change(function() {
		delaySendTemp($("#wrp").val(), 'platform');
	});

	$("#setp").click(function() {
		delaySendTemp($("#wrp").val(), 'platform');
	});

	$("#clrp").click(function() {
		sendCmd('{C:P000}', 'Turn off platform preheat', 'cmd');
	});

	$("#fanspeed").slider({
		min: 30, max: 100, value: 50,
		reversed : true, orientation: 'vertical',
		formatter: function(value) {
			return value + '%';
		}
	});

	$("#fanspeed").on('slide', function(slideEvt) {
		delaySendSpeed(slideEvt.value);
	});

	$("#clrfan").click(function() {
		sendCmd('M106 S0', 'Turn off fan');
	});

	$("form").submit(function() {
		return false;
	});
});

var timers = {};
var setPositioning = false;

function pad(num, size) {
	s = '000' + num;
	return s.substr(s.length-size);
}

function scrollConsole() {
	$cont = $("#console");
	$cont[0].scrollTop = $cont[0].scrollHeight;
}

function feedback(output) {
	if (output.substring(0, 2) == 'T:') {
		//Hide temperature reporting
		return;
	}

	if (output.substring(0, 5) == 'ok N0') {
		output = 'ok';
	}

	$("#gCodeLog").append('<p class="text-warning">' + output + '</p>');

	//if (output.substring(0, 5) == 'Begin') {
		//$(".sd-files").html('<p>' + output + '</p>');
	//}
	scrollConsole();
}

function sendCmd(code, comment, type) {
	if (type === undefined) { type = "code"; }
	
	$("#gCodeLog").append('<p class="text-primary">' + code + ' <span class="text-muted">; ' + comment + '</span></p>');

	$.ajax({ url: 'set?' + type + '=' + code, cache: false }).done();
	//ws.send(code);

	scrollConsole();
}

function initWebSocket() {
	url = window.location.hostname;

	try {
		ws = new WebSocket('ws://' + url + ':81');
		ws.onopen = function() {
			feedback('Connection Established');
		};
		ws.onmessage = function(a) {
			feedback(a.data);
		};
		ws.onclose = function() {
			feedback('Disconnected');
		}
	} catch (a) {
		feedback('Web Socket Error');
	}
}

function msToTime(duration) {
	var milliseconds = parseInt((duration%1000)/100),
		seconds = parseInt((duration/1000)%60),
		minutes = parseInt((duration/(1000*60))%60),
		hours = parseInt((duration/(1000*60*60))%24);

	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;

	return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

String.prototype.contains = function(it) {
	return this.indexOf(it) != -1;
};

Dropzone.options.mydz = {
	accept: function(file, done) {
		if (file.name.contains('.g')) {
			//window.startTimer = new Date();

			done();
			$(".print-actions button").addClass('btn-disable');
			$(".movement button").addClass('btn-disable');
			$("#gCodeSend").addClass('btn-disable');
			$(".temperature button").addClass('btn-disable');
		} else {
			done('Not a valid G-code file.');
		}
	}, init: function() {
		this.on('error', function(file, response) {
			var errorMessage = response.errorMessage;
			$(file.previewElement).find('.dz-error-message').text(errorMessage);
		});

		this.on('addedfile', function() {
			if (this.files[1] != null) {
				this.removeFile(this.files[0]);
			}
		});

		this.on('complete', function(file) {
			//File upload duration
			//endTimer = new Date();
			//duration = endTimer - window.startTimer;
			//alert(msToTime(duration));

			$(".print-actions button").removeClass('btn-disable');
			$(".movement button").removeClass('btn-disable');
			$("#gCodeSend").removeClass('btn-disable');
			$(".temperature button").removeClass('btn-disable');

			//setTimeout(function() {
				//sendCmd('M566 ' + file.name, '');
			//}, 1000);
		});
	}
};

function start_p() {
	$("#stat").text('Printing');
	sendCmd('M565', 'Start printing cache.gc');
}

function cancel_p() {
	$("#stat").text('Canceling');
	sendCmd('{P:X}', 'Cancel print', 'cmd');
}

function printerStatus() {
	$.get("inquiry", function(data, status) {
		//console.log(data);
		//$("#gCodeLog").append('<p class="text-muted">' + data + '</p>');
		//scrollConsole();

		$("#rde").text(data.match( /\d+/g )[0]);
		$("#rdp").text(data.match( /\d+/g )[2]);

		delaySyncTemperatures(data.match( /\d+/g )[1], data.match( /\d+/g )[3]);

		var c = data.charAt(data.length - 1);

		if (c == 'I') {
			$("#stat").text('Idle');
			$("#pgs").css('width', '0%');
			$("#start_print").removeClass('btn-disable');
			$(".movement button").removeClass('btn-disable');
			$("#gCodeSend").removeClass('btn-disable');
		} else if (c == 'P') {
			$("#stat").text('Printing');
			$("#pgs").css('width', data.match(/\d+/g )[4] + '%');
			$("#pgs").html(data.match(/\d+/g )[4] + '% Complete');
			$("#start_print").addClass('btn-disable');
			$(".movement button").addClass('btn-disable');
			$("#gCodeSend").addClass('btn-disable');
		} else {
			$("#stat").text('N/A');
		}
	});
}

function startup() {
	if ($("#stat").text() != 'Printing') {
		sendCmd('M563 S6', 'Enable faster Wi-Fi file uploads');
	}
}

function delaySendTemp(value, device) {
	clearTimeout(timers);
	timers = setTimeout(function() {
		compValue = pad(value, 3);

		if (device == 'extruder') {
			sendCmd('{C:T0' + compValue + '}', 'Set extruder preheat to ' + value + '°C', 'cmd');
		}

		if (device == 'platform') {
			sendCmd('{C:P' + compValue + '}', 'Set platform preheat to ' + value + '°C', 'cmd');
		}
	}, 250);
}

function delaySendSpeed(value) {
	clearTimeout(timers);
	timers = setTimeout(function() {
		actualSpeed = Math.floor(255 * (value/100));
		sendCmd('M106 S' + actualSpeed, 'Set fan speed to ' + value + '%');
	}, 250);
}

function delaySyncTemperatures(extruder, platform) {
	clearTimeout( timers );
	timers = setTimeout(function() {
		if (!$('#wre').is(":focus")) { $("#wre").val(extruder); }
		if (!$('#wrp').is(":focus")) { $("#wrp").val(platform); }
	}, 3000);
}

function refreshSD() {
	sendCmd('M21', 'Initialize SD card');
	sendCmd('M20', 'List SD card files');
}