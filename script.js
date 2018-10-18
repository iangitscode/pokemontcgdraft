const N = 3
const BASEURL = "https://api.pokemontcg.io/v1/"
let sets;
let currentChoices;
let preloaded;
let allSelectedCards = [];
const cardObservable = new Rx.Subject();

function getCardSlot(index) {
	switch (index) {
		case 0:
			return "cardone";
		case 1:
			return "cardtwo";
		case 2:
			return "cardthree";
	}
}

/*
 * Sends an HTTP request and sends the response to cardObservable
 */
function makeAsyncRequest(requestUrl) {
	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = () => {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			cardObservable.next(JSON.parse(xmlHttp.responseText));
		} else if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
			pickRandomCard();
		}
	}
	xmlHttp.open("GET", requestUrl, true);
	xmlHttp.send(null);
}

function pickRandomCard() {
	let set = sets[Math.floor(Math.random() * sets.length)];
	let setSize = set.totalCards;
	let cardInSet = Math.floor(Math.random() * setSize) + 1
	let setCode = set.code;
	let request = BASEURL + "cards/" + setCode + "-" + cardInSet;
	makeAsyncRequest(request);
}

/*
 * 
 */
function pickRandomCards() {
	for (let i = 0; i < N; i++) {
		pickRandomCard();
	}
}

function drawImages() {
	for (let i = 0; i < N; i++) {
		document.getElementById(getCardSlot(i)).style.backgroundImage = "url(" + currentChoices[i].card.imageUrl + ")";
	}
}

function getNewCards() {
	if (preloaded == undefined) {
		pickRandomCards();
	}
	currentChoices = preloaded;
	pickRandomCards();
	drawImages();
}

/*
 * Called when the user clicks on a card
 */
function selectCard(index) {
	if (index < currentChoices.length) {
		addToSelected(currentChoices[index]);
	} else {
		console.error("Card selection choice out of range!");
	}
}

function addToSelected(card) {
	allSelectedCards.push(card);

	let container = document.getElementById("selectedContainer");
	let elem = document.createElement("div");
	elem.classList.add("selectedCard");
	elem.style.backgroundImage = "url(" + card.card.imageUrl + ")";
	container.appendChild(elem);
}

document.addEventListener('DOMContentLoaded', () => {
    // Set up observable listening for cards
	cardObservable.bufferCount(N).subscribe((cards) => {
		if (currentChoices == undefined) {
			currentChoices = cards;
			drawImages();
		} else {
			preloaded = cards;
			for (let i = 0; i < N; i++) {
				document.getElementsByClassName("preload")[i].style.backgroundImage = "url(" + preloaded[i].card.imageUrl + ")";
			}
		}
	});

	// Get list of all sets
	getSetsHttp = new XMLHttpRequest();
	getSetsHttp.onreadystatechange = () => {
		if (getSetsHttp.readyState == 4 && getSetsHttp.status == 200) {
			sets = JSON.parse(getSetsHttp.responseText).sets;
			// Actual cards that are picked
			pickRandomCards();
			// Preload the next cards
			pickRandomCards();
		}
	}
	getSetsHttp.open("GET", BASEURL + "sets/", true);
	getSetsHttp.send(null);

	for (let i = 0; i < 3; i++) {
		document.getElementById(getCardSlot(i)).addEventListener("click", () => {
			selectCard(i);
			getNewCards();
		});
	}
}, false);

