import React, { useEffect} from "react";
import * as d3 from 'd3'
import * as topojson from "topojson";
import geojson from './map12.json';
import ButtonZoom from "./buttons/ButtonZoom";
import { useWindowSize } from "./useWindowSize";
import './Map.css';
import PointMenu from "./PointMenu.js"


const Map = ()=>{
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const pointRadius = 1.5;
    let projection = d3.geoAlbers()
        .rotate([-100, 0])
        .parallels([52, 64]).scale(1)
        //.scale(0.7*width).translate([width/2, height]);
        
    let path = d3.geoPath().projection(projection);
    
    let data = topojson.feature(geojson, geojson.objects.map).features;
    
    let scaleCenter = calculateScaleCenter(topojson.feature(geojson, geojson.objects.map));
    projection.scale(scaleCenter.scale)
    .center(scaleCenter.center)
    .translate([width/4 - (width/4)*0.2, height/4 + (scaleCenter.center[1]/height)])
    
    let zoom = d3.zoom()
    .scaleExtent([1, 35/(scaleCenter.scale/1000)>40 ? 35: 35/(scaleCenter.scale/1000)]);
    let states;
    let svg;


    let settingsPointMenu ={
        "font-size-header": 1.6,
        "size-rect":[15*scaleCenter.scale/800, 12*scaleCenter.scale/800],
        "ratioYCoordNation":3/800,
        "ratioYCoordRegion":4.5/800
    }

    const [window_width, window_height] = useWindowSize();
    if(window_width<801) {
        d3.select(".main-content-catalog-wrapper").style("width", String(window_width)+"px").style("height", String(window_height)+"px")
    }

    function calculateScaleCenter(features) {
        let bbox_path = path.bounds(features),
            scale = 0.92 / Math.max(
              (bbox_path[1][0] - bbox_path[0][0]) / width,
              (bbox_path[1][1] - bbox_path[0][1]) / height
            );
        let bbox_feature = d3.geoBounds(features),
            center = [
              (bbox_feature[1][0] + bbox_feature[0][0]) / 2,
              (bbox_feature[1][1] + bbox_feature[0][1]) / 2];
        return {
          'scale': scale,
          'center': center
        };
      }

    function zoomed(event){
        const {transform} = event;
        let g = d3.select(".map-paths-cont");
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
        d3.selectAll(".points-circle").attr("r", pointRadius*scaleCenter.scale/1000);
        d3.select("#semicircle-rect-menu-fT").attr("r", (pointRadius*scaleCenter.scale/1000)*1.4);
    }

    function reset(event) {
        if(d3.select(event.target).attr("class") === d3.select(".main-svg").attr("class")){
            states.transition().style("fill", null);
            
            d3.selectAll("circle").remove()
            d3.select(".rect-menu-fairyTales-cont").remove()
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
            );
        }
        
    }
    function setZoomedPoint(event, x0, x1, y0, y1){  
        svg.transition().duration(1000).call(
            zoom.transform,
            d3.zoomIdentity.translate(width / 2, height / 2)
            .scale(Math.min(22, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }

    function pointClicked(event){
        event.stopPropagation()

        d3.select(".rect-menu-fairyTales-cont").style("display", "none")
        let scCenter = scaleCenter
        if(scCenter.scale < 335){
             scCenter.scale = 335
             settingsPointMenu["size-rect"] = [15*scCenter.scale/800, 12*scCenter.scale/800]
        }
        if(document.querySelector(".rect-menu-fairyTales-cont") === null){ 
            new PointMenu(settingsPointMenu, event, scaleCenter)
        }
        else{
            PointMenu.MovePointMenuTo(event, settingsPointMenu)
        }
        const [[x0, y0], [x1, y1]] = path.bounds(document.querySelector('path[regionName*=' + "'" + event.target.getAttribute("regionName") + "'"+']')["__data__"])
        setZoomedPoint(event, x0, x1, y0, y1)
    }

    function addPointCircleInPath(g, data, targetElem){
        const coord = projection([Number(data["longitude"]), Number(data["latitude"])])
        g.append("g").append('circle')
            .attr('cx', coord[0])
            .attr('cy', coord[1])
            .attr('r', pointRadius)
            .attr("regionName", targetElem.getAttribute("regionName"))
            .attr("ethnicGroup", data["ethnicGroupId"])
            .attr("class", "points-circle")
            .attr("fill", "url(#img1)")
            .on("click", pointClicked)
    }
    
    function setZoomedPath(event, x0, x1, y0, y1){
        states.transition().style("fill", null);
        d3.select(event.target).transition().style("fill", "rgb(231 73 73)");    
        svg.transition().duration(1000).call(
            zoom.transform,
            d3.zoomIdentity.translate(width / 2, height / 2)
            .scale(Math.min(22, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }

    function fillPathByPoints(elem, g){
        fetch("http://saintmolly.ru:3005/api/map/ethnic-group/"+String(elem.getAttribute("ID")))
        .then(response => response.json())
        .then(commits =>{
            if(commits.statusCode === undefined){
                commits.map((data)=>{
                    addPointCircleInPath(g, data, elem)
                })
            }}
        );
    }
    function PathClicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        
        let g = d3.select(".points");
        const pointMenu = document.querySelector(".rect-menu-fairyTales-cont")
        
        if(d3.select(event.target).style("fill")!== "rgb(255, 0, 0)"){
            document.getElementsByClassName("points")[0].innerHTML="";
            document.querySelector(".points").append(pointMenu)
            if(document.querySelector(".rect-menu-fairyTales-cont") !== null){
                document.querySelector(".rect-menu-fairyTales-cont").style.display = "none"
            }
            
            fillPathByPoints(event.target, g)
            
        }
       
        setZoomedPath(event, x0, x1, y0, y1)
        
    }

    const zoomPlus = ()=>{
        svg.transition().call(zoom.scaleBy, 1.5);
    };

    const zoomMinus = ()=>{
        svg.transition().call(zoom.scaleBy, 0.6);
    };

    useEffect(() => {
        svg = d3.select("svg");
        svg.on("click", reset);
        states = d3.select("#states").selectAll("path")
                .data(data)
                .join("path")
                .style("stroke-linejoin", "round")
                .style("stroke", "black")//"#b7b7b7"
                .style("stroke-width", "0.1")
                .on("click", PathClicked)
                .attr("d", path)
                .attr("regionName", (d)=>d.properties.shapeName)
                .attr("ID", ((d)=>d.properties.id))
               
        zoom.on("zoom", zoomed);
        
        svg.call(zoom);
        
        d3.select("#plus-zoom-button").on("click", zoomPlus)
        d3.select("#minus-zoom-button").on("click", zoomMinus)
      }, []);

     return (
        <div>
            <svg className="main-svg" viewBox={"0, 0, " + window_width + " "+ window_height} width={window_width} height={window_height}>
                <g className='map-paths-cont' transform="translate(0,0) scale(1)">
                    <g id="states"></g>
                    <g className="points"></g>
                </g>
                <defs>
                    <pattern id="img1"  width={pointRadius} height={pointRadius}>
                        <image href="pointPlus.svg" x="0" y="0" width={2*pointRadius*scaleCenter.scale/1000} height={2*pointRadius*scaleCenter.scale/1000} />
                    </pattern>
                </defs>
            </svg>           
            <div className='map-manage-elems-cont'>
                <div className='map-buttons'>
                    <ButtonZoom idName="plus"></ButtonZoom>
                    <ButtonZoom idName="minus"></ButtonZoom>
                </div>
            </div>   
        </div>
                   
    ); 

}
export default Map;