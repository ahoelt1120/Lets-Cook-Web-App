from flask_sqlalchemy import SQLAlchemy
from SQLAlchemy import Enum

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    userID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hashedPassword = db.Column(db.String(255), nullable=False)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    
    # Relationships
    shopping_list = db.relationship("ShoppingList", back_populates="user", uselist=False)
    liked_recipes = db.relationship("Recipe", secondary="liked", back_populates="liked_by")
    disliked_recipes = db.relationship("Recipe", secondary="disliked", back_populates="disliked_by")
    meal_plans = db.relationship("MealInPlan", back_populates="user")

class ShoppingList(db.Model):
    __tablename__ = 'shopping_list'
    
    listID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, db.ForeignKey('users.userID', ondelete='CASCADE'), unique=True)
    
    # Relationships
    user = db.relationship("User", back_populates="shopping_list")
    ingredients = db.relationship("ShoppingListContents", back_populates="shopping_list")

class ShoppingListIngredient(db.Model):
    __tablename__ = 'shopping_list_ingredients'
    
    ingredientID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    
    # Relationships
    shopping_lists = db.relationship("ShoppingListContents", back_populates="ingredient")

class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    
    ingredientID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    
    # Relationships
    recipes = db.relationship("RecipeContents", back_populates="ingredient")

class Recipe(db.Model):
    __tablename__ = 'recipes'
    
    recipeID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    instructions = db.Column(db.Text)
    prepTime = db.Column(db.Text)
    cookTime = db.Column(db.Text)
    servings = db.Column(db.Text)
    nutrition = db.Column(db.Text)
    URL = db.Column(db.String(255))
    cuisine = db.Column(db.Text)
    image_path = db.Column(db.Text)
    
    # Relationships
    ingredients = db.relationship("RecipeContents", back_populates="recipe")
    liked_by = db.relationship("User", secondary="liked", back_populates="liked_recipes")
    disliked_by = db.relationship("User", secondary="disliked", back_populates="disliked_recipes")
    meal_plans = db.relationship("MealInPlan", back_populates="recipe")

class ShoppingListContents(db.Model):
    __tablename__ = 'shopping_list_contents'
    
    listID = db.Column(db.Integer, db.ForeignKey('shopping_list.listID', ondelete='CASCADE'), primary_key=True)
    ingredientID = db.Column(db.Integer, db.ForeignKey('shopping_list_ingredients.ingredientID', ondelete='CASCADE'), primary_key=True)
    quantity = db.Column(db.Numeric(10, 2))
    unit = db.Column(db.String(50))
    
    # Relationships
    shopping_list = db.relationship("ShoppingList", back_populates="ingredients")
    ingredient = db.relationship("ShoppingListIngredient", back_populates="shopping_lists")

class RecipeContents(db.Model):
    __tablename__ = 'recipe_contents'
    
    recipeID = db.Column(db.Integer, db.ForeignKey('recipes.recipeID', ondelete='CASCADE'), primary_key=True)
    ingredientID = db.Column(db.Integer, db.ForeignKey('recipe_ingredients.ingredientID', ondelete='CASCADE'), primary_key=True)
    quantity = db.Column(db.Numeric(10, 2))
    unit = db.Column(db.String(50))
    notes = db.Column(db.Text)
    
    # Relationships
    recipe = db.relationship("Recipe", back_populates="ingredients")
    ingredient = db.relationship("RecipeIngredient", back_populates="recipes")

class Liked(db.Model):
    __tablename__ = 'liked'
    
    userID = db.Column(db.Integer, db.ForeignKey('users.userID', ondelete='CASCADE'), primary_key=True)
    recipeID = db.Column(db.Integer, db.ForeignKey('recipes.recipeID', ondelete='CASCADE'), primary_key=True)

class Disliked(db.Model):
    __tablename__ = 'disliked'
    
    userID = db.Column(db.Integer, db.ForeignKey('users.userID', ondelete='CASCADE'), primary_key=True)
    recipeID = db.Column(db.Integer, db.ForeignKey('recipes.recipeID', ondelete='CASCADE'), primary_key=True)

class MealInPlan(db.Model):
    __tablename__ = 'meal_in_plan'
    
    userID = db.Column(db.Integer, db.ForeignKey('users.userID', ondelete='CASCADE'), primary_key=True)
    recipeID = db.Column(db.Integer, db.ForeignKey('recipes.recipeID', ondelete='CASCADE'), primary_key=True)
    dayOfWeek = db.Column(Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 
                              name='days_of_week'), primary_key=True)
    
    # Relationships
    user = db.relationship("User", back_populates="meal_plans")
    recipe = db.relationship("Recipe", back_populates="meal_plans")