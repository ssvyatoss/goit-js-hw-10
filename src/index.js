import './css/styles.css';
import { fetchCountries } from './fetchCountries';   
import countryListTemplate from './templates/country-list.hbs';
import countryInfoTemplate from './templates/country-info.hbs';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { create } from 'handlebars';

const DEBOUNCE_DELAY = 300;

const inputTxt = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const onInputTxtInput = debounce(() => {
   
    const countryQuery = inputTxt.value.trim();

    if(countryQuery === "") {
        return;
    }
    countryInfoEl.innerHTML = "";
    countryListEl.innerHTML = "";
    fetchCountries(countryQuery)
    .then(data => {
        console.log(data);
        if(data.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        } else if(data.length >= 2) {
            countryListEl.innerHTML = countryListTemplate(data);
            // countryInfoEl.innerHTML = "";
        } else {
            data[0].languages = Object.values(data[0].languages).join(', ');
            countryInfoEl.innerHTML = countryInfoTemplate(data);
            // countryListEl.innerHTML = "";
        }
    })
    .catch(err => {
        console.log(err);
        if(err.message === '404') {
            Notiflix.Notify.failure("Oops, there is no country with that name");
            // countryListEl.innerHTML = "";
            // countryInfoEl.innerHTML = "";
        }
    });

    console.log(countryQuery);
    
}, DEBOUNCE_DELAY);

inputTxt.addEventListener('input', onInputTxtInput);

// console.log(fetchCountries("USA"))
// console.log(fetch("Kyiv"));__
