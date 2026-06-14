let currentMode = 'info';

const btnInfo = document.getElementById('btn-info');
const btnDetails = document.getElementById('btn-details');
const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const results = document.getElementById('results');

btnInfo.addEventListener('click', function(e) {
    e.preventDefault();
    currentMode = 'info';
    btnInfo.classList.add('active');
    btnDetails.classList.remove('active');
    const country = countryInput.value.trim();
    if (country) {
        fetchCountryInfo(country);
    } else {
        results.innerHTML = '<p style="text-align:center">Search for a country to see basic info.</p>';
    }
});

btnDetails.addEventListener('click', function(e) {
    e.preventDefault();
    currentMode = 'details';
    btnDetails.classList.add('active');
    btnInfo.classList.remove('active');
    const country = countryInput.value.trim();
    if (country) {
        fetchCountryDetails(country);
    } else {
        results.innerHTML = '<p style="text-align:center">Search for a country to see detailed info.</p>';
    }
});

searchBtn.addEventListener('click', function() {
    const country = countryInput.value.trim();
    if (!country) {
        results.innerHTML = '<p class="error">Please enter a country name!</p>';
        return;
    }
    if (currentMode === 'info') {
        fetchCountryInfo(country);
    } else {
        fetchCountryDetails(country);
    }
});

// Endpoint 1 - Basic Info (name, population, region, area)
function fetchCountryInfo(country) {
    results.innerHTML = '<p style="text-align:center">Loading...</p>';
    fetch(`https://restcountries.com/v3.1/name/${country}?fields=name,population,region,subregion,area,flag`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            results.innerHTML = '';
            data.forEach(c => {
                const card = document.createElement('div');
                card.classList.add('country-card');
                card.innerHTML = `
                    <h2>${c.name.common} ${c.flag}</h2>
                    <p><strong>Official Name:</strong> ${c.name.official}</p>
                    <p><strong>Population:</strong> ${c.population.toLocaleString()}</p>
                    <p><strong>Region:</strong> ${c.region}</p>
                    <p><strong>Subregion:</strong> ${c.subregion || 'N/A'}</p>
                    <p><strong>Area:</strong> ${c.area ? c.area.toLocaleString() + ' km²' : 'N/A'}</p>
                `;
                results.appendChild(card);
            });
        })
        .catch(error => {
            results.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
}

// Endpoint 2 - Detailed Info (capital, languages, currencies, timezone)
function fetchCountryDetails(country) {
    results.innerHTML = '<p style="text-align:center">Loading...</p>';
    fetch(`https://restcountries.com/v3.1/name/${country}?fields=name,capital,languages,currencies,timezones,flag`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            results.innerHTML = '';
            data.forEach(c => {
                const languages = c.languages ? Object.values(c.languages).join(', ') : 'N/A';
                const currencies = c.currencies ? Object.values(c.currencies).map(cur => `${cur.name} (${cur.symbol})`).join(', ') : 'N/A';
                const capital = c.capital ? c.capital.join(', ') : 'N/A';
                const card = document.createElement('div');
                card.classList.add('country-card');
                card.innerHTML = `
                    <h2>${c.name.common} ${c.flag}</h2>
                    <p><strong>Capital:</strong> ${capital}</p>
                    <p><strong>Languages:</strong> ${languages}</p>
                    <p><strong>Currencies:</strong> ${currencies}</p>
                    <p><strong>Timezone:</strong> ${c.timezones ? c.timezones[0] : 'N/A'}</p>
                `;
                results.appendChild(card);
            });
        })
        .catch(error => {
            results.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
}