// I probably shouldn't include the API key but... how can you hide it in JS? Good question for future Joe.
var key = 'API_KEY';
var apiURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
var coordURL = 'http://api.openweathermap.org/data/2.5/weather?lat=';
var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=';
var forecastZipURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?zip=';


var epochToFahr = function(temp) {
  return Math.round(temp * (9/5) - 459.67).toString() + '°F';
};


var fahrToCels = function(temp) {
  return Math.round((temp - 32) / (9/5)).toString() + '°C';
};


var celsToFahr = function(temp) {
  return Math.round(temp * 1.8 + 32).toString() + '°F';
};


var getDayName = function(dateString) {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(dateString * 1000).getDay()];
};


var forecastByCoord = function() {
  jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCCcVTUUpVn0JYuv2abz2G-pNG1uMFPccw", function(data) {
    var coords = data.location;
    var request = forecastURL + coords.lat + '&lon=' + coords.lng + '&cnt=6' + '&APPID=' + key;
    $.getJSON(request, forecastCallback);
  });
};


var forecastByZip = function() {
  var zip = $("#zip-value").val();
  var request = forecastZipURL + zip + ',us' + '&APPID=' + key;
  $.getJSON(request, forecastCallback);
};


var forecastCallback = function(data) {
  var html = ''
  $('#forecast-bar').empty();
  for ( i=0; i < 6; i++ ) {
    var iconHTML = "<i class='wi wi-owm-day-" + data.list[i].weather[0].id + "'></i>";
    var span1HTML = "<span class='temp'>" + epochToFahr(data.list[i].temp.min) + "</span>";
    var span2HTML = "<span class='temp'>" + epochToFahr(data.list[i].temp.max) + "</span>";
    var dayHTML = "<div>" + getDayName(data.list[i].dt) + "</div>";
    html += "<div class='weekday-box col'>" + iconHTML +
      "<div>" + span1HTML + ' - ' + span2HTML + "</div>" + dayHTML + "</div>";
    
    $('#forecast-bar').html(html);
  }
};


var weatherByCoord = function() {
  jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCCcVTUUpVn0JYuv2abz2G-pNG1uMFPccw", function(data) {
    var coords = data.location;
    var request = coordURL + coords.lat + '&lon=' + coords.lng + '&APPID=' + key;
    $.getJSON(request, weatherCallback);
  });
};


var weatherByZip = function() {
  var zip = $("#zip-value").val();
  var request = apiURL + zip + ',us' + '&APPID=' + key;
  $.getJSON(request, weatherCallback);
};


var weatherCallback = function(data) {
  temp = data.main.temp;
  $("#current-icon > i").attr("class", "wi wi-owm-day-" + data.weather[0].id);
  $('#current-temp').text(epochToFahr(temp));
  $('#current-location').text(data.name);
};

var updateTemps = function(celsius) {
  $(".temp").each(function(i, obj) {
    var temp = parseInt($(this).text().slice(0, -2));
    if (celsius)
      $(this).text(celsToFahr(temp));
    else
      $(this).text(fahrToCels(temp));
  });
};


// Fahrenheit to Celsius toggle event
$(".temp").click(function() {
  if($("#current-temp").text().substr(-2) === '°F')
    updateTemps(false);
  else
    updateTemps(true);
});


// Update weather by zip event
$("#zip-value").change(function() {
  if( $(this).val().length === 5 )
    weatherByZip();
    forecastByZip();
});

// Background chooser
$(".bg-item").click(function() {
  $("body").css("background-image", $(this).css("background-image"))
});


$( document ).ready(function(){
  weatherByCoord();
  forecastByCoord();
});
