/* 
learnMoreContainer.js
Description: Provides a learn more container for the recipes that show more of 
the recipe input when the learn more container is accessed. Used on the main page, liked page
and meal planner page. 
Date: November 20th, 2024
Inital Author: Will Marceau
Modified By: 
*/

import React from 'react'
import LearnMore from '../components/learnMore'
import Swal from 'sweetalert2'
import wallyWale from '../assets/wally_wale.jpg'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function LearnMoreContainer({ cname, data }) {
    // this function holds the logic for the learn more button and the html
    // for the learn more component

    const fullImagePath = data.image_path ? `${BACKEND_URL}/${data.image_path}` : wallyWale;
    const ingredientList = Array.isArray(data.ingredients) ? data.ingredients.map((item) => `<li>${item}</li>`).join('') : '<li>No ingredients</li>';
    

    const clickHandler = () => {
        // this funciton fires the learn more alert with all of the recipes data populated
        Swal.fire({
            title: data.recipe_name,
            html: 
            `<div>
                <div class="alertFrameContainer">
                    <div class="alertPhotoFrame">
                        <img src=${fullImagePath} class="alertPhoto" />
                    </div>
                </div>
                <div class="timeContainer">
                    <h5 class="alertTime">Cook Time: ${data.cook_time}</h5>
                    <h5 class="alertTime">Total Time: ${data.total_time}</h5>
                    <h5 class="alertTime">Prep Time: ${data.prep_time}</h5>
                </div>
                <div class="detailsContainer">
                    <h5 class="alertDetails">Servings: ${data.servings}</h5>
                    <h5 class="alertDetails">Cuisine: ${data.cuisine}</h5>
                </div>
                <h4>Ingredients</h4>
                <ul class="ingredientsList">
                    ${ingredientList}
                </ul>
                <h4>Directions</h4>
                <ol>
                    ${data.instructions}
                </ol>
            </div>
            `,
            text: 'Recipe information',
            icon: 'info',
            iconColor: '#4A7B32',
            confirmButtonText: 'Close',
            customClass: {
                confirmButton: 'custom-close-button',
                popup: 'customAlert',
            }
        });
    }

    return (
        <LearnMore onClick={clickHandler} cname={cname} />
    )
}

export default LearnMoreContainer;