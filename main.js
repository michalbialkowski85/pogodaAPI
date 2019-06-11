$(document).ready(function() {
	//load the functions once the page open
	$(".cityarea").html(getLocation);
	testMenu();

});

var currentLat;
var currentLong;
var currentCity;
var currentRegion;
var currentCountry;

var mainCities = {
	'Warszawa': {
		'region': 'Mazowieckie',
		'country_flag': "https://assets.ipstack.com/images/assets/flags_svg/us.svg",
		'country': "Poland",
		'lat': 52.2297700,
		'lon': 21.0117800
	},
	'Gdańsk': {
		'region': 'Pomorskie',
		'country': "Poland",
		'lat': 54.3520500,
		'lon': 18.6463700
	},
	'Kielce': {
		'region': 'Świętokrzyskie',
		'country': "Polska",
		'lat': 50.8703300,
		'lon': 20.6275200
	},
	'Kraków': {
		'region': 'Małopolskie',
		'country': "Poland",
		'lat': 50.0614300,
		'lon': 19.9365800
	},
	'Białystok': {
		'region': 'Podlaskie',
		'country': "Polska",
		'lat': 53.1333300,
		'lon': 23.1643300
	}
};

//add the cities from var mainCities to the blue dropdown button
function testMenu() {
	for (var place in mainCities) {
		var city = place.replace(/_/g, ' ');
		$('#testMenu').append("<li onclick=testWeather('" + place + "');><a href='#'>" + city + "</a></li>");
	}
};

//every click from the cities in the dropdown button call this function. cityLocation get the city from var mainCities
function testWeather(cityLocation) {

	currentLat = mainCities[cityLocation].lat;
	currentLong = mainCities[cityLocation].lon;
	currentRegion = mainCities[cityLocation].region;
	currentCity =cityLocation.replace(/_/g, ' ');
	currentCountry = mainCities[cityLocation].country;

	//call the function getWeather and apply the data above to this function
	getWeather();

};

//find the current location anywhere by the computer's ip address
//use https://ipapi.co/ instead of http://ip-api.com/json
function getLocation() {
	$.getJSON('https://ipapi.co/json', function(data) {

		currentRegion = data.region;
		//currentCity = data.city;
		currentCountry = data.country;
		currentLat = data.latitude;
		currentLong = data.longitude;

		//call the function getWeather and apply the data above to this function
		getWeather();

	});
};

//very important function. It collect latitude and longitude of the current location or main city and use it to get the local weather from api Open Weather app. It also have other stuff such as converting between F and C, background images which depends on the weather icons, etc. 
function getWeather() {

	$("#state").text(currentRegion);
	$("#country").text(currentCountry);

	//use https://fcc-weather-api.glitch.me/api/current? instead of http://api.openweathermap.org/data/2.5/weather?
	$.getJSON('https://fcc-weather-api.glitch.me/api/current?lat=' + currentLat + '&lon=' + currentLong /*+ '&units=imperial&APPID=b850cc37800e907335d7a15d45ccbcd7'*/, function(json) {

		$("#cityname").text(json.name);

		var showfahrenheit = true;
		var temcelcius = Math.round(json.main.temp);
		var tempfahrenheit = Math.round((temcelcius * 9/5) + 32);


		$("#temp").html(tempfahrenheit);

		$('#unit-switch').off('click');

		$('#unit-switch').on('click', function() {
			if (showfahrenheit === false) {
				$("#temp").html(tempfahrenheit);
				showfahrenheit = true;
			} else {
				$("#temp").html(temcelcius); 
				showfahrenheit = false;
			}

			$("#unit-toggle").toggleClass("toggle");

		});

		var prefix = "wi wi-owm-";
		var weatherIcons = json.weather[0].id;
		var icon = prefix + weatherIcons;

		$("#wparameter").html("<i class='" + icon + "'></i>");   $("#wdescription").text(json.weather[0].description);

		var weatherImages = {
			'rain': 'https://66.media.tumblr.com/70d26c63d257670f3d9d92a2b40097e0/tumblr_ouc6umkIBL1vcsrlfo1_500.gif', 
			'clear': 'img/country-platform-preview.png',
			'snow': 'https://66.media.tumblr.com/5cbb88be92bcc7dd43ae955ac4d1316a/tumblr_o715uqyHsX1rnoh88o1_1280.gif',
			'clouds': 'img/bLxcjh3.png',
			'fog': 'img/urban-landscape-background-Preview.png',
			'thunder': 'https://66.media.tumblr.com/0e7842678a8f80c39fdb3c3f88106523/tumblr_o4v0n9cYLm1ssfq42o1_500.gif',
			'windy': 'https://66.media.tumblr.com/483608b74bca9d6cf946d7be751e6672/tumblr_pl33tkqGPo1w6dzjz_400.gif',
			'dust': 'img/GqfEdJC.png',
			'tornadostorm': 'https://66.media.tumblr.com/6fc54abf80420d04963c35f5fe9090b3/tumblr_ol68o4p2ZO1soktugo1_1280.png'
			
		};

		var imagepic;

		if (weatherIcons >= 200 && weatherIcons <= 232 ) {
			imagepic = weatherImages.thunder;
		} else if (weatherIcons >= 300 && weatherIcons <= 531) {
			imagepic = weatherImages.rain;   
		} else if (weatherIcons >= 600 && weatherIcons <= 622) {
			imagepic = weatherImages.snow;
		} else if (weatherIcons >= 701 && weatherIcons <= 731) {
			imagepic = weatherImages.dust;
		} else if (weatherIcons == 741) {
			imagepic = weatherImages.fog;
		} else if (weatherIcons >= 751 && weatherIcons <= 781) {
			imagepic = weatherImages.dust;
		} else if (weatherIcons == 800) {
			imagepic = weatherImages.clear;
		} else if (weatherIcons >= 801 && weatherIcons <= 804) {
			imagepic = weatherImages.clouds;
		} else if (weatherIcons >= 900 && weatherIcons <= 906) {
			imagepic = weatherImages.tornadostorm;
		} else if (weatherIcons >= 951 && weatherIcons <= 962) {
			imagepic = weatherImages.windy;
		} else {}

		var speedimg = 500;

		$(".wrapper").animate({opacity: 0}, speedimg, function() {

			$(".wrapper").animate({opacity: 1}, speedimg);
			$(".wrapper").css(
				'background-image', 'url(' + imagepic + ')');

		});

	});
};
