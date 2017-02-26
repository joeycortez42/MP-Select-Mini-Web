/*
Name: MP Select Mini Web Javascript
URL: https://github.com/nokemono42/MP-Select-Mini-Web
Version: Alpha 0.54;
*/

$(document).ready( function() {
  sendCmd( 'M563 S6', 'Enable faster WiFi File Transfer' );
  $.ajax({ url: 'set?code=M563 S6', cache: false }).done( function(data) { feedback( data ); } );

  setInterval( function() {
    $.get("inquiry", function(data, status) {
      console.log( data );

      //$("#gCodeLog").append( '<p class="text-muted">' + data + '</p>'  );
      //scrollConsole();

      $("#rde").text( data.match( /\d+/g )[0] );
      $("#rdp").text( data.match( /\d+/g )[2] );

      delaySyncTemperatures( data.match( /\d+/g )[1], data.match( /\d+/g )[3] );

      var c = data.charAt( data.length - 1 );

      if ( c == 'I' ) {
        $("#stat").text( 'Idle' );
        $("#pgs").css( 'width', '0%' );
        $("#gCodeSend").removeClass( 'btn-disable' );
      } else if ( c == 'P' ) {
        $("#stat").text( 'Printing' );
        $("#pgs").css( 'width', data.match( /\d+/g )[4] + '%' );
        $("#pgs").html( data.match( /\d+/g )[4] + '% Complete' );
        $("#gCodeSend").addClass( 'btn-disable' );
      } else $("#stat").text( 'N/A' );
    } );
  }, 4000);

  $('#gCodeSend').click( function() {
    gCode2Send = $('#gcode').val();
    if ( gCode2Send == '' ) { return; }

    sendCmd( gCode2Send, '' );
    $.ajax({ url: "set?code=" + gCode2Send, cache: false }).done( function(data) { feedback( data ); } );
    $('#gcode').val( '' );
  } );

  $("#wre").change( function() {
    var value = pad( $("#wre").val(), 3 );
    sendCmd( 'T0' + value, 'Set Extruder Preheat to ' + $("#wre").val() + '°C' );
    $.ajax({ url: 'set?cmd={C:T0' + value + '}', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("#sete").click( function() {
    var value = pad( $("#wre").val(), 3 );
    sendCmd( 'T0' + value, 'Set Extruder Preheat to ' + $("#wre").val() + '°C' );
    $.ajax({ url: 'set?cmd={C:T0' + value + '}', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("#clre").click( function() {
    sendCmd( 'T0000', 'Turn off Extruder Preheat' );
    $.ajax({ url: 'set?cmd={C:T0000}', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("#wrp").change( function() {
    value = pad( $("#wrp").val(), 3 );
    sendCmd( 'P' + value, 'Set Platform Preheat to ' + $("#wrp").val() + '°C' );
    $.ajax({ url: 'set?cmd={C:P' + value + '}', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("#setp").click( function() {
    value = pad( $("#wrp").val(), 3 );
    sendCmd( 'P' + value, 'Set Platform Preheat to ' + $("#wrp").val() + '°C' );
    $.ajax({ url: 'set?cmd={C:P' + value + '}', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("#clrp").click( function() {
    sendCmd( 'P000', 'Turn off Platform Preheat' );
    $.ajax({ url: 'set?cmd={C:P000}', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("#fanspeed").slider({
    min: 0, max: 100, value: 50,
    reversed : true, orientation: 'vertical',
    formatter: function(value) {
      return value + '%';
    }
  } );

  $("#fanspeed").on( 'slide', function( slideEvt )  {
    delaySendSpeed( slideEvt.value );
  } );

  $("#clrfan").click( function() {
    sendCmd( 'M106 S0', 'Turn off Fan' );
    $.ajax({ url: 'set?code=M106 S0', cache: false }).done( function(data) { feedback( data ); } );
  } );

  $("form").submit( function() {
    return false;
  } );
} );

function pad( num, size ) {
  s = '000' + num;
  return s.substr( s.length-size );
}

function scrollConsole() {
  $cont = $("#console");
  $cont[0].scrollTop = $cont[0].scrollHeight;
}

function sendCmd( cmd, comment ) {
  $("#gCodeLog").append( '<p class="text-primary">' + cmd + ' <span class="text-muted">; ' + comment +'</span></p>'  );
  scrollConsole();
}

function feedback( output ) {
  $("#gCodeLog").append( '<p class="text-warning">' + output + '</p>'  );
  scrollConsole();
}

String.prototype.contains = function( it ) {
  return this.indexOf( it ) != -1;
};

Dropzone.options.mydz = { dictDefaultMessage: "Upload GCode here",accept: function( file, done ) {
  if ( file.name.contains( '.g' ) ) done();
  else done( 'Not a valid GCode file.' );
  }, init: function() {
    this.on( 'error', function( file, response ) {
      var errorMessage = response.errorMessage;
      $( file.previewElement ).find( '.dz-error-message' ).text( errorMessage );
    } );

    this.on( 'addedfile', function() {
      if ( this.files[1] != null ) {
        this.removeFile( this.files[0] );
      }
    } );
  }
};

function start_p() {
  $("#stat").text( 'Printing' );
  sendCmd( 'M565', 'Start printing cache.gc' );
  $.ajax({ url: 'set?code=M565', cache: false }).done( function(data) { feedback( data ); } );
}

function cancel_p() {
  $("#stat").text( 'Canceling' );
  sendCmd( '{P:X}', 'Cancel print' );
  $.ajax({ url: 'set?cmd={P:X}', cache: false }).done( function(data) { feedback( data ); } );
}

var timers = {}
function delaySendSpeed( value ) {
  clearTimeout( timers );
  timers = setTimeout( function() {
    actualSpeed = Math.floor( 255 * (value/100) );
    sendCmd( 'M106 S' + actualSpeed, 'Set Fan speed to ' + value + '%' );
    $.ajax({ url: "set?code=M106 S" + value, cache: false }).done( function(data) { feedback( data ); } );
  }, 300 );
}

function delaySyncTemperatures( extruder, platform ) {
  clearTimeout( timers );
  timers = setTimeout( function() {
    $("#wre").val( extruder );
    $("#wrp").val( platform );
  }, 3000 );
}

/*

$('.homeIt').click(function() {
var doWhat = $(this).data('id');
var whatAxis = $(this).data('axis');
$.ajax({
url: "set?code=G28 " + doWhat,
cache: false
}).done(function(html) {
$('#gCodeLog').append("<br>G28 " +doWhat);
gCodeLog.scrollTop = gCodeLog.scrollHeight;
if (whatAxis == 'XYZ') {
$('#posX, #posY, #posZ').val('0');
$('#posX, #posY, #posZ').removeClass('unkPos');
$axisX = '0';
$axisY = '0';
$axisZ = '0';
} else if (whatAxis == 'XY') {
$('#posX, #posY').val('0');
$('#posX, #posY').removeClass('unkPos');
$axisX = '0';
$axisY = '0';
} else {
$('#pos' + whatAxis).val('0');
$('#pos' + whatAxis).removeClass('unkPos');
switch(whatAxis) {
case 'X':
$axisX = '0';
break;
case 'Y':
$axisY = '0';
break;
case 'Z':
$axisZ = '0';
break;
}
}
});
});

$axisX = '0';
$axisY = '0';
$axisZ = '0';

function atMax(){
$('#movement').html('<span style="color: #ff0000;">MAX Movement!</span>');
setTimeout(function(){
$('#movement').html('Movement');
}, 500);
}

$('.moveIt').click(function() {
if($tooQuick == true){
$('#movement').html('<span style="color: #ff0000;">SLOW DOWN!</span>');
setTimeout(function(){
$('#movement').html('Movement');
}, 100);
return;
}
var doSpeed = $(this).data('speed');
var doWhat = $(this).data('id');
var doWhere = $(this).data('axis');
var axisVal = $('#pos' + doWhere).val()
axisVal = +doWhat + +axisVal;

switch(doWhere) {
case 'X':
$axisX = +$axisX + +doWhat;
if($axisX >= '125'){
atMax();
$axisX = +$axisX - +doWhat;
return;
}
break;
case 'Y':
$axisY = +$axisY + +doWhat;
if($axisY >= '125'){
atMax();
$axisY = +$axisY - +doWhat;
return;
}
break;
case 'Z':
$axisZ = +$axisZ + +doWhat;
if($axisZ >= '125'){
atMax();
$axisZ = +$axisZ - +doWhat;
return;
}
break;
default:
}

$tooQuick = true;
$.ajax({
url: "set?code=G91",
cache: false
}).done(function(html) {});
$.ajax({
url: "set?code=G1 " + doSpeed + ' ' + doWhere + doWhat,
cache: false
}).done(function(html) {
$('#pos' + doWhere).val(axisVal);
$tooQuick = false;
$('#gCodeLog').append("<br>G90, G1 " + doSpeed + ' ' + doWhere + doWhat);
gCodeLog.scrollTop = gCodeLog.scrollHeight;
});
});

});*/
