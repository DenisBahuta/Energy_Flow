import axios from 'axios';

const filterButtons = document.querySelector('.filter-buttons');
const exerciseFiltersList = document.querySelector('.exercise-filters-list');
const pagination = document.querySelector('.pagination');
const BASE_URL = 'https://energyflow.b.goit.study/api';
let filterValueDefault = 'Muscles';
let currentPage = 1;
let screenWidth = window.innerWidth;
let currentLimit = 0;

filterButtons.addEventListener('click', filterBtnClick);

if (screenWidth <= 375) {
  currentLimit = 8;
} else if (screenWidth <= 768) {
  currentLimit = 12;
} else {
  currentLimit = 12;
}

async function getExercises() {
  try {
    const response = await axios.get(`${BASE_URL}/filters`, {
      params: {
        filter: filterValueDefault,
        page: currentPage,
        limit: currentLimit,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function filterBtnClick(event) {
  event.preventDefault();
  currentPage = 1;
  const filterValue = event.target;
  const qwer = filterValue.dataset.filter;
  filterValueDefault = qwer;
  exerciseFiltersList.innerHTML = '';
  if (event.target.tagName !== 'BUTTON') {
    return;
  }
  try {
    getExercises(qwer).then(data => {
      const { results, totalPages, page } = data;
      markupExercises(results);
      if (totalPages > 1) {
        const pag = paginationPages(page, totalPages);
        pagination.innerHTML = pag;
      } else {
        pagination.innerHTML = '';
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function markupExercises(results) {
  const markup = results
    .map(
      ({
        name,
        filter,
        imgUrl,
      }) => ` <li class="filter-list ExercisesItem" data-filter='${filter}' data-name='${name}'>
        <img class="img-exercises" src="${imgUrl}" alt="${filter}">
        <div class="filter-text">
          <p class="filter-exercises">${name}</p>
          <p class="filter-name">${filter}</p>
        </div>
      </li>`
    )
    .join('');
  exerciseFiltersList.insertAdjacentHTML('beforeend', markup);
}

function paginationPages(page, totalPages) {
  let paginationHtml = '';
  for (let i = 1; i <= totalPages; i += 1) {
    paginationHtml += `<button class="pagination-btn" type="button">${i}</button>`;
  }
  return paginationHtml;
}

async function onPaginationPages(e) {
  currentPage = e.target.textContent;
  exerciseFiltersList.innerHTML = '';
  try {
    const { results, page, totalPages } = await getExercises();
    const filter = results[0].filter;

    if (page === totalPages) {
      return;
    }
    markupExercises(results);
  } catch (error) {
    console.log(error);
  }
}

pagination.addEventListener('click', onPaginationPages);