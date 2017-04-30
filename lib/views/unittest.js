
var myApp = angular.module('myApp', []);

myApp.controller('BooksController', function($scope, $http ){
	var getData = function getData() {
					$http.get('books.json').success(function(response){
						$scope.books = response;
					}).error(function(data, status, headers, config) {
							console.log("error ",data);
							$scope.books = [];
					});
				};
		getData();
	});

	/* Tests */
	describe('app tests', function () {
		var $controller;
		var $httpBackend;
		var $scope;
		var testData = {
					OLIDOL30460M : {
						publishers: [{"name":"S.H. Goetzel"}]
					}
		}
		beforeEach(module('myApp'));
		beforeEach(inject(function(_$controller_, _$httpBackend_) {
			$controller = _$controller_;
			$scope = {};
			$httpBackend = _$httpBackend_;

		}));

		describe('http tests ', function() {
			it('should load data', function () {
				$httpBackend.when('GET', 'books.json')
					.respond( testData);
					console.log("testData ",testData);
				$httpBackend.expect('GET', 'books.json');
				$controller('BooksController', { $scope: $scope });
				$httpBackend.flush();
				expect($scope.books).toEqual(testData);
			});

		});

	});
