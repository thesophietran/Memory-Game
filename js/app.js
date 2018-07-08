/*
 * Create a list that holds all of your cards
 */
var deck = document.querySelector(".deck"); 
var cards = Array.from(document.querySelectorAll(".card"));

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 //Display all the symbols
//for (var i=0; i<cards.length; i++) {
//    cards[i].classList.remove("match");
//    cards[i].classList.add("open", "show");
//} 

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


var openCards = []; //should always have 2 cards only, for the sake of comparison 
var counter = 0; 
var matchFound = 0; 
var starsCount = 3; 

function displayCardSymbol(card) {
    //display the card's symbol
    card.classList.add("open", "show"); 
}

function addOpenCard(card) {
    if (openCards.length > 0) {
        if (openCards[0].getAttribute("id") !== card.getAttribute("id")) {
            openCards.push(card); 
        }
    } 
    else {
        openCards.push(card); 
    }
}

function cardMatch() {
    //if the cards do match, lock the cards in the open position
    console.log("MATCHED"); 
    openCards[1].classList.add("match");
    openCards[0].classList.add("match");   
    openCards.length = 0; 
}

function cardNotMatch() {
    //if the cards do not match, remove the cards from the list and hide the card's symbol
    console.log("NOT MATCHED");
    openCards[1].classList.add("wrong");
    openCards[0].classList.add("wrong");   
    setTimeout(function() {      
        openCards[1].classList.remove("open", "show", "wrong");
        openCards[0].classList.remove("open", "show", "wrong"); 
        openCards.length = 0; 
    }, 500);   
}

function numPairs() {
    //track the number of card pairs
    matchFound += 1; 
    console.log(counter); 
}

var modal = document.querySelector("#modal");

function allCardMatch() {
    //if all cards have matched, display a message with the final score 
    modal.style.display = "block"; 
    console.log("Congratulations! You won!"); 
    console.log("With " + counter + " Moves and " + starRating() + " Stars" );
    console.log("Woooooo!");
}

var stars = document.querySelectorAll(".fa-star");
function starRating() {
    //star rating that reflects the player's performance
    if (counter <= 20) {
        starsCount = 3;
    }
    else if (counter > 20 && counter <= 40) {
        starsCount = 2; 
        stars[2].classList.replace("fa-star", "fa-star-o"); 
    }
    else {
        starsCount = 1; 
        stars[1].classList.replace("fa-star", "fa-star-o"); 
        stars[2].classList.replace("fa-star", "fa-star-o"); 
    }
    return starsCount; 
}

var moves = document.querySelector(".moves"); 
function displayMoves() {
    //display the current number of moves a user has made
    moves.textContent = counter; 
}

//set countup timer. Learn from stackoverflow: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function pad(val) { 
    //conditional (ternary) operator 
    return val > 9 ? val : "0" + val; //condition ? expr1 : expr2 
}

var intervalID;
var sec = 0;
function startTime() {
    intervalID = setInterval(function() {
        document.getElementById("seconds").innerHTML = pad(++sec%60); //display sec%60, incremented by every 1s
        document.getElementById("minutes").innerHTML = pad(parseInt(sec/60, 10)); //convert secs to mins
    }, 1000);
}

function restartTime() {
    sec = 0;
    clearInterval(intervalID); 
    startTime(); 
}

function restartMoves() {
    counter = 0; 
    displayMoves(); 
}

function restartStars() {
    starsCount = 3; 
    for (var i=0; i<stars.length; i++) {
        stars[i].classList.remove("fa-star", "fa-star-o");
        stars[i].classList.add("fa-star"); 
    }
}

function restartBoard() {
    //Remove all cards from deck
    cards.forEach(function(element) {
    deck.removeChild(element);
    })
    //Shuffle cards
    shuffle(cards);
    //Append symbols to cards
    cards.forEach(function(element, index) {
        element.setAttribute("id", index); 
        deck.appendChild(element); 
    })
    //Hide all cards
    for (var i=0; i<cards.length; i++) {
        cards[i].classList.remove("match", "open", "show");
    }
}

function gameStart() {
    restartMoves(); 
    restartStars(); 
    restartBoard(); 
    restartTime(); 
    matchFound = 0; 
}

//ADD EVENT LISTENER FOR EACH CARD CLICKED

for (var i=0; i<cards.length; i++) {
    cards[i].addEventListener("click", function() { 
        displayCardSymbol(this); 
        addOpenCard(this);
        counter += 1; 
        starRating(); 
        displayMoves(); 
        //if openCards already has a DIFFERENT card, check to see if the two cards match
        if (openCards.length > 1) {
            if (openCards[1].lastElementChild.className == openCards[0].lastElementChild.className) {
                cardMatch();
                numPairs(); 
            }
            else {
                cardNotMatch();  
            }
        }
        if (matchFound == 8) {
            allCardMatch(); 
        }
    })
}

//RESTART BUTTON
var restartBtn = document.querySelector(".restart"); 
restartBtn.addEventListener("click", function() {
    gameStart(); 
    restartTime(); 
})

//WHEN BROWSER OPEN
gameStart(); 