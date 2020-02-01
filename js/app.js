var app = angular.module("card-container", []);

var checkStorage = function () {
    if (typeof (Storage) !== "undefined") {
        return true;
    } else {
        console.error("No storage available");
        $('#dataErrorAlert').show();
        return false;
    }
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
    console.log("Saved cards. Object: " + JSONObj);
}

var getCardsJSON = function (cards) {
    return JSON.stringify(cards);
}

var createCard = function (title, notes, date) {
    // cause im lazy and dont wanna fix the json function for dates zzzz
    var formattedDateAdded = ((date.getDate() < 10) ? "0" + date.getDate() : date.getDate()) +
        "/" + (((date.getMonth() + 1) < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) +
        "/" + date.getFullYear();
    return {
        title: title,
        notes: notes,
        dateAdded: formattedDateAdded
    };
}

app.controller("card-controller", function ($scope) {
    $scope.ncDate = new Date();
    $scope.ncTitle = '';
    $scope.ncNotes = '';
    $scope.cards = getCards();
    $scope.jumbotronShow = function () {
        if ($scope.cards.length == 0) {
            $('#noCards').show();
        }
        else {
            $('#noCards').hide();
        }
    }
    $scope.addCard = function () {
        var card = createCard($scope.ncTitle, $scope.ncNotes, $scope.ncDate);
        $scope.cards.push(card);
        $scope.jumbotronShow();
        saveCards($scope.cards);
    }
});