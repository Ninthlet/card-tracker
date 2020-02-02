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
    $scope.cardExistsWarning = false;
    $scope.ncDate = new Date();
    $scope.ncTitle = '';
    $scope.ncNotes = '';
    $scope.cards = getCards();
    $scope.integrityCheck();
    $scope.jumbotronShow = function () {
        if ($scope.cardsShow.length == 0) {
            $('#noCards').show();
        }
        else {
            $('#noCards').hide();
        }
    }
    $scope.addCard = function (modify) {
        var card = createCard($scope.ncTitle, $scope.ncNotes);
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
                        if (modify) {
                            $scope.cards[i].notes = card.notes;
                        } else {
                            $scope.cards[i].total += 1;
                        }
                        $scope.cards[i].dateUpdated = card.dateUpdated;
                        $('#collapseAddCard').collapse('hide');
                        $scope.ncTitle = '';
                        $scope.ncNotes = '';
                        $scope.ncDate = new Date();
                    }
                    isUnique = false;
                    break;
                }
            }
        }
        if (isUnique) {
            $scope.cards.push(card);
            $('#collapseAddCard').collapse('hide');
            $scope.ncTitle = '';
            $scope.ncNotes = '';
            $scope.ncDate = new Date();
        }
        $scope.jumbotronShow();
        saveCards($scope.cards);
    }

    $scope.searchResults = [];
    $scope.searchCard = function () {
        $scope.searchResults = [];
        if ($scope.searching !== '') {
            $scope.cardsShow = $scope.searchResults;
            var expr = new RegExp($scope.searching.toLowerCase());
            for (var i = 0; i < $scope.cards.length; i++) {
                if (expr.test($scope.cards[i].title.toLowerCase())) {
                    $scope.searchResults.push($scope.cards[i]);
                }
            }
        } else {
            $scope.cardsShow = $scope.cards;
        }
        $('#collapseAddCard').collapse('hide');
        $scope.jumbotronShow();
    }

    $scope.searchDetailResults = [];
    $scope.searchCardDetail = function () {
        $scope.searchDetailResults = [];
        if ($scope.searchingDetail !== '') {
            $scope.detailCards = $scope.searchDetailResults;
            var expr = new RegExp($scope.searchingDetail.toLowerCase());
            for (var i = 0; i < $scope.cards.length; i++) {
                if (expr.test($scope.cards[i].title.toLowerCase())) {
                    $scope.searchDetailResults.push($scope.cards[i]);
                }
            }
        } else {
            $scope.detailCards = $scope.cards;
        }
    }

    $scope.updateViews = function () {
        $scope.detailCards = $scope.cards;
        $scope.cardsShow = $scope.cards;
    }

    $scope.lastSort = 'name';
    $scope.sortBy = function (type, ascendent) {
        console.log("type: " + type + " ascendent? " + ascendent);
        if (type === 'sorting') {
            type = $scope.lastSort;
        }
        switch (type) {
            case 'name':
                if (ascendent === false) {
                    $scope.cards.sort(function (a, b) {
                        if (a.title > b.title)
                            return -1;
                        if (a.title < b.title)
                            return 1;
                        return 0;
                    });
                } else {
                    $scope.cards.sort(function (a, b) {
                        if (a.title < b.title)
                            return -1;
                        if (a.title > b.title)
                            return 1;
                        return 0;
                    });
                }
                break;
            case 'date':
                if (ascendent === false) {
                    $scope.cards.sort(function (a, b) {
                        if (a.dateAdded > b.dateAdded)
                            return -1;
                        if (a.dateAdded < b.dateAdded)
                            return 1;
                        return 0;
                    });
                } else {
                    $scope.cards.sort(function (a, b) {
                        if (a.dateAdded < b.dateAdded)
                            return -1;
                        if (a.dateAdded > b.dateAdded)
                            return 1;
                        return 0;
                    });
                }
                break;
            case 'update':
                if (ascendent === false) {
                    $scope.cards.sort(function (a, b) {
                        if (a.dateUpdated > b.dateUpdated)
                            return -1;
                        if (a.dateUpdated < b.dateUpdated)
                            return 1;
                        return 0;
                    });
                } else {
                    $scope.cards.sort(function (a, b) {
                        if (a.dateUpdated < b.dateUpdated)
                            return -1;
                        if (a.dateUpdated > b.dateUpdated)
                            return 1;
                        return 0;
                    });
                }
                break;
        }
        $scope.lastSort = type;

        $scope.detailCards = $scope.cards;
    }

    $scope.deleteCard = false;
    $scope.modifyCard = function (index, title, notes, total, deleteConfirm) {
        if (deleteConfirm === true && $scope.deleteCard === false) {
            $('#confirmDeleteCard' + index).show();
            $scope.deleteCard = true;
            return;
        }
        if ($scope.deleteCard === true) {
            $('#headingToDelete' + index).empty();
            $('#headingToDelete' + index).remove();
            $scope.cards.splice(index, 1);
        } else {
            var newCard = new Card(title, notes, $scope.cards[index].dateAdded, formatDate(new Date()), total);
            $scope.cards.splice(index, 1, newCard);
        }
        $scope.updateViews();
        $('#confirmDeleteCard').hide();
        $scope.deleteCard = false;
        saveCards($scope.cards);
    }

});