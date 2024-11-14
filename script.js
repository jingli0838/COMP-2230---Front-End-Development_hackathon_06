import { keyValue } from './external.js';


document.addEventListener("DOMContentLoaded", function () {
   
    
   
    const baseUrl= "http://api.weatherstack.com/current";

    const myApiKey = keyValue;
    const selectNode = document.getElementById("location");
    const loadButton = document.getElementById("loadButton");
    const containerNode = document.getElementById("weatherDataContainer");
    const tbodyNode = document.querySelector("#search-history-table tbody");
    const newCitybutton = document.getElementById("new-city");

    // Initialize the game
    fetchData();
    displayScores();
    

    async  function fetchData(location){
        const url = `${baseUrl}?access_key=${myApiKey}&query=${location}`;

        try {
            // fetch data from the url
            const response = await fetch(url);

            if(!response.ok){
                throw new Error(`HTTP Error: ${response.status}`);  
            }
            const currentData = await response.json();
            console.log(currentData);
            // destructuring data
            const{ 
                current:{humidity, temperature, wind_degree, wind_dir, wind_speed},
                location:{name, country}
            } 
            = currentData;
            // push the destructured data into an empty array
            let weatherData =[];
            weatherData.push(humidity, temperature, wind_degree, wind_dir, wind_speed, name, country);
            console.log(weatherData);
            return weatherData;

        } catch(error){
            console.error(`Failed to fetch: ${error.message}`);
        }
    }

    loadButton.addEventListener("click", async() => {
        //Clear the old data
        containerNode.innerHTML ="";

        if(!selectNode.value){
            const errorNode = document.createElement('p');
            errorNode.innerHTML = "A city is required. Please select a city."
            containerNode.appendChild(errorNode);
            return;
        }
        const location = selectNode.value;
        const weatherDate = await fetchData(location);

        displayWeather(weatherDate,location);
    });
    console.log(baseUrl, myApiKey);


    function displayWeather(weatherData,location){
        // add the head of the data
        const headNode = document.createElement('h2');
        headNode.textContent = `Current Weather in ${location}`;
        containerNode.appendChild(headNode);
        // display the weather data 
        const weatherDataNode = document.createElement('p');
        weatherDataNode.innerHTML = `Country:${weatherData[6]}<br>Ctiy:${weatherData[5]}<br>Tempreture:${weatherData[1]}<br>Humidity:${weatherData[0]}<br>Wind Degree:${weatherData[2]}<br>Wind Direction:${weatherData[3]} <br>Wind Speed:${weatherData[4]}<br>`;
        containerNode.appendChild(weatherDataNode); 
    } 

    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);


    function handleFormSubmit(event) {
        event.preventDefault();
        //... form submission logic including setting cookies and calculating score
        const selectedCity = selectNode.querySelector(`input[name="location"]:checked`).value;
     
        checkSelectedCity();
        const cityname = getCookie("cityname");
        if(!cityname){
            //Calls setCookie if no username cookie is found
            setCookie("cityname",selectedCity,1);
        };
        //Calculates the current score with calculateScore
        const score = calculateScore();
        //Saves the score with saveScore.
        saveScore(nameValue, score);
        displayScores();
        // Checks for the username cookie again with checkUsername to adjust the UI accordingly.
        checkUsername();
        // Fetches new questions by calling fetchQuestions for another round.
        fetchQuestions();
    }

    function checkSelectedCity() {
        //... code for checking if a username cookie is set and adjusting the UI 
        const cityname = getCookie("cityname");
        if(cityname){
            selectNode.classList.add("hidden");
            newCitybutton.classList.remove("hidden");
        }else{
            selectNode.classList.remove("hidden");
            newCitybutton.classList.add("hidden");
        }
    }

    function setCookie(name, value, days) {
        //... code for setting a cookie
        let expires = "";
        if(days){
            const date = new Date();
            date.setTime(date.getTime()+days*24*60*60*1000);
            expires = `;expires=${date.toUTCString()}`;
        }
        document.cookie =`${name}=${value}${expires}`;
    }

    function getCookie(name) {
        //... code for retrieving a cookie
        const cookieString = document.cookie;
        const pairs = cookieString.split(";");

        for(const pair of pairs){
            const[key, value]=pair.trim().split("=");

            if(name === key){
                return value;
            }
        }
    }

    function saveScore(username, score) {
        // Retrieve the existing scores for the username, or initialize a new array if none exist
        const existingScores = JSON.parse(localStorage.getItem(username)||"[]");
        // Add the new score to the array
        existingScores.push(score);

        // Save the updated array back to localStorage
        localStorage.setItem(username, JSON.stringify(existingScores));
    }

    function newPlayer() {
        //... code for clearing the username cookie and updating the UI
        // clear cookie
        setCookie("username", "", -1);
        checkUsername();  
        console.log("New city initialized. cityname cookie cleared.");
    }

    function calculateScore() {
        //... code for calculating the score
        let score =0;
        document.querySelectorAll("[id^='question-']").forEach((questionDiv,index)=>{
            const selectedAnswer = questionDiv.querySelector(`input[name="answer${index}"]:checked`);
            
            if(selectedAnswer){
                const isFlag = selectedAnswer.hasAttribute("data-correct");
                if(isFlag){
                    score ++;
                }
            }
        })
        return score;
    }

    function displayScores() {
        //... code for displaying scores from localStorage
        // clear the tbodyNode
        tbodyNode.innerHTML = "";
        // display all the scores in the localstorage
        for(let i=0; i< localStorage.length; i++){
            const username = localStorage.key(i);
            const scores = JSON.parse(localStorage.getItem(username)||"[]");
            
            scores.forEach(score =>{
                const newRow = document.createElement("tr");
                const usernameCell = document.createElement("td");
                usernameCell.textContent = username;
                const scoreCell = document.createElement("td");
                scoreCell.textContent = score;
                // Append the cells to the row
                newRow.appendChild(usernameCell);
                newRow.appendChild(scoreCell);
                // Append the row to the table body
                tbodyNode.appendChild(newRow);
            }) 
        }
    }
});