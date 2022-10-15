//TEST
//Hide card main image on hover and display secondary image.

//Wait for page to load
window.onload = function(){

    // Get all card elements
    const cards = document.querySelectorAll(".slideshow")

    var slideshows = {} // stores slideshow objects

    // Slideshow properties
    var property = {
        aspectRatio: 1.78,
        interval: 800, // time each image on screen (ms) 1400
        animDuration: 800,  // (ms) 900
        easing: easingInOutQuad // easing between slides
    }
    
    // Create slideshow objects for each card
    for (let i = 0; i < cards.length; i++ ) {

        cards[i].style.height = getSlideshowHeight(cards[i],property.aspectRatio) + "px";

        slideshows[i] = new Slideshow(cards[i], property);  // Construct slideshow objects
        slideshows[i].init();   // Initialize slideshow objects
    }

    // Add Window Event Listener
    window.addEventListener("resize", function(e){
        // Resize everything
        for (let i = 0; i < cards.length; i++ ) {
            slideshows[i].resizeSlideshow();
        }
    }.bind(this),false);
}

// Slideshow class
class Slideshow {
    constructor(element, property) {
        this.cardElem = element;
        this.images = element.querySelectorAll("img");
        this.canvasBox = document.createElement("div");  // create canvas element
        this.canvasArray = []   // canvas array ??
        this.progress = 0;      // transition progress (0-1)
        this.mouseHover = false;
        this.slideShowActive = false;
        this.animating = false;
        this.left = false;
        this.interval = property.interval;
        this.duration = property.animDuration;
        this.easing = property.easing;
        this.ratio = property.aspectRatio;
        
        // Append canvasBox to card element
        this.cardElem.appendChild(this.canvasBox);
        this.canvasBox.classList.add("canvas");
    }

    init() {
        // Setup canvas
        this.settingStyle();                        // setup canvas div
        this.settingCanvas();                       // setup canvases
        this.render(this.progress, -this.width);    // initial render

        // Create event listeners
        // Mouse-Enter Event Listener - every time mouseenter, function is called
        this.cardElem.addEventListener("mouseenter", function(e){

            // If not currently animating, do the slideshow,
            if (this.animating == false) {
                this.mouseHover = true;
                this.slideShowActive = true;
                this.slide();
            }
            // else, wait to get back to 
            else {
                // debugger;
            }
        }.bind(this),false);

        // Mouse-Leave Event Listener
        this.cardElem.addEventListener("mouseleave", function(e){
            this.mouseHover = false;
            this.slideShowActive = false;

            clearTimeout(this.timer);
            if (this.animating == false){

                // See if current image is first image
                var firstEle = this.canvasArray[0];
                var coverSlide = this.canvasArray.find(function(e){
                    return e.image.classList.contains('card-img-top')
                })               
                
                // If 0th element in canvas array is the cover image
                if (firstEle.image.classList.contains('card-img-top') == true) {
                    this.resetSlideshow();
                }
                else {
                    this.left = true;
                    
                    var firstEle = this.canvasArray[0];
                    var coverSlide = this.canvasArray.find(function(e){
                        return e.image.classList.contains('card-img-top')
                    })
                    this.canvasArray = [firstEle,coverSlide];

                    this.slide();
                }
            }
        }.bind(this),false);
    }

    // Determine dimensions of first image in card
    settingStyle() {    
        this.width = this.cardElem.offsetWidth;   // width of card div
        this.change = this.width;                  // transition change in X
        this.height = this.cardElem.offsetHeight; // height of card div

        // Make canvasbox same dimensions as first image
        this.canvasBox.style.height = this.height + "px";
        this.canvasBox.style.width = this.width + "px";
    }

    settingCanvas() {
        var canvas, context, image;

        // create a canvas for each image
        for (var i = 0, len = this.images.length ; i < len; i++) {  // this.images.length * 2 - why??
            canvas = document.createElement("canvas");
            this.canvasBox.appendChild(canvas); // place canvas into the canvasBox created earlier
            context = canvas.getContext("2d")   // CanvasRenderingContext2D - used for drawing shapes, text, images, etc

            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.width = this.width + "px";
            canvas.style.height = this.height + "px"; // ?? not sure about this

            // Add images into canvasArray
            image = this.images[i];
            this.canvasArray.push({
                canvas: canvas, context: context, image: image
            });
        }
    }

