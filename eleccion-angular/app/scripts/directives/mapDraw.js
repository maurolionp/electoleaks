
function mapDraw(candidate){

      d3.select("svg").remove();
var width = 600,
          height = 600,
          scale = 6500,
          translateX = -240,
          translateY = 7260,
          legendRectSize = 18,
          legendSpacing = 4,
          data;

      var projection = d3.geo.mercator()
        .scale(1800)
        .center([-75, -9.4]) //projection center
        .translate([width / 2, height / 2]) //translate to center the map in view

      var path = d3.geo.path().projection(projection);
      var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoomhandler);

      var svg = d3.select("#chart")
          .append("svg")
            .attr("width", width)
            .attr("height", height).attr("class", "map");
       var features = svg.append("g")
                    .attr("class", "features");

       d3.json("data/regiones_peru_topo.json", function(error, geodata) {
      features.selectAll("path")
            .data(topojson.feature(geodata, geodata.objects.regiones_peru).features)
            .enter()
            .append("path")
              .attr("d", path)
              .style("stroke", "black")
              .style("stroke-width", 0.5)
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseout", mouseout);

            features.selectAll("text")
              .data(topojson.feature(geodata, geodata.objects.regiones_peru).features)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                .text(function(d) { return d.properties.name;} )
                 .on("mouseover", mouseover)
                 .on("mousemove", mousemove)
                 .on("mouseout", mouseout);
       });

    var color = d3.scale.ordinal()
          .domain(["Ninguno", "2-5 Menciones", "5-9 Menciones", ">10 Menciones"])
          .range(["#FFFFFF", "#F78181", "#819FF7","#2E2EFE"]);

      var legend = d3.select("svg")
          .append("g")
          .selectAll("g")
          .data(color.domain())
          .enter()
          .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
              var height = legendRectSize;
              var x = 0;
              var y = i * height;
              return "translate(" + x + "," + y + ")";
          });

      legend.append("rect")
          .attr("width", legendRectSize)
          .attr("height", legendRectSize)
          .style("fill", color)
          .style("stroke", color);

      legend.append("text")
          .attr("x", legendRectSize + legendSpacing)
          .attr("y", legendRectSize - legendSpacing)
          .text(function(d) { return d; });

      //Add a div to the section containing the map to hold the tooltip information
      var tooltip = d3.select("div")
          .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0); 


      d3.json("data/planes_gobierno_por_departamento.json", function(json){
          if(candidate == "fuerzapopular"){
            data = json.fuerzapopular;
          }
          if(candidate == "peruanosporelcambio"){
            data = json.peruanosporelcambio;
          }
          if(candidate == "alianzapopular"){
            data = json.alianzapopular;
          }
          if(candidate == "peruposible"){
            data = json.peruposible;
          }
          if(candidate == "partidopoliticoorden"){
            data = json.partidopoliticoorden;
          }
          if(candidate == "alianzasolidaridadnacional"){
            data = json.alianzasolidaridadnacional;
          }
          if(candidate == "frenteamplio"){
            data = json.frenteamplio;
          }
          if(candidate == "accionpopular"){
            data = json.accionpopular;
          }
          if(candidate == "partidohumanistaperuano"){
            data = json.partidohumanistaperuano;
          }
          if(candidate == "progresandoperu"){
            data = json.progresandoperu;
          }
          if(candidate == "perulibertario"){
            data = json.nn;
          }
          if(candidate == "perunacion"){
            data = json.nn;
          }
          if(candidate == "democraciadirecta"){
            data = json.nn;
          }
          if(candidate == "frenteesperanza"){
            data = json.nn;
          }          
          features.selectAll("path")
            .attr("class", quantify)
      });

      function quantify(d) {
        console.log(d.properties.name);
        if(d.properties.name != "Callao"){
          var f = data[d.properties.name].menciones;
          var color = "q3-9";          
          if(f == 0){
            return "q0-9";
          }
          if(f> 0 && f<5){
            return "q1-9";
          }
          if(f> 5 && f<9){
            return "q2-9";
          }
          return "q3-9";
        }else{
          return "q0-9";
        }
        
      }
    //svg.selectAll("path")
     //       .attr("class", 'q0-9')

      function zoomhandler() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")
          .style("font-size", function(){return 12 / d3.event.scale + "px";});
      }     

      //Make the tooltip visible with CSS transition
      function mouseover(){
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
      }

      //Add the data you want to display to the tooltip. The province that is hovered and the number of arrests in that province.
        //Position the left side of the tooltip at the same left offset as the mouse cursor,
        //Position the tooltip 50px above the cursor

      function mousemove(d){
          tooltip.html(d.properties.name  + "<br/>"  +  data[d.properties.name].menciones + " menciones")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 50) + "px");
      }

      //Hide the tooltip whit CSS transition when you are no longer hover over it
      function mouseout(){
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
      }
}