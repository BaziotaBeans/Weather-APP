/**
 * All Aplication
 */

 let element = {
    body: document.querySelector('body'),
    toggle_themes_shift: document.querySelector('.toggle-themes-shift'),
    input: document.querySelector('.input-container input'),
    input_container: document.querySelector('.input-container'),
    search_icon: document.querySelector('.input-container .fa-search'),
    wheather_princiapl_base_info: document.querySelector('.weather-principal-base-info'),
    slide_item: document.querySelectorAll('.slid-item'),
    weather_weekday_info: document.querySelectorAll('.weather-weekday-info'),
    weather_weekday_active: document.querySelector('.weather-weekday-active'),
    footer: document.querySelector('footer'),
    /*  */
    toggle_themes_checkbox: document.querySelector('.toggle-themes-checkbox'),
    container_weather_principal_info: document.querySelector('.container-weather-principal-info'),
    form: document.querySelector('form'),
    container_weather_weekday: document.querySelector('.container-weather-weekday'),
    container_error_msg: document.querySelector('.container-error-msg'),
    spinner_loader: document.querySelector('.loader')
}

const obj_info = {
    apiKey: '30e9e354af0bf86219b6a6c465b45d4f',
    latitude: 0,
    longitude: 0,
    daily: 'daily'
}

/**
 * To convert the unix timestamp in an timestamp when human can understand
 */
 class ConverUnixTimeStamp{
    constructor(unix_timestamp){
        this.date = new Date(unix_timestamp * 1000);
    }
        getHours(){  return this.date.getHours();
    }
        getMinutes(){
        return `0 ${this.date.getMinutes()}`;
    }
        getSeconds(){
        return `0 ${this.date.getSeconds()}`;
    }
        getDay(){
        return this.date.getDate();
    }

    getHours_Minutes(){
        return `${this.date.getHours()}:${this.date.getMinutes()}`;
    }

    getWeekday(){
        let arr_weekday = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
        return arr_weekday[this.date.getDay()];
    }
        getMonth(){
        let arr_month = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
        return arr_month[this.date.getMonth()];
    }
        getFullDate(){
        return `${this.getWeekday()} ${this.getDay()} de ${this.getMonth()}`;
    }
}

function showMsg(){
    element.container_error_msg.classList.remove('hide_msg');
    element.container_error_msg.classList.add('show_msg');
}


function hideMsg(){
    element.container_error_msg.classList.remove('show_msg');
    element.container_error_msg.classList.add('hide_msg');
}

element.form.addEventListener('submit', (e)=>{

    /**
     * Init: where the user submit the form
     */
    element.spinner_loader.style.display = 'block';
    hideMsg();
    removeChild(element.container_weather_principal_info);
    removeChild(element.container_weather_weekday);


    e.preventDefault();
    let event = e.target;
    let inputValue = element.input.value;
    element.input.value = '';
    console.log(inputValue);
    const url_principal = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${obj_info.apiKey}&lang={pt}&units=metric`;
    var result = fetch(url_principal, {
        method: 'get'
    }).then(function(response){
        return response.json(); // pass the data as promise to next then block
    }).then((data)=>{
        element.spinner_loader.style.display = 'none';
        const {dt, main, name, sys, weather, wind} = data;
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
        obj_info.latitude = data.coord.lat;
        obj_info.longitude = data.coord.lon;
        let timezone = new ConverUnixTimeStamp(dt);
        let sunrise_ = new ConverUnixTimeStamp(sys.sunrise);
        let sunset_ = new ConverUnixTimeStamp(sys.sunset);
        let markup_1 = `
            <div class="weather-principal-info-1">
            <h1 class="weather-city-name">${name},<span class="region">${sys.country}</span></h1>
            <h2 class="current-date">${timezone.getFullDate()}</h2>
            <div class="weather-temperature"><img src="${icon}" alt="${weather[0]["description"]}" class="weather-img">
                <div class="weather-temperature-info">
                    <h1 class="weather-temperature-degree">${parseInt(main.temp)} <span>&#176;</span></h1>
                    <h3 class="weather-temperature-value">${weather[0]["description"]}</h3>
                </div>
            </div>
        </div>`;
        let markup_2 = `
        <div class="weather-principal-info-2">
        <div class="weather-principal-base-info">
                <div class="weather-high">
                    <h3>${parseInt(main.temp_max)} <span>&#176;</span></h3>
                    <h4>Alto</h4>
                </div>
                <div class="weather-wind">
                    <h3>${wind.speed}mph</h3>
                    <h4>Vento</h4>
                </div>
                <div class="weather-sunrise">
                    <h3>${sunrise_.getHours_Minutes()}</h3>
                    <h4>Nascer do Sol</h4>
                </div>
                <div class="weather-low">
                    <h3>${parseInt(main.temp_min)} <span>&#176;</span></h3>
                    <h4>Baixo</h4>
                </div>
                <div class="weather-humidity">
                    <h3>${main.humidity}%</h3>
                    <h4>Umidade</h4>
                </div>
                <div class="weather-sunset">
                    <h3>${sunset_.getHours_Minutes()}</h3>
                    <h4>Pôr do sol</h4>
                </div>
            </div>
        </div>
        `;
        removeChild(element.container_weather_principal_info);
        element.container_weather_principal_info.insertAdjacentHTML('beforeend',markup_1);
        element.container_weather_principal_info.insertAdjacentHTML('beforeend',markup_2);
        console.log(data);
        hideMsg();
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${obj_info.latitude}&lon=${obj_info.longitude}&appid=${obj_info.apiKey}&lang={pt}&units=metric`); // make a 2nd request and return a promise
    }).then((response) => {
        return response.json();
    }).catch((error)=>{
        console.log('Request failed', error);
        removeChild(element.container_weather_principal_info);
        removeChild(element.container_weather_weekday);
        showMsg();
    });

    /**
     * All app is rendered in this anonymous functions
     */
    result.then((r)=>{
        const {daily} = r;
        console.log(daily);
        removeChild(element.container_weather_weekday);
        daily.forEach((d)=>{
            //const time_daily = new ConverUnixTimeStamp(h.dt);
            const time_daily = new ConverUnixTimeStamp(d.dt);
            const sunrise = new ConverUnixTimeStamp(d.sunrise);
            const sunset = new ConverUnixTimeStamp(d.sunset);
            const icon_daily = `https://openweathermap.org/img/wn/${d.weather[0]["icon"]}@2x.png`;
            let currentDate = new Date();
            const markup = `
            <div class="weather-weekday">
            <h1 class="weather-weekday-name">${time_daily.getWeekday()}</h1>
            <div class="weather-weekday-info ${isNowDay(time_daily.getWeekday(), time_daily.getDay()) ? 'weather-weekday-active': '' }">
                    <img src="${icon_daily}" alt="${d.weather[0]["description"]}" class="weather-weekday-info-img">
                    <div class="weather-weekday-info-card">
                        <div class="weather-weekday-info-card-item">
                            <h1 class="degree-high">${parseInt(d.temp.max)}<span>&#176;</span></h1>
                            <small>Alto</small>
                        </div>
                        <div class="weather-weekday-info-card-item">
                            <h1 class="degree-low">${parseInt(d.temp.min)}<span>&#176;</span></h1>
                            <small>Baixo</small>
                        </div>
                    </div>
                    <div class="weather-weekday-info-shift">
                        <div class="weather-weekday-info-shift-sunrise">
                            <img src="img/Sunrise.svg" alt="sunrise">
                            <h2 class="weather-weekday-info-shift-time-1">${sunrise.getHours_Minutes()}</h2>
                        </div>
                        <div class="weather-weekday-info-shift-sunset">
                            <img src="img/Sunset.svg" alt="sunset">
                            <h2 class="weather-weekday-info-shift-time-2">${sunset.getHours_Minutes()}</h2>
                        </div>
                    </div>
                </div>
            </div>
            `;
            element.container_weather_weekday.insertAdjacentHTML('beforeend',markup);
        })
        element.container_weather_weekday.removeChild(element.container_weather_weekday.children[7]);
    })
})


