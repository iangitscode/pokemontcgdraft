
const baseurl = "https://api.pokemontcg.io/v1/"
let sets;

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
 * Sends an HTTP request and returns a promise that resolves when the response is received
 */
function makeAsyncRequest(requestUrl) {
	let xmlHttp = new XMLHttpRequest();
	return new Promise((resolve, reject) => {
  		xmlHttp.onreadystatechange = (response) => {
  			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            	resolve(xmlHttp.responseText);
  			}
  		}
    	xmlHttp.open("GET", requestUrl, true);
    	xmlHttp.send(null);
	});
}

/*
 * Returns a promise for the raw data for a card
 */

function pickRandomCard() {
	let set = sets[Math.floor(Math.random() * sets.length)];
	let setSize = set.totalCards;
	let cardInSet = Math.floor(Math.random() * setSize) + 1
	let setCode = set.code;
	let request = baseurl + "cards/" + setCode + "-" + cardInSet;
	return makeAsyncRequest(request);
}

function getThreeCards() {
	let a = pickRandomCard();
	let b = pickRandomCard();
	let c = pickRandomCard();
	Promise.all([a,b,c]).then((values) => {
		console.log("HI")
		for (let index in values) {
			let obj = JSON.parse(values[index]);
			console.log(obj);
			// document.getElementById(getCardSlot(index)).style.backgroundImage = "url(" + obj.
		}
	});
}

// Get list of all sets
Rx.Observable.fromPromise(makeAsyncRequest(baseurl + "sets/")).subscribe((data) => {
	sets = JSON.parse(data).sets;
});

