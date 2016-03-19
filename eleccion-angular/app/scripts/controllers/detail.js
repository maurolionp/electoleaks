  'use strict';

/**
 * @ngdoc function
 * @name eleccionHackApp.controller:DetailCtrl
 * @description
 * # Detafalsel
 * Controller of the eleccionHackApp
 */
angular.module('eleccionAngularApp')
  .controller('DetailCtrl', function ($http,$scope,$routeParams) {
    var file = "data/listapartidos.json";
    
    //#init
    $scope.showSentimental=false;
    $scope.showPerfil=true;
    $scope.showSearch = true;
    $scope.optionSentimental = "Ocultar";
    $scope.optionPerfil = "Ocultar";
    
    $scope.buttonGDiv = function(element){
      if(element == "sentimental"){
        if($scope.optionSentimental == "Ocultar"){
          $scope.optionSentimental = "Mostrar";
          $scope.showSentimental = false;
        }else{
          if($scope.optionSentimental == "Mostrar"){
            $scope.optionSentimental = "Ocultar";
            $scope.showSentimental = true;
          }
        }
      }

      if(element == "perfil"){
        if($scope.optionPerfil == "Ocultar"){
          $scope.optionPerfil = "Mostrar";
          $scope.showPerfil = false;
        }else{
          if($scope.optionPerfil == "Mostrar"){
            $scope.optionPerfil = "Ocultar";
            $scope.showPerfil = true;
          }
        }
      }
    };

    $scope.searchProposal = function(){
      var params = "name=" + $routeParams.candidateId + "&q=" + $scope.query;

      $http.jsonp("http://10.142.255.125:8090/search?callback=JSON_CALLBACK&"+params).then(function(json){
          console.log(json);
      });
    }
    
    
    $http.get(file).success(function(data) {
      $scope.candidatos = data;
      $scope.candidate = {
        fullname: $scope.candidatos[$routeParams.candidateId].name,
        nationality: $scope.candidatos[$routeParams.candidateId].nationality,
        birthdate: $scope.candidatos[$routeParams.candidateId].birthdate,
        party: $scope.candidatos[$routeParams.candidateId].party,
        website: $scope.candidatos[$routeParams.candidateId].website,
        email: $scope.candidatos[$routeParams.candidateId].email,        
        images: "images/"+$routeParams.candidateId+".jpg",
        imagesword: "images/words/"+$routeParams.candidateId+".png"
      }
    });

    var candidateData=[
       {label:"Positivo", color:"LimeGreen"},
       {label:"Negativo", color:"#ff3333"},
       {label:"Neutro", color:"#BDB76B"}
   ];

   var div = d3.select("body").append("div")
           .attr("class", "tooltip")
           .style("opacity", 0);    
    
    var indice = 0;
    if($routeParams.candidateId == "accionpopular"){
      indice = 1;
      $scope.showSentimental = true;
    }
    if($routeParams.candidateId == "fuerzapopular"){
      indice = 2;
      $scope.showSentimental = true;
    }
    if($routeParams.candidateId == "peruanosporelcambio"){
      indice = 3;
      $scope.showSentimental = true;
    }
    if($routeParams.candidateId == "frenteamplio"){
      indice = 4;
      $scope.showSentimental = true;
    }
    if($routeParams.candidateId == "alianzapopular"){
      indice = 5;
      $scope.showSentimental = true;
    }
    if($scope.showSentimental){
    d3.json("data/social/results.json", function(error, data) {
       if (error) throw error;
       var chartWidth = 300,
               barHeight = 20,
               groupHeight = barHeight * data.series.length,
               gapBetweenGroups = 10,
               spaceForLabels = 150,
               spaceForLegend = 150;

       // Zip the series data together (first values, second values, etc.)
       var zippedData = [];
       for (var j = 0; j < data.series.length; j++) {
          console.log(data.series[j].values[indice-1]);
          zippedData.push(data.series[j].values[indice-1]);
       }
       
       var colorAux = ["LimeGreen", "#ff3333", "#BDB76B"];
       var color = d3.scale.linear()
               .domain([0, 1, 2])
               .range(["LimeGreen", "#ff3333", "#BDB76B"]);

       var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

       var x = d3.scale.linear()
               .domain([0, d3.max(zippedData)])
               .range([0, chartWidth]);

       var y = d3.scale.linear()
               .range([chartHeight + gapBetweenGroups, 0]);

       var yAxis = d3.svg.axis()
               .scale(y)
               .tickFormat('')
               .tickSize(0)
               .orient("left");


       // Specify the chart area and dimensions
       var chart = d3.select(".chart")
               .attr("width", spaceForLabels + chartWidth + spaceForLegend)
               .attr("height", chartHeight);

       // Create bars
       var bar = chart.selectAll("g")
               .data(zippedData)
               .enter().append("g")
               .attr("transform", function (d, i) {
                   return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i / data.series.length))) + ")";
               });

       // Create rectangles of the correct width
       bar.append("rect")
               .attr("fill", function (d, i) {
                   d.color=color(i % data.series.length);//saving the original color
                   return color(i % data.series.length);
               })
               .attr("class", "bar")
               .attr("width", x)
               .attr("height", barHeight - 1)
               .on("mouseover", function(d,i) {
                   var name =  data.labels[indice-1];
                   var nrotuit =  data.tweets[i];
                   var colore = colorAux[i % data.series.length];
                   d3.select(this).style("opacity", .7);
                   div.transition()
                           .duration(200)
                           .style("opacity", .9);
                   div.html("<b>"
                           //+ "% de tuit: " + d 
                           + "Nro de tweets: "+"<b> <br>"+ nrotuit)
                           .style("left", (d3.event.pageX) + "px")
                           .style("top", (d3.event.pageY-50) + "px");
               })
               .on("mouseout", function(d) {
                   d3.select(this)
                           .style("fill", function (d, i) {
                       return d.color;
                   })
                           .style("opacity", .9);
                   div.transition()
                           .duration(500)
                           .style("opacity", 0);
               });;

       // Add text label in bar
       bar.append("text")
               .attr("x", function (d) {
                   return x(d) - 3;
               })
               .attr("y", barHeight / 2)
               .attr("fill", "red")
               .attr("dy", ".35em")
               .text(function (d) {
                   return d + "%";
               });

       // Draw labels
       bar.append("text")
               .attr("class", "label")
               .attr("x", function (d) {
                   return -10;
               })
               .attr("y", groupHeight / 2)               
               .text(function (d, i) {
                   if (i % data.series.length === 0){
                       return data.labels[indice-1];

                   }
                   else
                       return ""
               });

       chart.append("g")
               .attr("class", "y axis")
               .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups / 2 + ")")
               .call(yAxis);

       ////
               // Draw legend
       var legendRectSize = 18,
               legendSpacing = 4;

       var legend = chart.selectAll('.legend')
               .data(data.series)
               .enter()
               .append('g')
               .attr('transform', function (d, i) {
                   var height = legendRectSize + legendSpacing;
                   var offset = -gapBetweenGroups / 2;
                   var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
                   var vert = i * height - offset;
                   return 'translate(' + horz + ',' + vert + ')';
               });

       legend.append('rect')
               .attr('width', legendRectSize)
               .attr('height', legendRectSize)
               .style('fill', function (d, i) {
                   return color(i);
               })
               .style('stroke', function (d, i) {
                   return color(i);
               });

       legend.append('text')
               .attr('class', 'legend')
               .attr('x', legendRectSize + legendSpacing)
               .attr('y', legendRectSize - legendSpacing)
               .text(function (d) {
                   return d.label;
               });
   }
   )
    };
  });