import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryList.style.padding = '0px';

countryInput.addEventListener(
  'input',
  debounce(countryInputDebounce, DEBOUNCE_DELAY)
);

function countryInputDebounce() {
  const name = countryInput.value.trim();
  if (name === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(countries)
        );
      } else if (countries.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length >= 2 && countries.length <= 10) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(countries)
        );
      } else {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    })
    .catch(() =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function renderCountryList(countries) {
  const countryListMarkup = countries
    .map(({ name, flags }) => {
      return `
            <div class="country-list__item">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 30px>
                <h2 class="country-list__name" style="display:inline-block; margin-left: 10px">${name.official}</h2>
            </div>
            `;
    })

    .join('');
  return countryListMarkup;
}

function renderCountryInfo(countries) {
  const countryInfoMarkup = countries
    .map(({ capital, population, languages }) => {
      return `
            <div class="country-info__list">
                <div class="country-info__item"><b>Capital: </b>${capital}</div>
                <div class="country-info__item"><b>Population: </b>${population}</div>
                <div class="country-info__item"><b>Languages: </b>${Object.values(
                  languages
                ).join(', ')}</div>
            </div>
            `;
    })
    .join('');
  return countryInfoMarkup;
}