function isNowDay(oldDate, oldDay) {
    let arr_weekday = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    let newDate = new Date();
    return arr_weekday[newDate.getDay()] === oldDate && newDate.getDate() === oldDay;
}



function removeChild(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}


function renderPrincipalContainer(){

}


/**
 * For App Theme
 */

element.toggle_themes_checkbox.addEventListener('change', ({target}) =>{
    if(!target.checked){
        element.body.style.background = 'linear-gradient(135deg, var(--primary-black),var(--primary-purple))';
        element.toggle_themes_shift.style.backgroundColor = 'var(--primary-purple)';
        element.input.style.color = 'var(--input-search-text-primary)';
        element.input.style.backgroundColor = 'white';
        element.input_container.classList.remove('dark-input-container');
        element.input_container.classList.add('purple-input-container');
        element.search_icon.style.color = 'var(--primary-purple)';    
        if(document.querySelector('.weather-principal-base-info')){

            document.querySelector('.weather-principal-base-info').style.backgroundColor = 'var(--secondary-purple)';
            document.querySelector('.weather-principal-base-info').style.boxShadow = 'inset -50px 50px 100px #713eb3, inset 50px -50px 100px #d374ff';
        }
        element.slide_item.forEach(cur=>{
            cur.style.backgroundColor = 'var(--primary-purple)';
        });
        element.weather_weekday_info.forEach(cur=>{
            cur.style.backgroundColor = 'rgba(117,25,235,.2)';
        });
        if(document.querySelector('.weather-weekday-active')){
            document.querySelector('.weather-weekday-active').style.backgroundColor = 'var(--primary-purple)';
        }
        element.footer.style.backgroundColor = 'var(--secondary-purple)';
    
    }else{  
        element.body.style.background = 'radial-gradient(circle, rgba(59,13,117,1) 0%, rgba(24,24,24,1) 49%)';
        element.toggle_themes_shift.style.backgroundColor = 'var(--secondary-black)';
        element.input.style.color = 'var(--input-search-text-secondary)';
        element.input.style.backgroundColor = 'var(--secondary-black)';
        element.input_container.classList.remove('purple-input-container');
        element.input_container.classList.add('dark-input-container')
        element.search_icon.style.color = 'var(--primary-black)';
        if(document.querySelector('.weather-principal-base-info')){

            document.querySelector('.weather-principal-base-info').style.backgroundColor = 'var(--secondary-black)'; 
            document.querySelector('.weather-principal-base-info').style.boxShadow = 'none';
        }
        element.slide_item.forEach(cur=>{
            cur.style.backgroundColor = 'rgba(58,58,58,.2)';
        });
        element.weather_weekday_info.forEach(cur=>{
            cur.style.backgroundColor = 'rgba(58,58,58,.2)';
        });
        if(document.querySelector('.weather-weekday-active')){
            document.querySelector('.weather-weekday-active').style.backgroundColor = 'var(--secondary-black)';
        }
        element.footer.style.backgroundColor = 'var(--secondary-black)';
    }
});


