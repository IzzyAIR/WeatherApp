const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const wImg = document.querySelector(".weather-part img");
const arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e => {
    if (e.key === "Enter" && inputField.value !== "") {
        requestApi(inputField.value);
    }
})


locationBtn.addEventListener("click", () => { 
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation.");
    }
 }); 


function onSuccess(position){
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=825b083a7f82e9c269561011b83b45e0`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
    
}


function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=825b083a7f82e9c269561011b83b45e0`;
    fetchData();
    
}

function fetchData (){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {

    if (info.cod === "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} is not a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;


        if(id == 800){
            wImg.src = "img/clear.svg";
        }else if(id >= 200 && id <= 232){
            wImg.src = "img/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wImg.src = "img/snow.svg";
        }else if(id >= 701 && id <= 781){
            wImg.src = "img/haze.svg";
        }else if(id >= 801 && id <= 804){
            wImg.src = "img/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wImg.src = "img/rain.svg";
        }


        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;


        wrapper.classList.add("active");
        infoTxt.classList.remove("pending", "error");
       
    }
}

arrowBack.addEventListener("click", e => { 
    wrapper.classList.remove("active");
 });