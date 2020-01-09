$(document).ready(function () {

  // Show date and city of searchable location
  function show(data) {
      return "<h2>" + data.name + moment().format(' (MM/DD/YYYY)') + "</h2>" +
          `
      <p><strong>Temperature</strong>: ${data.main.temp}°F</p>
      <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
      <p><strong>Wind Speed</strong>: ${data.wind.speed}MPH</p>
      `
  }
  function showUV(data) {
      console.log(data);
      return `
      <p><strong>UV Index:</strong> ${data.value}</p>
      `
  }

  function displayCities(cityList) {
      $('.city-list').empty();
      var list = localStorage.getItem("cityList");
      cityList = (JSON.parse(list));
      // returning as a string, find javascript function to parse cityList
      if (list) {
          for (var i = 0; i < cityList.length; i++) {
              var container = $("<div class=cities></div>").text(cityList[i]);
              $('.city-list').prepend(container);
          }
      }
  }

  function showForecast(data) {
      var forecast = data.list; 
  
      // Loop over array
      var currentForecast = [];
      for (var i = 0; i < forecast.length; i++) {

          var currentObject = forecast[i];

          var cityTime = currentObject.dt_txt.split(' ')[1] 
          if (cityTime === "12:00:00") {
              // currentObject.main: time, icon, temp, humidity
              var main = currentObject.main;
              // Store each of these in variables
              var temp = main.temp; 
              var humidity = main.humidity;
              var UVindex = data.value;
              var date = moment(currentObject.dt_txt).format('l'); 
              var icon = currentObject.weather[0].icon;
              var iconurl = "https://openweathermap.org/img/w/" + icon + ".png";
            // add five templates for each day of the forecast
              var htmlTemplate = `
          <div class="col-sm currentCondition">
          <div class="card">
              <div class="card-body 5-day">
                  <p><strong>${date}</strong></p>
                  <div><img src= ${iconurl} /></div>
                  <p>${temp}°F</p>
                  <p>Humidity: ${humidity}%</p>
              </div>
          </div> 
      </div>`;
              currentForecast.push(htmlTemplate);
          }

      }
      $("#5-day-forecast").html(currentForecast.join(''));

  }

  // METHODS

  var stored = localStorage.getItem("cityList")
  if (stored) {
      cityList = JSON.parse(stored)
  } else {
      cityList = []
  }

  //var cityList = [];
  $('#submitCity').click(function (event) {
      event.preventDefault();
      var city = $('#city').val();
      // push city to cityList array
      cityList.push(city);
      // stringify cityList in localStorage
      localStorage.setItem("cityList", JSON.stringify(cityList));
      displayCities(cityList);
      var latitude;
      var longitude;
      
      if (city) {

          $.ajax({
              url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
              type: "GET",
              success: function (data) {
                  var display = show(data);
                  $("#show").html(display);
                  latitude = data.coord.lat;
                  longitude = data.coord.lon;
                  console.log(latitude, longitude);
              }
          }).then(()=> {
            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/uvi?appid=' + "5650ba04d76cc8ddc64d65a07cda4c4a" + "&lat=" + latitude + "&lon=" + longitude,
                type: "GET",
                success: function (data) {
                    var uvDisplay = showUV(data);
                    $("#show").append(uvDisplay);
                    console.log(uvDisplay);
                }
            });
          })

          $.ajax({
              url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
              type: "GET",
              success: function (data) {
                  var forecastDisplay = showForecast(data)
                  // add to page
              }
          });

 

      } else {
          $('#error').html('Please insert a city name:');
      }
  });

  displayCities(cityList);

});

$('#clearCity').click(function (event) {
  localStorage.removeItem("cityList", cityList)
  location.reload();
});