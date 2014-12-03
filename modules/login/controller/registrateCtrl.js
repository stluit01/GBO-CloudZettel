/**
 * Created by Jens on 29.11.2014.
 */
login.controller('registrateCtrl', function ($scope) {
    //email, passwort, passwortvalidate holen
    $scope.emailreg = "";
    $scope.passwort = "";
    $scope.passwortvalidate = "";

    $scope.register = function () {
        //Abfrage ob email passwort und passworvalidate gesetzt sind
        //Die Zeilen nur nötig, wenn die spans weg gemacht werden
        //Ansonsten gelten die spans
        //Das hier wäre aber besser
        if ($scope.emailreg == "" || $scope.passwort == "" || $scope.passwortvalidate == "") {
            $scope.error = 'Bitte alle Felder ausfüllen!';
        }
    };

    $scope.pwvergleich = function () {
        if ($scope.passwort !== $scope.passwortvalidate || $scope.passwort == "" || $scope.passwortvalidate == "") {
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
});