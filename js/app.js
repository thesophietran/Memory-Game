var cards = Array.from(document.querySelectorAll(".card")); // convert from NodeList to Array
var deck = document.querySelector(".deck"); 
var moves = document.querySelector(".moves"); 
var stars = document.querySelectorAll(".fa-star");
var restartBtn = document.querySelector(".restart"); 
var starsCount = 3; 
var counter = 0; 
var matchFound = 0; 
var openCards = []; //should always have 2 cards only, for the sake of comparison 
var sec = 0;
var intervalID;

// // Display all the cards
// for (var i=0; i<cards.length; i++) {
//    cards[i].classList.remove("match");
//    cards[i].classList.add("open", "show");
// } 

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

function displayCardSymbol(card) {
    // display all the cards with their symbols
    card.classList.add("open", "show"); 
}

function addOpenCard(card) {
    // add different cards to openCards array
    if (openCards.length > 0) {
        if (openCards[0].getAttribute("id") !== card.getAttribute("id")) {
            // if the card is different from the card already in the array
            openCards.push(card); 
        }
    } 
    else {
        // if the array is empty
        openCards.push(card); 
    }
}

function cardMatch() {
    // if the cards do match, lock the cards in the open position
    // console.log("MATCHED"); 
    openCards[1].classList.add("match");
    openCards[0].classList.add("match");   
    openCards.length = 0; // empty openCards
}

function cardNotMatch() {
    // if the cards do not match, remove the cards from the list and hide the card's symbol
    // console.log("NOT MATCHED");
    openCards[1].classList.add("wrong"); // turn the wrong pair to red 
    openCards[0].classList.add("wrong"); // turn the wrong pair to red 
    setTimeout(function() {      
        openCards[1].classList.remove("open", "show", "wrong");
        openCards[0].classList.remove("open", "show", "wrong"); 
        openCards.length = 0; 
    }, 450);   
}

function numPairs() {
    // track the number of card pairs matched
    matchFound += 1; 
    console.log(counter); 
}

// var modal = document.querySelector("#modal");

function allCardMatch() {
    // if all cards have matched, display a message with the final score 
    // modal.style.display = "block"; 
    console.log("Congratulations! You won!"); 
    console.log("With " + counter + " Moves and " + starRating() + " Stars" );
    console.log("Woooooo!");
}


function starRating() {
    // star rating that reflects the player's performance
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


function displayMoves() {
    // display the current number of moves a user has made
    moves.textContent = counter; 
}

// Countup timer from stackoverflow: https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function pad(val) { 
    //conditional (ternary) operator 
    return val > 9 ? val : "0" + val; //condition ? expr1 : expr2 
}

function timing() {
    // start timing 
    sec = 0;
    clearInterval(intervalID); // clear the previous timer before running a new one
    intervalID = setInterval(function() {
        document.getElementById("second").textContent = pad(++sec%60); //display sec%60, incremented by every 1s
        document.getElementById("minute").textContent = pad(parseInt(sec/60, 10)); //convert secs to mins
    }, 1000);
}

function resetTimer() {
    // reset Timer to default 00:00 and stand still
    sec = 0;
    document.getElementById("second").textContent = "00";
    document.getElementById("minute").textContent = "00"; 
    clearInterval(intervalID);
}

function resetMoves() {
    // reset Moves to default 0
    counter = 0; 
    displayMoves(); 
}

function resetStars() {
    // reset Stars to default 3 
    starsCount = 3; 
    for (var i=0; i<stars.length; i++) {
        stars[i].classList.remove("fa-star", "fa-star-o");
        stars[i].classList.add("fa-star"); 
    }
}

function resetBoard() {
    // Remove all cards from deck
    cards.forEach(function(element) {
        deck.removeChild(element);
    })

    // Shuffle cards
    shuffle(cards);

    // Append cards to deck
    cards.forEach(function(element, index) {
        element.setAttribute("id", "card" + index); // add an Id to each card: "card1", "card2", "card3"...
        deck.appendChild(element); 
    })

    // Hide all cards
    for (var i=0; i<cards.length; i++) {
        cards[i].classList.remove("match", "open", "show");
    }
}

function resetMatch() {
    matchFound = 0;
}

function resetOpenCards() {
    openCards.length = 0; 
}

function init() {
    // Initiate game board
    resetTimer(); 
    resetMoves(); 
    resetStars(); 
    resetBoard(); 
    resetMatch();
    resetOpenCards(); 
}

// ADD EVENT LISTENER FOR EACH CARD CLICKED
for (var i=0; i<cards.length; i++) {
    cards[i].addEventListener("click", function() { 
        // start timer 
        counter += 1; 
        if (counter === 1) {
           timing(); 
        }
         
        // update Star Rating and Moves, and flip cards
        starRating(); 
        displayMoves(); 
        displayCardSymbol(this);
        
        // add different cards to openCards array
        addOpenCard(this);
        // check whether the two cards match
        if (openCards.length > 1) {
            if (openCards[1].lastElementChild.className == openCards[0].lastElementChild.className) {
                cardMatch();
                numPairs(); 
            }
            else {
                cardNotMatch();  
            }
        }

        // check if the player has found all the pairs
        if (matchFound === 8) {
            allCardMatch(); 
        }
    })
}


// RESTART BUTTON
restartBtn.addEventListener("click", function() {
    init(); 
})

// WHEN BROWSER OPEN
init(); 