    resizeSlideshow() {
        // console.log(this.cardElem.offsetWidth);
        this.width = this.cardElem.offsetWidth;
        this.height = this.width / this.ratio;
        
        //getSlideshowHeight(this.cardElem,this.ratio);
        this.cardElem.style.removeProperty('height');
        // this.cardElem.style.height = this.height;

        //console.log(this.width/this.height);
        console.log(this.cardElem.style.height);

        // Make canvasbox same dimensions as first image
        this.canvasBox.style.height = this.height + "px";
        this.canvasBox.style.width = this.width + "px";

        // Resize the canvases
        for (var i = 0, len = this.canvasArray.length ; i < len; i++) {

            this.canvasArray[i].canvas.width = this.width;
            this.canvasArray[i].canvas.height = this.height;

            this.canvasArray[i].canvas.style.width = this.width + "px";
            this.canvasArray[i].canvas.style.height = this.height + "px";

        }

        // Change the change 
        if (this.change > 0) {
            this.change = this.width;
        }
        else {
            this.change = -this.width;
        }

        if (this.animating == false)
        {
            this.render(this.progress, -this.width);    
        }


        // If not animating, render it?

    }
    
    slide(){
        // Called by: setTimeout() and update()
        var startTime = new Date();     //start of transition
        var duration = this.duration;   //duration of transition

        this.progress = 0;  //
        this.animating = true;

        // Left or right transition
        var change = this.change;
        //if (this.left == true)
        if (this.slideShowActive == false)
        {
            this.left = true;
            this.render();
            this.update(startTime, -this.change, duration);
        }
        else
        {
            this.update(startTime, this.change, duration);
        }
    }

    update(startTime, change, duration) {
    // Called by: slide()
        var time = new Date() - startTime;  // elapsed time from start of transition

        // Transition
        if(time < duration){
            this.progress = this.easing(time / duration);//easingFunc(time / duration);
            this.render(this.progress, change);
            requestAnimationFrame(this.update.bind(this, startTime, change, duration, this.easing)); //formerly easingFunc
        }
        // Just finished transitioning. 
        else {
            this.progress = 1;
            this.animating = false;
            time = duration;

            //console.log(this.canvasArray);  // everything is as it should be
            if (this.slideShowActive == true){
                // Shuffling
                var firstEle = this.canvasArray[0];
                this.canvasArray.shift();
                this.canvasArray.push(firstEle);
                this.render(0, this.width);

                // Keep going
                this.timer = setTimeout(this.slide.bind(this), this.interval);
            }
            else    
            {
                // -------------------------------
                
                if (this.left == false)
                // we just got here during a slide?
                {  
                    var firstEle = this.canvasArray[1];
                    var coverSlide = this.canvasArray.find(function(e){
                        return e.image.classList.contains('card-img-top')
                    })

                    // If we just landed on the cover image, reset the slideshow
                    if (firstEle.image.classList.contains('card-img-top') == true) {
                        this.resetSlideshow();
                    }
                    // Else, do the slidey thing, then reset the slideshow
                    else {
                        this.canvasArray = [firstEle,coverSlide];
    
                        //this.canvasArray[1].canvas.style.border = 'solid';
                        this.render(0, this.width);
    
                        this.left = true;
                        this.slide();
                    }

                }
                else
                {
                    this.resetSlideshow();
                };
            };
        }
    }

    render(progress, position) {
        // progress (0->1) is the transition
        // position is how far to the right the images should move
        for(var i = 0, len = this.canvasArray.length; i < len; i++) {
            var canvas = this.canvasArray[i].canvas;
            var xTrans = progress * position - (i * position);
            canvas.style.setProperty("-webkit-transform", "translate(" + (xTrans)  + "px, 0)");
            canvas.style.transform = "translate(" + (xTrans)  + "px, 0)";
            var context = this.canvasArray[i].context;
            context.clearRect(0, 0, this.width, this.height);
            context.globalCompositeOperation = "source-over";
            context.drawImage(this.canvasArray[i].image, 0, 0, this.width, this.height);
        }
    }

    resetSlideshow() {
        this.progress = 0;
        this.mouseHover = false;
        this.slideShowActive = false;
        this.animating = false;
        this.left = false;

        // Reset Canvas Array
        this.canvasArray = []

        // Remove canvases from DOM (since they are out of order)
        this.canvasBox.replaceChildren();

        // Repopulate Canvas Array
        this.settingCanvas();

        // initial render
        this.render(this.progress, -this.width);    
    }
}

// Easing Function
function easingInOutQuad(t){
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; 
}

// Slideshow Div height
function getSlideshowHeight(elem,ratio) {
    var width = elem.offsetWidth;
    var height = width / ratio;
    
    return height;
}
