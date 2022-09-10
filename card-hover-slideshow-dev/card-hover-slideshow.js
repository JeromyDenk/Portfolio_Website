//TEST
//Hide card main image on hover and display secondary image.

//Wait for page to load
window.onload = function(){
    // Projects container element
    const cards = document.querySelectorAll(".card")

    cards.forEach(card => {

        // Hover Event Listener
        card.addEventListener('mouseenter', function(e) {
            
            // Do stuff
            coverImg = e.target.querySelector(".card-img-top");
            slideImgs = e.target.querySelectorAll(".preview-img")

            slideImgs.forEach(img => {
                img.removeAttribute("style","display:none;");
            })
            coverImg.setAttribute("style","display:none;")

            console.log("Hovering over: " + e.target.innerText);
            /* 
            Wishlist:
            - display: none - for cover image
            - start slideshow 
             */


        })

        // Unhover Event Listener
        card.addEventListener('mouseleave', function(e) {
            coverImg = e.target.querySelector(".card-img-top");
            slideImgs = e.target.querySelectorAll(".preview-img")

            slideImgs.forEach(img => {
                img.setAttribute("style","display:none;");
            })
            coverImg.removeAttribute("style","display:none;")

            console.log("Left: " + e.target.innerText);
            /* 
            Wishlist:
            - end slideshow
            - display: yes - for cover image
            */
        })

    })




    //Test Clicker
    // projects.addEventListener("click", function(e) {
    //     var card

    //     //If card div clicked
    //     if (e.target && e.target.classList.contains("card")) {
    //         card = e.target;
    //     }
    //     // If image or text clicked
    //     else if (e.target && e.target.parentElement.classList.contains("card")) {
    //         card = e.target.parentElement;
    //     }
    //     else {
    //         card=null;
    //     }

    //     //Log it
    //     if (card) {
    //         console.log(card.outerText);
    //     }

    // })

    // // Hover/Mouseover Event
    // projects.addEventListener("mouseover", function(e) {
    //     var card

    //     //If card div clicked
    //     if (e.target && e.target.classList.contains("card")) {
    //         card = e.target;
    //     }
    //     // If image or text clicked
    //     else if (e.target && e.target.parentElement.classList.contains("card")) {
    //         card = e.target.parentElement;
    //     }
    //     else {
    //         card=null;
    //     }

    //     // Do something
    //     if (card){
    //         console.log("Hovering over: " + card.innerText)
    //     }
    // })

    // // Unhover/Mouseout Event
    // projects.addEventListener("mouseout", function(e) {
    //     var card

    //     //If card div clicked
    //     if (e.target && e.target.classList.contains("card")) {
    //         card = e.target;
    //     }
    //     // If image or text clicked
    //     else if (e.target && e.target.parentElement.classList.contains("card")) {
    //         card = e.target.parentElement;
    //     }
    //     else {
    //         card=null;
    //     }
    // })
}

let hoverEvent = function(e) {
    let coverImg = e.querySelector(".card-img-top")
    coverImg.style.display = "none";
}

let unHoverEvent = function(e) {

}