import './css/styles.css';
import { fetchCountries } from "./JS/fetchCountries";
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchBoxRef = document.getElementById('search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
searchBoxRef.addEventListener('input', debounce(searchHendler, DEBOUNCE_DELAY));

let countryName = '';

function clearAnsw() {
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
}
function searchHendler(event) {
    countryName = event.target.value.trim();
    if (!countryName) {
        clearAnsw();
        return;
    };
    fetchCountries(countryName)
    .then(countryList => {
        if (countryList.length === 1) {
            clearAnsw();
            countryInfoRef.innerHTML = renderSingleMurkup(countryList);
        } else if (countryList.length > 1 && countryList.length <= 10) {
            clearAnsw();
            countryListRef.innerHTML = renderMultiMurkup(countryList);            
        } else {
            clearAnsw();
            Notify.info("Too many matches found. Please enter a more specific name.");
        }            
     })    
        .catch(error => {
            clearAnsw();
        Notify.failure("Oops, there is no country with that name");
    });
}

function renderSingleMurkup(countryList) {
    const languages = Object.values(countryList[0].languages).join(', ');
    return countryList.map(({ capital, flags, name, population }) => {
        return `<div class="country-info_around">
                    <img src="${flags.svg}" alt="Country flag" width="40" height="30"" />
                    <p class="country-info_name">${name.official}</p>
                </div>
                <p><b>Capital:</b> ${capital}</p>
                <p><b>Population:</b> ${population}</p>
                <p><b>Languages:</b> ${languages}</p>`
    }).join('');  
}

function renderMultiMurkup(countryList) {
    return countryList.map(({ flags, name }) => {
        return `<li class="country-list_item">
                    <img src="${flags.svg}" alt="Conntry flag" width="40" height="30">
                    <p class="country-list_name">${name.official}</p>
                </li>`;
    }).join('');
}