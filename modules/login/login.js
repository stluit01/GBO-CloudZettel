/**
 * Created by Jens on 12.11.2014.
 */

 
function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}

angular.module('login', ['login.config'])

.controller('loginCtrl', function ($scope, $http, $window, $location) {
        $scope.isAuthenticated = false;
 
 

 $scope.emailtest = function() {
	//Vergleich für Email
	var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;	
		
	if($scope.email){
	if (!$scope.email.match(EMAIL_REGEXP)) {
	  $scope.erroremail = 'Keine richtige Email-adresse!';
	} 
	else{
	$scope.erroremail="";
	}
	}
	
	$scope.error="";
}; 
 
        $scope.submit = function () {
		
			if ($scope.email=="" || $scope.password=="") {
			$scope.error = 'Bitte alle Felder ausfüllen!';
			} 
            //console.log($scope.user);
            $http.post('/login', {email: $scope.email, password: $scope.password})
                .success(function (data, status, headers, config) {
                    $window.localStorage.token = data.token;
                    //$window.sessionStorage.token = data.token;
                    $scope.isAuthenticated = true;
                    var encodedProfile = data.token.split('.')[1];
                    var profile = JSON.parse(url_base64_decode(encodedProfile));
                    $location.path("/listen")
                })
                .error(function (data, status, headers, config) {

                    // Erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    $scope.isAuthenticated = false;
                    // Handle login errors here
					if(data=="Passwort falsch!"){
					$scope.pwerror = data;
					}
					else{
					$scope.usererror = data;
					}
                });
        };

        $scope.logout = function () {
            $scope.isAuthenticated = false;
            delete $window.sessionStorage.token;
        };
    })

.controller('registrateCtrl', function ($scope) {

//email, passwort, passwortvalidate holen
$scope.emailreg="";
$scope.passwort="";
$scope.passwortvalidate="";



$scope.register = function() {
	//Abfrage ob email passwort und passworvalidate gesetzt sind
	//Die Zeilen nur nötig, wenn die spans weg gemacht werden
	//Ansonsten gelten die spans
	//Das hier wäre aber besser
	if ($scope.emailreg=="" || $scope.passwort=="" || $scope.passwortvalidate=="") {
	  $scope.error = 'Bitte alle Felder ausfüllen!';
	} 
  };
  
 $scope.pwvergleich = function() {
	if ($scope.passwort !== $scope.passwortvalidate || $scope.passwort=="" || $scope.passwortvalidate=="") {
	  $scope.errorpass = 'Passwörter stimmen nicht überein!';
	}
	else{
	$scope.errorpass="";
	}
	
	$scope.error="";
 };
 
$scope.emailtrue = function() {
	//Vergleich für Email
	var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;	
		
	if($scope.emailreg){
	if (!$scope.emailreg.match(EMAIL_REGEXP)) {
	  $scope.erroremail = 'Keine richtige Email-adresse!';
	} 
	else{
	$scope.erroremail="";
	}
	}
	
	$scope.error="";
}; 
 

 

 
});