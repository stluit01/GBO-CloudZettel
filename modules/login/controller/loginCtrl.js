/**
 * Created by Jens on 29.11.2014.
 */
login.controller('loginCtrl', function ($scope, $http, $window, $location) {
    $scope.isAuthenticated = false;

    $scope.emailtest = function () {
        //Vergleich für Email
        var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

        if ($scope.email) {
            if (!$scope.email.match(EMAIL_REGEXP)) {
                $scope.erroremail = 'Keine richtige Email-adresse!';
            }
            else {
                $scope.erroremail = "";
            }
        }

        $scope.error = "";
    };

    $scope.submit = function () {
        if ($scope.email == "" || $scope.password == "") {
            $scope.error = 'Bitte alle Felder ausfüllen!';
        }
        //console.log($scope.user);
    $http.post('/login', {email: $scope.email, password: $scope.password})
        .success(function (data, status, headers, config) {
            $window.localStorage.token = data.token;
            //$window.sessionStorage.token = data.token;
            $scope.isAuthenticated = true;
            //var encodedProfile = data.token.split('.')[1];
            //var profile = JSON.parse(url_base64_decode(encodedProfile));
            $location.path("/lists")
        })
        .error(function (data, status, headers, config) {
            // Erase the token if the user fails to log in
            delete $window.localStorage.token;
            $scope.isAuthenticated = false;
            // Handle login errors here
            if (data == "Passwort falsch!") {
                $scope.pwerror = data;
            }
            else {
                $scope.usererror = data;
            }

        }
    );
};
});