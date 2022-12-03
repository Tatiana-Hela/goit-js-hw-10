import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

let searchCountry = '';
const DEBOUNCE_DELAY = 300;

const refs = {
  inputSearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputSearch.addEventListener(
  'input',
  debounce(searchCountryInfo, DEBOUNCE_DELAY)
);

function searchCountryInfo(event) {
  event.preventDefault();

  searchCountry = event.target.value.trim();
  if (!searchCountry) {
    clearRender();
    return;
  }
  fetchCountries(searchCountry)
    .then(countries => renderCounties(countries))
    .catch(error => Notify.failure('Oops, there is no country with that name'))
    .finally(Loading.dots('Loading...'), Loading.remove());
}

function renderCounties(countries) {
  if (countries.length > 10) {
    clearRender();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1 && countries.length <= 10) {
    clearRender();
    createMarkupCountry(countries);
    return;
  } else if (countries.length === 1) {
    clearRender();
    createMarkupCountryInfo(countries);
  }
}
function createMarkupCountry(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-item">
      <img class="flags" 
      src="${flags.svg}" alt="${name.official}" width="50" height="40">
      <p class="country-name">${name.official}</p></li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}
function createMarkupCountryInfo(countries) {
  const markup = countries
    .map(({ name, capital, flags, population, languages }) => {
      return `<div class="box"><img class="country-info-img" src="${
        flags.svg
      }" alt="${name.official}" width="50" height="40">
      <h2 class="country-info-title">${name.official}</h2></div>
      <ul class="country-info-list">
        <li class="country-info-item">
          <p class="country-info-text">Capital:
           <span class="text-info">${capital[0]}</span></p>
        </li>
        <li class="country-info-item">
          <p class="country-info-text">Population:
           <span class="text-info">${population}</span></p>
        </li>
        <li class="country-info-item">
          <p class="country-info-text">Languages:
           <span class="text-info">${Object.values(languages)}</span></p>
        </li>
      </ul>`;
    })
    .join('');
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
function clearRender() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
