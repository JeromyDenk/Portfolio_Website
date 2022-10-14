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
        interval: 1800, // time each image on screen (ms) 1400
        animDuration: 1000,  // (ms) 900
        easing: easingInOutQuad // easing between slides
    }

    // Create slideshow objects for each card
    for (let i = 0; i < cards.length; i++ ) {

        cards[i].style.height = getSlideshowHeight(cards[i],property.aspectRatio) + "px";

        slideshows[i] = new Slideshow(cards[i], property);  // Construct slideshow objects
        slideshows[i].init();   // Initialize slideshow objects
    }
}

// Slideshow class
class Slideshow {
    constructor(element, property) {
        this.cardElem = element;
        this.images = element.querySelectorAll("img");
        this.canvasBox = document.createElement("div");  // create canvas element
        this.canvasArray = []   // canvas array ??
        this.progress = 0;      // ??
        this.mouseHover = false;
        this.animating = false;
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
        this.settingStyle();
        this.settingCanvas();

        // Create event listeners
        // Mouse-Enter Event Listener - every time mouseenter, function is called
        this.cardElem.addEventListener("mouseenter", function(e){
            this.mouseHover = true;
            // if(!this.animating){
            //     this.beginSlideshow();
            // }
        }.bind(this),false);

        // Mouse-Leave Event Listener
        this.cardElem.addEventListener("mouseleave", function(e){
            this.mouseHover = false;
            // if(this.animating){
            //     this.endSlideshow();
            // }
        }.bind(this),false);
    }

    // Determine dimensions of first image in card
    settingStyle() {    
        this.width = this.cardElem.offsetWidth; // width of card div
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

        this.render(this.progress, -this.width); // renders all images in canvases left of first image

        // Get into slide-update loop
        this.timer = setTimeout(this.slide.bind(this), this.interval);  //setTimeout calls slide f'n after interval times out, returns id of the timer

    }

    // beginSlideshow() {}
    // endSlideshow() {}
    
    slide(){
        // Called by: setTimeout() and update()

        var startTime = new Date();     //start of transition
        var duration = this.duration;   //duration of transition
        var easingFunc = this.easing;

        this.progress = 0;  //
        this.animating = true;
        this.update(startTime, duration, easingFunc);
    }

    update(startTime, duration, easingFunc) {
    // Called by: slide()
        var time = new Date() - startTime;  // elapsed time from start of transition

        if (this.mouseHover == false)
        {
            time = 0;
        }

        // update width and height
        this.width = this.cardElem.offsetWidth;
        this.height = getSlideshowHeight(this.cardElem,this.ratio);

        // Transition
        if(time < duration){
            this.progress = this.easing(time / duration);//easingFunc(time / duration);
            this.render(this.progress, this.width);
            requestAnimationFrame(this.update.bind(this, startTime, this.width, duration, this.easing)); //formerly easingFunc
        }
        // Done transitioning - 
        else {
            var firstEle = this.canvasArray[0];
            // take first element and put it at the end.
            this.canvasArray.shift();
            this.canvasArray.push(firstEle);
            this.progress = 1;
            this.animating = false;
            time = duration;
            this.render(0, this.width);
            this.timer = setTimeout(this.slide.bind(this), this.interval);
        }
    }

    render(progress, position) {
        // progress (0->1) is the transition
        // position is how far to the right the images should move
        //console.log(position);
        for(var i = 0, len = this.canvasArray.length; i < len; i++) {
            var canvas = this.canvasArray[i].canvas;
            var xTrans = progress * position + (-i * this.width)
            canvas.style.setProperty("-webkit-transform", "translate(" + (xTrans)  + "px, 0)");
            canvas.style.transform = "translate(" + (xTrans)  + "px, 0)";
            var context = this.canvasArray[i].context;
            context.clearRect(0, 0, this.width, this.height);
            context.globalCompositeOperation = "source-over";
            context.drawImage(this.canvasArray[i].image, 0, 0, this.width, this.height);
        }
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
