// Variables 
var searchButton = $(".searchButton");

var apiKey = "e70812a8d4a954f92633101b0d6a9635";

var citiesFound = 0;

// Forloop for persisting the data onto HMTL page
for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
}
// Key count for local storage 
var keyCount = 0;

function showForecast(city) {

    // Variable for current weather working 
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&Appid=" + apiKey + "&units=metric";
    // Variable for 5 day forecast working
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&Appid=" + apiKey + "&units=metric";

    if (city == "") {
        console.log(city);
        
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            // list-group append an li to it with just set text
            var cityName = $(".list-group").addClass("list-group-item");
            
            // increase found cities counter
            // Local storage
            var local = localStorage.setItem(keyCount, response.name);
            keyCount = keyCount + 1;

            cityName.append("<li>" + "<button id=\"cityButton" + keyCount + "\">" + response.name + "</button>" + "</li>");           
            $("#cityButton" + keyCount).addClass("cityButton");
            $("#cityButton" + keyCount).click(() => {
                showForecast(city);
            });
            
            // Start Current Weather append 
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            var currentName = currentCard.append("<p>");
            currentCard.append(currentName);

            // Adjust Date 
            var timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            // Weather Icon
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add Temp 
            var currentTemp = currentName.append("<p>");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "</p>");
            // Add Humidity
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            // Add Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");
            // UV Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;
            // UV Index
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (response) {
                var currentUV = (response.value);
                currentTemp.append("<p>" + "UV Index: " + "<span>" + currentUV + "</span>" + "</p>").addClass("card-text fiveDayColor");                
            // UV index color
                if (currentUV <= 4) {
                   $('span').addClass("low");
                } else if (response.value <= 7) {
                    $('span').addClass("normal");
                } else if (response.value <= 10) {
                    $('span').addClass("high");
                }
                }            
            );
        })};

        // Start call for 5-day forecast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {
            // Array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            })
        });
};

// Search button click event
searchButton.click(() => {
    var searchInput = $(".searchInput").val();

    showForecast(searchInput);

});
