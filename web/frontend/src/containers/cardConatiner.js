import React, { useState, useRef, useEffect } from 'react'
import RecipeCard from '../components/card';
import TinderCard from 'react-tinder-card'
import SwipingButton from '../components/swipingButtons';
import {useAuth} from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function RecipeCardContainer({ toggle, homeData, setGenerate }) {

    const {user} = useAuth();
    const [index, setIndex] = useState(1);
    const cardRef = useRef(null);
    const [swiping, setSwiping] = useState(false);
    //const [data, setData] = useState(homeData);
    const [swipe, setSwipe] = useState('');
    //const [action, setAction] = useState('');
    const [error, setError] = useState('');


    const onSwipe = (direction) => {
        //cardRef.current.style.transitionDuration = '0.3s';
        if (!swiping) {
            setSwiping(true)
            if (direction === 'left') {
                setSwipe('left')
                handleSubmit("dislike") // Pass 'dislike' as the action to handleSubmit
            }
            else if (direction === 'right') {
                setSwipe('right')
                handleSubmit("add") // Pass 'dislike' as the action to handleSubmit
                console.log("adding to meal plan")
            }
            else if (direction === 'down') {
                handleSubmit("pass"); // Pass 'dislike' as the action to handleSubmit
                setSwipe('down')
                console.log("Passing on Card")
            }
        }
    }

    const onCardLeftScreen = (direction) => {
        setGenerate(true);
        setSwiping(false)
        setIndex((prev)=> {
            return prev + 1;
        })
    }

    const swipeLeft = () => {
        if (cardRef.current) {
            cardRef.current.swipe('left')
        }
    }

    const swipeDown = () => {
        if (cardRef.current) {
            cardRef.current.swipe('down')
        }
    }

    const swipeRight = () => {
        if (cardRef.current) {
            cardRef.current.swipe('right')
        }
    }

    const handleSubmit = async (action) => {
        
        try {
            console.log("Sending request to backend");
            const response = await fetch(`${BACKEND_URL}/sendNewRecipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_action: action, recipe_id: homeData.recipeID, user_id: user.userID }),
            });
    
            // Check if response is okay before parsing JSON
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Action failed');
            }
    
            // Parse response JSON if the request was successful
            const responseData = await response.json();
            console.log("Response data:", responseData);


        } catch (err) {
            setError(err.message);
        }
    };


    
    return (
        <div>
            <div className="cardContainer">
            {homeData ? (
            <TinderCard ref={cardRef} key={index} onSwipe={onSwipe} onCardLeftScreen={onCardLeftScreen} flickOnSwipe={true} preventSwipe={swiping ? ['up', 'left', 'right', 'down'] : ['up']} swipeRequirementType='velocity' swipeThreshold={1.60} className={`card ${swiping ? 'card-swiping' : ''} ${toggle ? 'toggled' : ''}`}>
                <RecipeCard user={user} title={homeData.recipe_name} data = {homeData} cookTime={`Cook Time: ${homeData.cook_time}`} prepTime={`Prep Time: ${homeData.prep_time}`} servings={`servings: ${homeData.servings}`} cuisine={`Cuisine: ${homeData.cuisine}`} image_path={homeData.image_path} toggle={toggle} />
            </TinderCard>
            ) : (<div>
                    loading...
                 </div>)}
            </div>
            <div className="swipeButtonContainer">
                <SwipingButton clickHandler={swipeLeft} swiping={swiping} text="Dislike" cname="dislike"/>
                <SwipingButton clickHandler={swipeDown} swiping={swiping} text="Pass" cname="pass" />
                <SwipingButton clickHandler={swipeRight} swiping={swiping} text="Add" cname="addHome" />
            </div>
        </div>
    );
}

export default RecipeCardContainer; 