/**
 * Async export helper function, takes data object, formats and returns it for
 * rendering or saving to the state
 * @param {object} data, data to be formatted
 * @returns {object} data for saving  / rendering
 * @author ShAnder
 */
export const formatRecipe = async function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: +recipe.servings,
    cookingTime: +recipe.cooking_time,
    ingredients: recipe.ingredients,
    // short circut a key here (if there is a key add if not ignore)
    ...(recipe.key && { key: recipe.key }),
  };
};
