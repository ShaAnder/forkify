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

/**
 * Async export function for loading the recipe from the url
 * @param {string} id string for the recipe for loading purposes
 * @returns nothing
 * @author ShAnder
 */

export const loadRecipe = async function (id) {
  try {
    // get our data from the AJAX helper
    const data = await AJAX(`${API_URL}/${id}`);
    // add our data to the state while also formatting it with helper
    state.recipe = await formatRecipe(data);
    // Re-add bookmarked property to recipes we have bookmarked (search for matching id, if matches add property)
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    // else do not add property
    else state.recipe.bookmarked = false;
  } catch (err) {
    // catch and throw error to propogate down
    throw err;
  }
};

//---------------------------------------------------------------//

/**
 * Async export function to control search result loading
 * @param {string} query string, what we get back from the search form
 * @returns {object} of data for rendering the recipe item in the search bar
 * @author ShAnder
 */
export const loadSearchResults = async function (query) {
  try {
    // set queery to empty
    state.search.query = query;
    // get data from url
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    // map over it
    state.search.results = data.data.recipes.map(rec => {
      // return what we need for each search item
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    // catch and throw error to propogate
    throw err;
  }
};

//---------------------------------------------------------------//

/**
 * export function to control getting the results page number
 * @param {dataset} dataset number to go to the page we want, default of the state page
 * @returns {Array} of data containing that pages search results (the slice start and end)
 * @author ShAnder
 */
export const getSearchResultsPage = function (page = state.search.page) {
  // get page default
  state.search.page = page;
  // dynamically calc the page results, so that we don't need hard coded numbers
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9
  // then return the slice for rendering
  return state.search.results.slice(start, end);
};

//---------------------------------------------------------------//

/**
 * export function for controlling servings updates
 * @param {dataset} newServings number, what we get back from the recipe view handler
 * @returns nothing
 * @author ShAnder
 */
export const updateServings = function (newServings) {
  // gets the ingredients from the state
  state.recipe.ingredients.forEach(ing => {
    // formula to calculate new ingredient quantity based on the servings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // now update the servings
  state.recipe.servings = newServings;
};

//---------------------------------------------------------------//

/**
 * function for storing bookmarks in local storage
 * @returns nothing
 * @author ShAnder
 */
const persistBookmarks = function () {
  // stringify and store our bookmarks
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

//---------------------------------------------------------------//

/**
 * export function for adding bookmarks
 * @param {object} recipe, object containing our recipe data
 * @returns nothing
 * @author ShAnder
 */
export const addBookmarks = function (recipe) {
  // Push recipe to the bookmarks array (array of objects)
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmarks
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // save updated bookmarks to local storage
  persistBookmarks();
};

//---------------------------------------------------------------//

/**
 * export function for deleting bookmarks
 * @param {string} id, id string to identify our recipe
 * @returns nothing
 * @author ShAnder
 */
export const deleteBookmark = function (id) {
  // Get the index from our bookmarks state
  const index = state.bookmarks.findIndex(el => el.id === id);
  // splice it out of bookmarks
  state.bookmarks.splice(index, 1);
  // Mark as NOT Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  // save updated bookmarks to local storage
  persistBookmarks();
};

//---------------------------------------------------------------//

/**
 * init function to get any saved bookmarks from storage and add them to state
 * @returns nothing
 * @author ShAnder
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//---------------------------------------------------------------//

/**
 * dev function (unused) for clearing bookmakrks storage
 * @returns nothing
 * @author ShAnder
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//---------------------------------------------------------------//

/**
 * Async export function for uploading a recipe, takes the new recipe from the form data
 * filters it down to the ingredients required then creates a new array out of them then
 * formats it and adds to the bookmarks
 * @param {form data} newRecipe form data, passed in for manipulation
 * @returns ingredient quantities for use in the recipe uploading
 * @author ShAnder
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // get ingredients by using object.entries
    const ingredients = Object.entries(newRecipe)
      // Filter it down to just the ingredients
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      // map into an array and trim away whitespace
      .map(ing => {
        // Treturn array we can destructure
        const ingArr = ing[1].split(',').map(el => el.trim());
        // throw error if wrong format
        if (ingArr.length !== 3)
          throw new Error('Wrong format please use the correct one');
        // three fields for returning
        const [quantity, unit, description] = ingArr;
        // return ingredient details converted to correct format
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // create new recipe object for uploading
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    // Post data to the api
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    // save the recipe to the state while also formatting
    state.recipe = await formatRecipe(data);
    //add bookmark for new recipe
    addBookmarks(state.recipe);
  } catch (err) {
    // propogate the error
    throw err;
  }
};
