'use strict';

myApp.
    controller('SearchCtrl', [
        '$scope','$http', function ($scope, $http) {

            $scope.terms = [
                { value: '', text: 'all' },
                { value: 'intitle', text: 'the title' },
                { value: 'inauthor', text: 'the author' },
                { value: 'inpublisher', text: 'the publisher' },
                { value: 'subject', text: 'the category list of the volume' },
                { value: 'isbn', text: 'the ISBN number' },
                { value: 'lccn', text: 'the Library of Congress Control Number' },
                { value: 'oclc', text: 'the Online Computer Library Center number' }
            ];
            $scope.term = $scope.terms[0].value; // default


            $scope.search = function () {
                if ($scope.keyword) {
                    console.log($scope.keyword);

                    console.log($scope.term);
                    var url = 'https://www.googleapis.com/books/v1/volumes?q=' + $scope.keyword;
                    if ($scope.term.length > 0) {
                        url = url + "+" + $scope.term;
                    }
                    console.log(url);
                    $http({ method: 'GET', url: url }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);
                        $scope.books = data;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.books = [];
                    });

                }
                else {
                    $scope.books = [];
                }

            };
        }
    ]);



// myApp.
//     controller('GoogleUserBookshelvesCtrl', [
//         '$scope', '$http', function ($scope, $http) {
// }]);

myApp.
    controller('GoogleUserProfileCtrl', [
        '$scope', '$http','UserService', function ($scope, $http,UserService) {
          
          $scope.bookshelves={
            items:{}
          };

            $scope.test = function () {

                console.log(UserService);
                console.log('UserService');

                var uid = googleHelper.UserId();
               // var url = 'https://www.googleapis.com/books/v1/user/' + uid + '/bookshelves/';
               var url='https://www.googleapis.com/books/v1/mylibrary/bookshelves'+"?access_token="+UserService.access_token;

                $http({ method: 'GET', url: url }).
                    success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        console.log(data);
                        $scope.bookshelves=data;
                        for (var i = $scope.bookshelves.items.length - 1; i >= 0; i--) {

                            if ($scope.bookshelves.items[i].volumeCount>0)
                            {
                                var vurl=$scope.bookshelves.items[i].selfLink+"/volumes"+"?access_token="+UserService.access_token;

                                $http({ method: 'GET', url: vurl }).
                                success(function (data, status, headers, config) {
                                    console.log(data);
                                    //$scope.bookshelves.items[i].volumes={};
                                   // $scope.bookshelves.items[i].volumes=data;
                                  //$scope.bookshelves.items[i]
                                }).
                                error(function (data, status, headers, config) {
                                    console.log(data);
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                    //$scope.books=[];
                                });

                            }
                        };
                        //$scope.books=data;
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        //$scope.books=[];
                    });


            };
        }
    ]);


