import './styles.css';
import debounce from 'lodash.debounce';
import PNotify from '../node_modules/pnotify/dist/es/PNotify.js';
import PNotifyButtons from '../node_modules/pnotify/dist/es/PNotifyButtons.js';

const inputCountry = document.querySelector('.input');
// let countries;
const outputCountryCard = ([country]) => {
  country && document.body.firstElementChild.nextSibling.remove();
  let language;
  console.log(country);
  // console.log(country.languages);
  if (country.languages.length > 1) {
    language = `<ul> Languages:${country.languages
      .map(({ name }) => `<li>${name}</li>`)
      .join('')}</ul>`;
  } else {
    language = `<p>Languages:${country.languages[0].name}</p>`;
  }

  const countryCard = document.createElement('div');
  countryCard.insertAdjacentHTML(
    'afterbegin',
    `<h1>${country.name}</h1>
  <div class=countryInfo>
  <div>
      <p>Capital:${country.capital}</p>
      <p>Population:${country.population}</p>
      ${language}
      </div>
      <img src="${country.flag}" width="200">
      </div>`,
  );
  inputCountry.after(countryCard);
};
const outputCountries = countries => {
  const listCountries = countries.map(elem => `<li>${elem.name}</li>`).join('');
  countries && document.body.firstElementChild.nextSibling.remove();
  if (listCountries.length > 10) {
    PNotify.error({
      title: '',
      text: 'Too many matches found. Please enter a more specific query!',
    });
  }
  if (listCountries.length >= 2 && listCountries.length <= 10) {
    const countriesList = document.createElement('ul');
    countriesList.insertAdjacentHTML('afterbegin', listCountries);
    document.body.firstElementChild.after(countriesList);
  }
};
const findCountry = ev => {
  fetch(`https://restcountries.eu/rest/v2/name/${ev.target.value}`)
    .then(res => res.json())
    .then(res => {
      const countries = res.map(elem => elem);
      if (countries.length === 1) {
        outputCountryCard(countries);
      } else outputCountries(countries);
    })
    .catch(er => console.log(er.message));
  // console.log(countries);
  //   console.log(ev.target.value);
};
inputCountry.addEventListener('input', debounce(findCountry, 500));
// console.log(countries);
