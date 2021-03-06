'use strict';

/* Directives */


myApp.directive('googleConnect', ['UserService',
    function (UserService) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs, ctrl, $timeout) {
                console.log(UserService);
                console.log('UserService');
                scope.showConnect=true;
                scope.profile = {
                    image: ''
                };

              
                // Enter a client ID for a web application from the Google Developer Console.
                // The provided clientId will only work if the sample is run directly from
                // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
                // In your Developer Console project, add a JavaScript origin that corresponds to the domain
                // where you will be running the script.
                scope.clientId = '458058919748-lr1blgl6cgv1r70d3qhralql0ot59917.apps.googleusercontent.com';

                // Enter the API key from the Google Develoepr Console - to handle any unauthenticated
                // requests in the code.
                // The provided key works for this sample only when run from
                // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
                // To use in your own application, replace this API key with your own.
                scope.apiKey = 'AIzaSyAyclfZKwub-ogDQ9SBFlZvbZK2gtr81nc';

                // To enter one or more authentication scopes, refer to the documentation for the API.
                scope.scopes = 'https://www.googleapis.com/auth/plus.me profile email https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/books';

                // Use a button to handle authentication the first time.
                scope.handleClientLoad = function () {
                    console.log('handleClientLoad');
                    gapi.client.setApiKey(scope.apiKey);
                    window.setTimeout(scope.checkAuth, 1);
                };

                scope.gapiStatus = function () {
                     console.log('gapiStatus');
                    return (gapi !== undefined && gapi.client !== undefined && gapi.client.setApiKey !== undefined);
                };

                scope.checkAuth = function () {
                    gapi.auth.authorize({ client_id: scope.clientId, scope: scope.scopes, immediate: true }, scope.handleAuthResult);
                };


                scope.handleAuthResult = function (authResult) {
                 console.log('handleAuthResult');  
                console.log(authResult);                 
                    if (authResult && !authResult.error) {
                        scope.showConnect=false;
                        UserService.access_token=authResult.access_token;
                        scope.makeApiCall();
                    } else {
                        scope.showConnect=true;                        
                        
                    }
                };

                scope.handleAuthClick = function (event) {
                    console.log('handleAuthClick');
                    gapi.auth.authorize({ client_id: scope.clientId, scope: scope.scopes, immediate: false }, scope.handleAuthResult);
                    return false;
                };

                // Load the API and make an API call.  Display the results on the screen.
                scope.makeApiCall = function () {
                     console.log('makeApiCall');
                    gapi.client.load('plus', 'v1', function () {
                        var request = gapi.client.plus.people.get({
                            'userId': 'me'
                        });
                        request.execute(function (resp) {
                            
                            
                            scope.profile.image = resp.image.url;
                            scope.profile.displayName=resp.displayName;                          
                            UserService.profile=scope.profile;
                            scope.$apply();
                        });
                    });
                };

                scope.$watch('gapiStatus', function () {
                    console.log('watch gapiStatus');
                    if (scope.gapiStatus()) {
                        scope.handleClientLoad();
                    }
                });
               // scope.gapiStatus();
            },
            templateUrl: '/app/templates/googleconect.html',
            replace: true
        };
    }]);
