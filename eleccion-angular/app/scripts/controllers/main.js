'use strict';

/**
 * @ngdoc function
 * @name eleccionAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eleccionAngularApp
 */
angular.module('eleccionAngularApp')
  .controller('MainCtrl', function ($scope,$http) {
    $scope.showTable = false;
    var file = "data/listapartidos.json";
    var data = [];
    $scope.candidatoselection = "";
    $http.get(file).success(function(data) {
    	console.log(data); 	
    	$scope.candidatos = data;
    });
    $scope.showMapCandidate = function(candidate){
        $scope.candidatetitle= "Propuestas por Departamento de ";
        $scope.candidatoselection = candidate.party;
    	mapDraw(candidate.partyId);
	};

});
