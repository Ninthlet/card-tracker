/*
If for whatever reason you find this code.
I just want to say that I never used angular and usually I keep my code organized.
This time I just chose to let Jesus take the keyboard.
Godspeed random code inspector.
*/

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

app.controller("card-controller", function ($scope) {
    // Here we only need to check newly added fields since the first commit
    $scope.integrityCheck = function () {
        for (var i = 0; i < $scope.cards.length; i++) {
            if (!$scope.cards[i].total || $scope.cards[i].total === undefined) {
                $scope.cards[i].total = 1;
            }
            if (!$scope.cards[i].dateUpdated || $scope.cards[i].dateUpdated === undefined) {
                $scope.cards[i].dateUpdated = formatDate(new Date());
            }
        }
        saveCards($scope.cards);
    }
    $scope.generateIndex = function () {
        indexedCards = [];
        for (var i = 0; i < $scope.cards.length; i++) {
            indexedCards.push($scope.cards[i].title.toLowerCase());
        }
        console.log("Generated index for cards");
        saveCards($scope.cards);
    }
    $scope.cardExistsWarning = false;
    $scope.ncDate = new Date();
    $scope.ncTitle = '';
    $scope.ncNotes = '';
    $scope.cards = getCards();
    $scope.integrityCheck();
    $scope.generateIndex();
    $scope.jumbotronShow = function () {
        if ($scope.cards.length == 0) {
            $('#noCards').show();
        }
        else {
            $('#noCards').hide();
        }
    }
    $scope.addCard = function () {
        var card = createCard($scope.ncTitle, $scope.ncNotes, $scope.ncDate, $scope.ncDate);
        var isUnique = true;
        if ($scope.cards.length != 0) {
            for (var i = 0; i < $scope.cards.length; i++) {
                if (card.sameName($scope.cards[i].title)) {
                    if (!$scope.cardExistsWarning) {
                        $scope.cardExistsWarning = true;
                        $('#cardDuplicateWarning').show();
                    } else {
                        $('#cardDuplicateWarning').hide();
                        $scope.cardExistsWarning = false;
                        $scope.cards[i].dateUpdated = card.dateUpdated;
                        $scope.cards[i].total += 1;
                    }
                    isUnique = false;
                    break;
                }
            }
        }
        if (isUnique) {
            indexedCards.push(card.title);
            $scope.cards.push(card);
        }
        $scope.jumbotronShow();
        saveCards($scope.cards);
    }

    $scope.searchResults = [];
    $scope.searchCard = function () {
        $scope.searchResult = [];
        if ($scope.searching === '') {
            $scope.searchResults = [];
        } else {
            var expr = new RegExp($scope.searching.toLowerCase());
            for (var i = 0; i < $scope.cards.length; i++) {
                if (expr.test($scope.cards[i].title.toLowerCase())) {
                    $scope.searchResults.push($scope.cards[i]);
                    $('#searchResult').collapse('show');
                } else {
                    $scope.searchResults.splice(i);
                }
            }
        }
        if ($scope.searchResults.length === 0) {
            $('#searchResult').collapse('hide');
        }
    }

});