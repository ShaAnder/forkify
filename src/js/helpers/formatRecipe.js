// small helper function to format the recipe

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
