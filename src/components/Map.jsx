import React, { useEffect} from "react";
import * as d3 from 'd3'
import * as topojson from "topojson";
import geojson from './map12.json';
import ButtonZoom from "./buttons/ButtonZoom";
import { useWindowSize } from "./useWindowSize";
import './Map.css';
import PointMenu from "./PointMenu.js"
import addPointCircleInPath from "./PointGenerator.js";
import PointsNature from './PointsObjectsNature.json'


const Map = ()=>{
    let width = window.innerWidth;
    let height = window.innerHeight;

    
    const pointRadius = 1.5;
    let zoomedPointRadius = 1.5;
    let colorRegion;
    let projection = d3.geoAlbers()
    .rotate([-100, 0])
    .parallels([52, 64]).scale(1)
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
    const catalog = d3.select(".main-content-catalog-wrapper")
    const bookProfile = d3.select("#main-cont-reader-horizontal")
    
    if(window_width<801) {
        
        catalog.style("width", String(window_width)+"px").style("height", String(window_height)+"px")
        bookProfile.style("width", String(window_width)+"px").style("height", String(window_height)+"px")
        d3.select("#main-reader-books-wrapper").style("width", "fit-content").style("height", "fit-content")
        d3.select("#fullscreen-textreader-wrapper").style("width", String(window_width)+"px").style("height", String(window_height)+"px")
        d3.select("#main-fullscreen-textreader").style("width", String(window_width)+"px").style("height", String(window_height)+"px")
    } 
    else if(window_width <1001 && Number(catalog.style("width").slice(0, -2))*3/4 != window_width*3/4){
        catalog.style("width", "75%").style("height", "75%")
        bookProfile.style("width", "75%").style("height", "75%")
        d3.select("#main-reader-books-wrapper").style("width", "100%").style("height", "100%")
        d3.select("#main-fullscreen-textreader").style("width", "100%").style("height", "100%")
        d3.select("#fullscreen-textreader-wrapper").style("width", "75%").style("height", "75%")
    }else{
        if(Number(catalog.style("width").slice(0, -2))/2 != window_width/2){
            catalog.style("width", "50%").style("height", "75%")
            bookProfile.style("width", "50%").style("height", "75%")
            d3.select("#fullscreen-textreader-wrapper").style("width", "50%").style("height", "75%")
        }
    }
    if(window_width < 600){
        d3.select(".login-cont-main").style("width", String(window_width)+"px").style("height", String(window_height)+"px")
        d3.select("#user-profile-menu-main-cont").style("width", String(window_width)+"px").style("height", String(window_height)+"px")
        d3.select("#user-profile-menu-main-wrapper").style("width", "100%").style("height", "100%")
        
    }
    if(window_width<450) {
        d3.select("#main-cont-search-panel").style("width", String(window_width)+"px").style("height", String(window_height)+"px")
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
    function ButtonExtendingListClicked(block){

        block.classList.toggle("active")
        let content = block.nextSibling
        
        if(block.classList.contains("active")){
            d3.select(block).selectChild("img").transition().duration(750).style("transform", "rotate(-90deg)")
            
            content.style.maxHeight = 0+"px";
        }
        else{
            d3.select(block).selectChild("img").transition().duration(750).style("transform", "rotate(90deg)")
            
            content.style.maxHeight = "fit-content";
        }

        
    }
    function foundedPointsBySearchInput(cont, nameEthnicGroup){
        const g = d3.select(".points")
        g.selectChildren("g").remove()
        if(!Boolean(nameEthnicGroup.trim())) return;
        fetch("http://saintmolly.ru:3005/api/map/ethnic-group/by-name-ethnic-group/"+String(nameEthnicGroup))
        .then(response => response.json())
        .then(commit => {
            if(commit.length !== 0 && commit["statusCode"]===undefined && commit!==undefined && commit!==null){
                commit.forEach(data=>{
                    fetch("http://saintmolly.ru:3005/api/ethnic-group/"+String(data["ethnicGroupId"]))
                    .then(response =>{
                        if(response){
                            return response.json()
                        }
                    }).then(commit_=>{
                        const span = cont.append("span").text(commit_["name"])
                        .style("display", "block")
                        .attr("class", "span-result-searching")
                        
                        const circle = addPointCircleInPath(g, data, document.querySelector("path[id*="+ "'" + data["constituent"]["id"] + "'" +"]"), projection, zoomedPointRadius)
                        .on("click", pointClicked)
                        span.on("click", (event)=>{
                            const event_ = new Event("click")
                            circle["_groups"][0][0].dispatchEvent(event_)
                            const constituent = document.querySelector('path[regionName*=' + "'" + data["constituent"]["name"] + "'"+']')
                            const [[x0, y0], [x1, y1]] = path.bounds(constituent["__data__"])
                            setZoomedPoint(event_, x0, x1, y0, y1)
                        })
                        
                        
                    })
                    
                })
                ButtonExtendingListClicked(document.querySelector(".header-nations-cont"))
            }
            else ButtonExtendingListClicked(document.querySelector(".header-nations-cont"))
            //
            
        })
        
    }
    
    
    function zoomed(event){
        const {transform} = event;
        let g = d3.select(".map-paths-cont");
        const tryZoomedPointRadius = pointRadius*scaleCenter.scale/1000
        zoomedPointRadius = tryZoomedPointRadius<0.5025?0.5025:tryZoomedPointRadius;
        
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
        d3.selectAll(".points-circle").attr("r", zoomedPointRadius);
        d3.select("#semicircle-rect-menu-fT").attr("r", zoomedPointRadius*1.4);
        d3.select("#img1").selectChild("image").attr("width", 2*zoomedPointRadius).attr("height", 2*zoomedPointRadius)
        //d3.selectAll("#natureObjects").selectChildren("image").attr("width", 30*scaleCenter.scale/500).attr("height", 30*scaleCenter.scale/500)
    }
    function SetColorRegion(){
        states["_groups"][0].map(data=>{
            if(colorRegion[Number(data.getAttribute("ID"))])
                data.style.fill = colorRegion[Number(data.getAttribute("ID"))]
            else data.style.fill = "rgb(255, 255, 255)"
        })
    }
    function reset(event) {
        if(d3.select(event.target).attr("class") === d3.select(".main-svg").attr("class")){
            SetColorRegion()
            
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
        
    }

    
    
    function setZoomedPath(event, x0, x1, y0, y1){
        states.transition()//.style("fill", null);
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
                    addPointCircleInPath(g, data, elem, projection, zoomedPointRadius).on("click", pointClicked)

                })
            }}
        );
    }
    function PathClicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        
        const listPointsByNations = document.querySelector(".header-nations-cont");
        if(listPointsByNations){
            d3.select(listPointsByNations.nextSibling).selectChildren().remove()
        }

        let g = d3.select(".points");
        g.selectChildren("g").remove()
        const pointMenu = document.querySelector(".rect-menu-fairyTales-cont")
        
        if(d3.select(event.target).style("fill")!== "rgb(255, 0, 0)"){
            document.getElementsByClassName("points")[0].innerHTML="";
            document.querySelector(".points").append(pointMenu)
            if(document.querySelector(".rect-menu-fairyTales-cont") !== null){
                document.querySelector(".rect-menu-fairyTales-cont").style.display = "none"
            }
            
            fillPathByPoints(event.target, g)
            
        }
        SetColorRegion()
        setZoomedPath(event, x0, x1, y0, y1)
        
    }

    const zoomPlus = ()=>{
        svg.transition().call(zoom.scaleBy, 1.5);
    };

    const zoomMinus = ()=>{
        svg.transition().call(zoom.scaleBy, 0.6);
    };

    function FillMapByNatureObjects(filledRatio){
        let NatureSizeRatio;
        const ObjectTypesToFile = {
            1:"tree_1.svg",
            2:"tree_2.svg",
            3:"tree_3.svg",
            4:"tree_4.svg"
        }
        const NatureCont = d3.select("#natureObjects");
        PointsNature.map(data=>{
            NatureSizeRatio = data["sizeRatio"]
            console.log(filledRatio)
            let ratio = filledRatio.find((obj)=>obj.constituentId===data["constituentId"])
            console.log(ratio)
            //ratio = {"filled":1}
            //d3.shuffle(data["coord"]).slice(0, Math.round(data["coord"].length*(ratio?(ratio["filled"]>1?1:ratio["filled"]):0)))
            let img;
            data["coord"].map(coords=>{
                const [x, y] = projection([Number(coords["longitude"]), Number(coords["latitude"])])
                img = NatureCont.append("image")
                .attr("href", ObjectTypesToFile[coords["type"]])
                .attr("x", x - NatureSizeRatio*30/2*scaleCenter.scale/1000)
                .attr("y", y - NatureSizeRatio*30/2*scaleCenter.scale/1000)
                .attr("width", NatureSizeRatio*30*scaleCenter.scale/1000 + "px")
                .attr("height", NatureSizeRatio*30*scaleCenter.scale/1000+ "px")
                .attr("constituentId", data["constituentId"])
                if(ratio){
                    img.style("opacity", ratio["filled"]*100 +"%")
                }
                else img.style("opacity", 0)
            })
            
        })
    }

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
        colorRegion = {}
        fetch("http://saintmolly.ru:3005/api/constituent/percent-of-filled/{constituentId}")
        .then(response=>response.json())
        .then(commit=>{
            
            commit.map(data=>{
                states["_groups"][0][data["constituentId"]-1].style.fill = "rgb(255, "+(255-data["filled"]*170)+", "+(255-255*data["filled"])+")"
                colorRegion[data["constituentId"]] = "rgb(255, "+(255-data["filled"]*170)+", "+(255-255*data["filled"])+")"
            })
            FillMapByNatureObjects(commit)
        })
               
        zoom.on("zoom", zoomed);
        
        svg.call(zoom);
        
        d3.select("#plus-zoom-button").on("click", zoomPlus)
        d3.select("#minus-zoom-button").on("click", zoomMinus)
        document.querySelector("#search-input").addEventListener("foundedSearchedData", (event)=>{
            foundedPointsBySearchInput(event.detail.container, event.detail.nameEthnicGroup)
        })
        
      }, []);

     return (
        <div>
            <svg className="main-svg" viewBox={"0, 0, " + window_width + " "+ window_height} width={window_width} height={window_height}>
                <g className='map-paths-cont' transform="translate(0,0) scale(1)">
                    <g id="states"></g>
                    <g id="natureObjects"></g>
                    <g className="points"></g>
                </g>
                <defs>
                    <pattern id="img1"  width={pointRadius} height={pointRadius}>
                        <image href="pointPlus.svg" x="0" y="0" width={2*zoomedPointRadius} height={2*zoomedPointRadius} />
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