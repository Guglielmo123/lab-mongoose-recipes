const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

//Method 1 : Using Async Await

const manageRecipes = async () => {
  try {
    // Connection to the database "recipe-app"
    const dbConnection = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to the database: "${dbConnection.connection.name}"`);

    // Before adding any recipes to the database, let's remove all existing ones
    await Recipe.deleteMany();

    // Run your code here, after you have insured that the connection was made
    let recipe1 = {title: 'Carbonara', level: 'Amateur Chef', cuisine: 'Italian'};
    await Recipe.create(recipe1);
    let findRecipe =  await Recipe.find({title: 'Carnbonara'});
    console.log(findRecipe);

    const insertedRecipes = await Recipe.insertMany(data);
    console.log(`Inserted ${insertedRecipes.length} recipes:`);

    // print title of each recipe 
    insertedRecipes.forEach((recipe) => {
      console.log(recipe.title);})

    // lets update the Rigatoni alla Genovese as duration is wrong and should be 100 mins 
    const updatedRigatoniDuration = await Recipe.findOneAndUpdate({title: 'Rigatoni alla Genovese'},{$set: {duration: 100}}, {new: true});
    /* The { new: true } option in the findOneAndUpdate() method tells 
    Mongoose to return the updated document after the update operation is completed. 
    By default, if the new option is not set to true, the method returns the document 
    as it was before the update operation was performed. */

    console.log(`Succesful update to: ${updatedRigatoniDuration}`)


    // Remove a Recipe - Carrot Cake out of stock!

    const removeCarrotCake = await Recipe.findByIdAndDelete('6453e96631c24a612674189a');
    console.log(removeCarrotCake); // expected output is null since carrot cake object has been removed.

    // close the connection with MongoDB database (free up resources and prevent memory leaks)
      
    await mongoose.connection.close();
    console.log('Connection to database closed');

  } catch(error) {
    console.log(error);
  }
};

manageRecipes();

