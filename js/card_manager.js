function Card(title, notes, dateAdded, dateUpdated) {
    this.title = title;
    this.notes = notes;
    this.dateAdded = dateAdded;
    this.dateUpdated = dateUpdated;
    this.total = 1;
}

function Card(title, notes, dateAdded, dateUpdated, total) {
    this.title = title;
    this.notes = notes;
    this.dateAdded = dateAdded;
    this.dateUpdated = dateUpdated;
    this.total = total;
}

Card.prototype.sameName = function (title) {
    if (this.title === title)
        return true;
    return false
}


var getCards = function () {
    if (!checkStorage())
        return [];

    var cards = JSON.parse(localStorage.getItem("CARDS_STORED"));
    if (!cards) {
        console.log("No cards stored found. Returning empty array");
        return [];
    }
    return cards;
}

var saveCards = function (cards) {
    if (!checkStorage()) {
        console.error("Cannot save data!");
        return;
    }
    var JSONObj = getCardsJSON(cards);
    localStorage.setItem("CARDS_STORED", JSONObj);
}

var getCardsJSON = function (cards) {
    return JSON.stringify(cards);
}

var formatDate = function(date){
    return ((date.getDate() < 10) ? "0" + date.getDate() : date.getDate()) +
    "/" + (((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
    "/" + date.getFullYear();
}

var createCard = function (title, notes) {
    // cause im lazy and dont wanna fix the json function for dates zzzz
    var formattedDate = formatDate(new Date());
    return new Card(title, notes, formattedDate, formattedDate, 1);
}

var checkIfExists = function (cards, title) {

    console.log("No cards with title " + title + " already stored");
}