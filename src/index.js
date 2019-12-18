import './styles.css';
import 'pnotify/dist/PNotifyBrightTheme.css';
import debounce from 'lodash.debounce';
import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';

const inputCountry = document.querySelector('.input');
const outputCountryCard = ([country]) => {
  inputCountry.nextSibling && inputCountry.nextSibling.remove();
  let language;
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
  inputCountry.nextSibling && inputCountry.nextSibling.remove();
  if (countries.length > 10) {
    PNotify.error({
      title: '',
      text: 'Too many matches found. Please enter a more specific query!',
    });
  }
  if (countries.length >= 2 && countries.length <= 10) {
    inputCountry.nextSibling && inputCountry.nextSibling.remove();
    const countriesList = document.createElement('ul');
    countriesList.insertAdjacentHTML('afterbegin', listCountries);
    inputCountry.after(countriesList);
  }
};
const findCountry = ev => {
  ev.target.value &&
    fetch(`https://restcountries.eu/rest/v2/name/${ev.target.value}`)
      .then(res => res.json())
      .then(res => {
        if (res.hasOwnProperty('status') && res.status === 404) {
          PNotify.closeAll();
          inputCountry.nextSibling && inputCountry.nextSibling.remove();
          PNotify.error({
            title: '',
            text: 'No correct request',
          });
        } else {
          PNotify.closeAll();
          const countries = res.map(elem => elem);
          if (countries.length === 1) {
            outputCountryCard(countries);
          } else outputCountries(countries);
        }
      })
      .catch(er => {
        PNotify.closeAll();
        inputCountry.nextSibling && inputCountry.nextSibling.remove();
        PNotify.error({
          title: '',
          text: `${er}`,
        });
      });
};
inputCountry.addEventListener('input', debounce(findCountry, 500));
