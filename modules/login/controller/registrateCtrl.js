/**
 * Created by Jens on 29.11.2014.
 */
login.controller('registrateCtrl', function ($scope, listsDataService, $http, $location, $window , PROPERTIES) {
    //email, passwort, passwortvalidate holen
    $scope.emailreg = "";
    $scope.password = "";
    $scope.passwordvalidate = "";

    $scope.register = function () {
        //Abfrage ob email passwort und passworvalidate gesetzt sind
        //Die Zeilen nur nötig, wenn die spans weg gemacht werden
        //Ansonsten gelten die spans
        //Das hier wäre aber besser
        if ($scope.emailreg == "" || $scope.password == "" || $scope.passwordvalidate == "") {
            $scope.error = 'Bitte alle Felder ausfüllen!';
        }
        else {
            var newUser =
            {
                "id": "",
                "email": $scope.emailreg,
                "passwort": $scope.password
            };

            listsDataService.getNewId().then(function (res) {
                newUser.id = res.data;
                listsDataService.addUser(newUser)
                    .then(function () {
                        //TODO regiser hinweis
                        //FIXME login refactorn
                        $http.post(PROPERTIES.serverurl+'/login', {email: $scope.emailreg, password: $scope.password})
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
                    }, function (error) {
                        $scope.erroremail = "Email-Adresse existiert bereits"
                    }
                );
            })
        }
    };

    $scope.pwvergleich = function () {
        if ($scope.password !== $scope.passwordvalidate || $scope.password == "" || $scope.passwordvalidate == "") {
            $scope.errorpass = 'Passwörter stimmen nicht überein!';
        }
        else {
            $scope.errorpass = "";
        }
        $scope.error = "";
    };

    $scope.emailtrue = function () {
        //Vergleich für Email
        var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
        if ($scope.emailreg) {
            if (!$scope.emailreg.match(EMAIL_REGEXP)) {
                $scope.erroremail = 'Keine richtige Email-adresse!';
            }
            else {
                $scope.erroremail = "";
            }
        }
        $scope.error = "";
    };

    $scope.back = function () {
        $location.path("/login");
    };
});