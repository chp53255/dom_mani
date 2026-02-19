'use strict';

/*
  10_java.js
 
  1 When user clicks "Filter Articles" button -> show/hide the filter menu.
  2 When user clicks "Add New Article" button -> show/hide the add form.
  3 When user checks/unchecks a filter checkbox -> hide/show matching articles.
  4 When user fills out the form and clicks "Add New Article" ->
     create a new <article> card and append it to the list with correct styles.
  JavaScript finds HTML elements using IDs / selectors.
  
*/

// Small helper: shorter than writing document.getElementById(...) every time.
function byId(id) {
  return document.getElementById(id);
}

function hide(elem) {
  // Defensive: if elem is null, don't crash the page.
  elem.style.display = 'none';
}

function showBlock(elem) {
  elem.style.display = 'block';
}

function showFlex(elem) {
  elem.style.display = 'flex';
}

// - Clicking Filter toggles filterContent
// - Also hides the add form so only one menu is visible at a time
function showFilter() {
  const filterForm = byId('filterContent');
  const addForm = byId('newContent');

  const isVisible = window.getComputedStyle(filterForm).display !== 'none';
  hide(addForm);
  if (isVisible) hide(filterForm);
  else showBlock(filterForm);
}

// - Clicking Add New toggles newContent
// - Also hides filter menu
function showAddNew() {
  const filterForm = byId('filterContent');
  const addForm = byId('newContent');

  const isVisible = window.getComputedStyle(addForm).display !== 'none';
  hide(filterForm);
  if (isVisible) hide(addForm);
  else showFlex(addForm);
}

// We read the three checkboxes, then loop all cards.
// Each card has a class: opinion/recipe/update.
// We hide cards whose type is unchecked.
function filterArticles() {
  const showOpinion = byId('opinionCheckbox').checked;
  const showRecipe = byId('recipeCheckbox').checked;
  const showUpdate = byId('updateCheckbox').checked;

  const allArticles = document.querySelectorAll('#articleList article');
  allArticles.forEach((article) => {
    if (article.classList.contains('opinion')) {
      article.style.display = showOpinion ? 'block' : 'none';
    } else if (article.classList.contains('recipe')) {
      article.style.display = showRecipe ? 'block' : 'none';
    } else if (article.classList.contains('update')) {
      article.style.display = showUpdate ? 'block' : 'none';
    }
  });
}
// Read the selected radio button (Opinion/Recipe/Update)
// returns a string: "opinion" | "recipe" | "update" | null
function getSelectedType() {
  const selected = document.querySelector('input[name="articleType"]:checked');
  return selected ? selected.value : null; // opinion | recipe | update
}

function prettyType(type) {
  if (type === 'opinion') return 'Opinion';
  if (type === 'recipe') return 'Recipe';
  return 'Update';
}

// 1 read form values
// 2 validate
// 3 build <article> DOM nodes using createElement
// 4 append to #articleList
// 5 clear the form
// 6 re-run filtering so new card respects current filters
function addNewArticle() {
  const title = byId('inputHeader').value.trim();
  const body = byId('inputArticle').value.trim();
  const type = getSelectedType();

  if (!title) return alert('Please enter a title.');
  if (!type) return alert('Please pick an article type.');
  if (!body) return alert('Please enter some article text.');

  const articleList = byId('articleList');
  const nextNum = articleList.querySelectorAll('article').length + 1;

  const article = document.createElement('article');
  article.classList.add(type);
  article.id = `a${nextNum}`;

  const marker = document.createElement('span');
  marker.classList.add('marker');
  marker.innerText = prettyType(type);

  const h2 = document.createElement('h2');
  h2.innerText = title;

  const p = document.createElement('p');
  p.innerText = body;

  const pLink = document.createElement('p');
  const link = document.createElement('a');
  link.href = 'moreDetails.html';
  link.innerText = 'Read more...';
  pLink.appendChild(link);

  article.appendChild(marker);
  article.appendChild(h2);
  article.appendChild(p);
  article.appendChild(pLink);

  articleList.appendChild(article);

  byId('inputHeader').value = '';
  byId('inputArticle').value = '';
  document.querySelectorAll('input[name="articleType"]').forEach((r) => (r.checked = false));

  filterArticles(); // keep new article consistent with current filter
}
// We wait for DOMContentLoaded so ALL elements exist before we add listeners.
document.addEventListener('DOMContentLoaded', () => {
  hide(byId('filterContent'));
  hide(byId('newContent'));

  byId('filterButton').addEventListener('click', showFilter);
  byId('addButton').addEventListener('click', showAddNew);

  byId('opinionCheckbox').addEventListener('change', filterArticles);
  byId('recipeCheckbox').addEventListener('change', filterArticles);
  byId('updateCheckbox').addEventListener('change', filterArticles);

  byId('submitNewArticle').addEventListener('click', addNewArticle);

  filterArticles();
});
