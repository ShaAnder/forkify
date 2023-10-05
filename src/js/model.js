// ---- IMPORTS ---- //

// config
import { API_URL } from './config';
import { API_KEY } from './config';
import { RES_PER_PAGE } from './config';

// helpers
import { AJAX } from './helpers/AJAX';
import { formatRecipe } from './helpers/formatRecipe';

// ---- VARS ---- //

// export our state for later use
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

// ---- MODEL ---- //

export const loadRecipe = async function (id) {
  try {
    // we get our data from the getJSON func
    const data = await AJAX(`${API_URL}/${id}`);
    // and our recipe from our formatRecipe func
    state.recipe = await formatRecipe(data);

    // as it stands when we add bookmarks they get wiped when we update the html so
    // this is how we will load our bookmarked recipes, if a recipe is in the bookmarked
    // loop through loaded recipes, and if it matches those in the bookmarked array rebookmark it
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // we need to throw this error to propogate it
    throw err;
  }
};

// Now this function will load our search results
export const loadSearchResults = async function (query) {
  try {
    // we set our empty query here
    state.search.query = query;
    // so let's get our url
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // so we want to get all the data
    state.search.results = data.data.recipes.map(rec => {
      // we can't use format recipe here as we only want these 4
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

// Now we're going to implement pagination, having pages for our recipes
// not async as we already have results loaded so this will come after
export const getSearchResultsPage = function (page = state.search.page) {
  // we want to get the page default
  state.search.page = page;

  //we only want to return a part of the results, so we're going to
  //calc dynamically, we will get the "page" * 10 and that should give us a page
  // with 10 results, we do page -1 as well to ensure it starts correctly
  console.log(page);
  // and ofc for dynamics we want to set a start and end
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  // then return the slice for rendering
  return state.search.results.slice(start, end);
};

// Now we create a servings function for updating the recipe servings for
// any given recipe

export const updateServings = function (newServings) {
  // this func will reach into the state / recipe to the
  // ingredients and update them based on the number of servings
  state.recipe.ingredients.forEach(ing => {
    // we're going to use a formula to figure this out with a simple formula
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  // now update the servings
  state.recipe.servings = newServings;
};

// STORING BOOKMARKS IN LOCAL STORAGE
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Now we want to begin building bookmarks and the bookmark functionality
export const addBookmarks = function (recipe) {
  // Add Bookmarks
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarks
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// now we want to setup bookmark deletion
export const deleteBookmark = function (id) {
  // Delete Bookmarks
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// quick dev function to clear bookmarks when we need
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

// UPLOAD A RECIPE
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      // Get entries of new recipe, filter for ones that start with ingredients and are not empty strings
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      // then map to a new array and replace the white space / split the strings.
      .map(ing => {
        // This returns a new array with 3 elements so we can destructure it to get what we need
        const ingArr = ing[1].split(',').map(el => el.trim());
        // we also want error checks in case the array length is wrong (they don't format correctly)
        if (ingArr.length !== 3)
          throw new Error('Wrong format please use the correct one');
        const [quantity, unit, description] = ingArr;

        // we want to fix the object items so that we don't have any undefined items,

        // now we return an object with these three items, we also need to convert the quantity to
        // ensure it doesn't show up as a string,
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // now we want to create the recipe object for uploading
    // this is kinda the opposite of our format recipe because we're sending
    // it into that
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = await formatRecipe(data);
    //add bookmark for new recipe
    addBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};
