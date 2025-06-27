
    const apiKey = "4f838e0f72013a4173fbc32d5988e2a2";

    function toggleDarkMode() {
      document.body.classList.toggle("dark-mode");
    }

    function useMyLocation() {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        getWeatherByCoords(latitude, longitude);
      });
    }

    function getWeather() {
      const city = document.getElementById("cityInput").value.trim();
      if (city) getWeatherByCity(city);
    }

    function getWeatherByCity(city) {
      fetchWeather(`q=${city}`);
    }

    function getWeatherByCoords(lat, lon) {
      fetchWeather(`lat=${lat}&lon=${lon}`);
    }

    function fetchWeather(query) {
      const weatherDiv = document.getElementById("weather");
      const forecastDiv = document.getElementById("forecast");
      const chartCanvas = document.getElementById("tempChart");
      weatherDiv.innerHTML = "";
      forecastDiv.innerHTML = "";

      fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          weatherDiv.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${icon}" alt="icon" width="60">
            <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
            <p>🌡️ Temp: ${data.main.temp}°C</p>
            <p>💧 Humidity: ${data.main.humidity}%</p>
          `;
        });

      fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
          const daily = {}, labels = [], temps = [];
          data.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!daily[date] && item.dt_txt.includes("12:00:00")) {
              daily[date] = item;
              labels.push(new Date(date).toLocaleDateString());
              temps.push(item.main.temp);
            }
          });

          Object.values(daily).forEach(day => {
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            forecastDiv.innerHTML += `
              <div class="card">
                <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                <img src="${icon}" alt="icon">
                <p>${day.weather[0].main}</p>
                <p>${day.main.temp}°C</p>
              </div>
            `;
          });

          new Chart(chartCanvas, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Daily Temp (°C)',
                data: temps,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                borderColor: '#fff',
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.2)' }
                },
                y: {
                  ticks: { color: '#fff' },
                  grid: { color: 'rgba(255,255,255,0.2)' }
                }
              }
            }
          });
        });
    }

    // create animated drops
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';
      drop.style.left = `${Math.random() * 100}vw`;
      drop.style.animationDuration = `${2 + Math.random() * 3}s`;
      document.body.appendChild(drop);
    }
