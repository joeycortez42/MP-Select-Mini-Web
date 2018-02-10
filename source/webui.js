/*
Name: MP Select Mini Web Javascript
URL: https://github.com/nokemono42/MP-Select-Mini-Web
*/

$(document).ready( function() {
	sendCmd('M563 S5', 'Enable faster Wi-Fi file uploads');
	// Set to Relative Positioning
	$.ajax({ url: "set?code=G91", cache: false }).done();

	/* */
	setInterval( function() {
		$.get("inquiry", function(data, status) {
			console.log(data);

			//$("#gCodeLog").append('<p class="text-muted">' + data + '</p>');
			//scrollConsole();

			$("#rde").text(data.match( /\d+/g )[0]);
			$("#rdp").text(data.match( /\d+/g )[2]);

			delaySyncTemperatures(data.match( /\d+/g )[1], data.match( /\d+/g )[3]);

			var c = data.charAt(data.length - 1);

			if (c == 'I') {
				$("#stat").text('Idle');
				$("#pgs").css('width', '0%');
				$(".movement button").removeClass('btn-disable');
				$("#gCodeSend").removeClass('btn-disable');
			} else if (c == 'P') {
				$("#stat").text('Printing');
				$("#pgs").css('width', data.match(/\d+/g )[4] + '%');
				$("#pgs").html(data.match(/\d+/g )[4] + '% Complete');
				$(".movement button").addClass('btn-disable');
				$("#gCodeSend").addClass('btn-disable');
			} else {
				$("#stat").text('N/A');
			}
		});
	}, 3500);
	/* */

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
	});

	$(".movement .direction button").click(function() {
		command = 'G1 ';
		movement = $(this).attr("data-movement");
		rate = $(".movement .rate button.active").attr("data-rate");
		axis = $(this).attr("data-axis");
		comment = 'Move ' + axis;

		if (movement == 'up' || movement == 'left') { rate = rate * -1; }
		if (axis == 'Z' && movement == 'down') { comment = 'Raise Z '; }
		if (axis == 'Z' && movement == 'up') { comment = 'Lower Z '; }
		if (axis == 'E' && movement == 'plus') { comment = 'Extrude '; }
		if (axis == 'E' && movement == 'minus') {
			sendCmd(command + axis + '-' + rate, 'Retract ' + rate + 'mm');
			return false;
		}
		if (movement == 'disable') {
			sendCmd('M18', 'Disable motor lock');
			return false;
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
		var value = pad($("#wre").val(), 3);
		sendCmd( '{C:T0' + value + '}', 'Set extruder preheat to ' + $("#wre").val() + '°C', 'cmd' );
	});

	$("#sete").click(function() {
		var value = pad($("#wre").val(), 3);
		sendCmd('{C:T0' + value + '}', 'Set extruder preheat to ' + $("#wre").val() + '°C', 'cmd');
	});

	$("#clre").click(function() {
		sendCmd('{C:T0000}', 'Turn off extruder preheat', 'cmd');
	});

	$("#wrp").change(function() {
		value = pad($("#wrp").val(), 3);
		sendCmd('{C:P' + value + '}', 'Set platform preheat to ' + $("#wrp").val() + '°C', 'cmd');
	});

	$("#setp").click(function() {
		value = pad($("#wrp").val(), 3);
		sendCmd('{C:P' + value + '}', 'Set platform preheat to ' + $("#wrp").val() + '°C', 'cmd');
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

	$("#fanspeed").on('slide', function(slideEvt)  {
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

function pad(num, size) {
	s = '000' + num;
	return s.substr(s.length-size);
}

function scrollConsole() {
	$cont = $("#console");
	$cont[0].scrollTop = $cont[0].scrollHeight;
}

function sendCmd(cmd, comment, type) {
	if (type === undefined) { type = "code"; }
	clearTimeout(timers);
	timers = setTimeout(function() {
		$("#gCodeLog").append('<p class="text-primary">' + cmd + ' <span class="text-muted">; ' + comment +'</span></p>');

		$.ajax({ url: 'set?' + type + '=' + cmd, cache: false }).done(function(data) {
			$("#gCodeLog").append('<p class="text-warning">' + data + '</p>');
			scrollConsole();
		});

		scrollConsole();
	}, 300);
}

function feedback(output) {
	$("#gCodeLog").append('<p class="text-warning">' + output + '</p>');
	scrollConsole();
}

String.prototype.contains = function( it ) {
	return this.indexOf( it ) != -1;
};

Dropzone.options.mydz = { dictDefaultMessage: "Upload G-code Here",
	accept: function(file, done) {
		if (file.name.contains('.g')) {
			done();
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

function delaySendSpeed(value) {
	clearTimeout(timers);
	timers = setTimeout(function() {
		actualSpeed = Math.floor(255 * (value/100));
		sendCmd('M106 S' + actualSpeed, 'Set fan speed to ' + value + '%');
		$.ajax({ url: "set?code=M106 S" + value, cache: false }).done(
			function(data) { feedback(data); }
		);
	}, 300);
}

function delaySyncTemperatures(extruder, platform) {
	clearTimeout( timers );
	timers = setTimeout(function() {
		if (!$('wre').is(":focus")) { $("#wre").val(extruder); }
		if (!$('wrp').is(":focus")) { $("#wrp").val(platform); }
	}, 3000);
}