var myApp = angular.module('myApp', []);

myApp.controller('BooksController', ['$scope', '$http',   function($scope, $http ){

  var arrBooksOLID = [];

	var getData = function getData() {
				$http.get('http://localhost:3000/getdata/title/').success(function(response){
					$scope.books = response.books;
          arrBooksOLID = response.olid;
					//console.log("response ",JSON.stringify(response.olid));
				}).error(function(data, status, headers, config) {
						console.log("error ",data);
				});
			};

	getData();

  $scope.submitSearch = function () {
        // VERIFY IF KEYWORD IS OLID
        //SEARCH IN OLID ARRAY
        var tmpObj, tmpVal, tmpIndex;
        var keywordType = 'title';
        var urlEndpoint = '';
        var keywordTitle = $scope.searchKeyword;
        keywordTitle = keywordTitle.toLowerCase();

        for (var i=0 ; i < arrBooksOLID.length ; i++) {
              tmpVal = arrBooksOLID[i];
              tmpVal = tmpVal.toLowerCase();
              tmpIndex = tmpVal.indexOf(keywordTitle);

              if (tmpIndex > -1) {
                 keywordType = 'olid';
              }
        }

        if (keywordType == 'title') {
           urlEndpoint = 'http://localhost:3000/getdata/title/'+keywordTitle;
        }
        if (keywordType == 'olid') {
           urlEndpoint = 'http://localhost:3000/getdata/olid/'+keywordTitle;
        }
        if (keywordTitle == '') {
            urlEndpoint = 'http://localhost:3000/getdata/title/';
        }

				$http.get(urlEndpoint).success(function(response){
					$scope.books = response.books;
					console.log("response ",JSON.stringify(response.olid));
				}).error(function(data, status, headers, config) {
						console.log("error ",data);
				});

  }


}]);
