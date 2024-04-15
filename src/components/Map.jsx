import React, { useEffect} from "react";
import * as d3 from 'd3'
import * as topojson from "topojson";
import geojson from './map12.json';
import ButtonZoom from "./buttons/ButtonZoom";
import { useWindowSize } from "./useWindowSize";
import './Map.css';

const Map = ()=>{
    let width = window.innerWidth;
    let height = window.innerHeight;
    const pointRadius = 2.3;
    //console.log(geojson)
    let projection = d3.geoAlbers()
        .rotate([-100, 0])
        .parallels([52, 64]).scale(1)
        //.scale(0.7*width).translate([width/2, height]);
        
    let path = d3.geoPath()
    .projection(projection);
    
    let data = topojson.feature(geojson, geojson.objects.map).features;
    
    let scaleCenter = calculateScaleCenter(topojson.feature(geojson, geojson.objects.map));
    projection.scale(scaleCenter.scale)
    .center(scaleCenter.center)
    .translate([width/4 - (width/4)*0.2, height/4 + (scaleCenter.center[1]/height)])
    
    let zoom = d3.zoom()
    .scaleExtent([1, 35/(scaleCenter.scale/1000)>40 ? 35: 35/(scaleCenter.scale/1000)]);
    //console.log(40/(scaleCenter.scale/1000))
    let states;
    let svg;

    const [window_width, window_height] = useWindowSize();

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
        //console.log(center, scale/800)
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
        states.transition().style("fill", null);
        d3.selectAll("circle").remove()
        d3.select(".rect-menu-fairyTales-cont").remove()
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    }

    const appendRectForPointClicked = (parent_target_g, target, size_rect)=>{
        parent_target_g.attr("class", "rect-menu-fairyTales-cont")
            .append('rect')
            .attr("class", "rect-menu-fairyTales")
            .attr('x', Number(target.attr("cx"))-size_rect[0]/2)
            .attr('y', Number(target.attr("cy"))-size_rect[1])
            .attr('width', size_rect[0])
            .attr('height', size_rect[1])
            .attr("rx", 2.5*scaleCenter.scale/800).attr("ry", 2.5*scaleCenter.scale/800)
    }

    const appendClipPathForCircleRectMenu = (parent_target_g, target, size_rect)=>{
        parent_target_g
            .append("defs").append("clipPath").attr("id", "cut-off-bottom").append("rect")
            .attr('x', Number(target.attr("cx"))-size_rect[0]/2)
            .attr('y', Number(target.attr("cy"))-1)
            .attr('width', size_rect[0])
            .attr('height', size_rect[1])
    }

    const appendSemiCircleForRectMenu = (parent_target_g, target)=>{
        parent_target_g.append("circle")
            .attr('cx', Number(target.attr("cx")))
            .attr('cy', Number(target.attr("cy")))
            .attr('r', Number(target.attr("r"))*1.4)
            .attr("id", "semicircle-rect-menu-fT") 
            .attr("clip-path", "url(#cut-off-bottom)")
    }

    const appendTextToRectMenuFairyTales = (parent_target_g, xText, yText, Text_, font_size_k)=>{
        const elem = parent_target_g.append("text").attr("class", "label-nationalityAndRegion-rect-menu")
            .attr('x', xText)
            .attr('y', yText)
            .style("font-size", String(font_size_k*scaleCenter.scale/800)+"px")
        if(!Number.isNaN(Number(Text_))){
            fetch('http://saintmolly.ru:3005/api/ethnic-group/'+String(Text_))
            .then(response => response.json()).then(commits=>{
                if(commits.statusCode === undefined)
                elem.text(commits["name"])
            })
        }else{
            elem.text(Text_)
        }
        
        return parent_target_g
    }

    const getAudio = (userAudioId)=>{
        fetch("http://saintmolly.ru:3005/api/user-audio/"+String(userAudioId))
        .then(response => response.blob())
        .then(blob=>{
            let mpeg = URL.createObjectURL(blob);
            document.getElementById("audio-elem").setAttribute("src", mpeg)
        })
    }

    const OnChangedSelect = (elem) =>{
        let parent = null
        if(elem.target.getAttribute("class") === "combobox-option"){
            parent = elem.target
        }
        else{
            parent = elem.target.parentNode
        }
        d3.select("#lang-select").style("display", "none")
        d3.select("#book-audio-author-in-book-profile").text(parent.getAttribute("author"))
        d3.select("#cont-author-audio").style("display", "block")
        const userAudioId = parent.getAttribute("useraudioid")
        d3.select("#combobox-btn").attr("userAudioId", userAudioId)
        getAudio(userAudioId)
        document.getElementById("combobox-btn-arrow").style.transform = "rotate(180deg)"
    }

    const FillBookInfoInBookProfile = (json)=>{
        d3.select("#bookname-in-book-profile").text(json["name"])
        
        if(json["audioId"] !== null){
            d3.select(".opened-book-img-profile").attr("src", "AudioAndBook.svg")
        }
        else {
            d3.select(".opened-book-img-profile").attr("src", "opened_book.svg")

        }
        const elemSelect = d3.select("#lang-select")
        elemSelect.selectChildren().remove()
        fetch("http://saintmolly.ru:3005/api/story/languages/"+String(json["id"]))
        .then(response => response.json())
        .then(commits=>{
            
            commits.map(item => {
                console.log(item)
                const author = item["authors"]
                console.log(author)
                const a = elemSelect.append("a")
                .attr("class", "combobox-option")
                .attr("audioId", item["id"])
                .attr("userAudioId", item["userAudioId"])
                .attr("author", author["firstName"]+" "+author["lastName"])
                .on("click", OnChangedSelect)
                a.append("span").text(item["language"]["name"])
                a.append("img").attr("src", "star.svg")
                fetch("http://saintmolly.ru:3005/api/story/rating/"+String(item["id"]))
                .then(response=>response.json()).then(commit=>{
                    a.append("span").text(commit["ratingAudio"])
                })
                //
            })
        })
        
        //d3.select("#book-audio-author-in-book-profile").text(json[])
    }

    const imageClicked = (storyId)=>{
        const preview = d3.select(".preview-img-book-reader")
        fetch('http://saintmolly.ru:3005/api/story/image/' + String(storyId))
        .then(response => response.blob())
        .then(blob=>{
            let img = URL.createObjectURL(blob);
            preview.attr("src", blob.type==="application/octet-stream" ? img : "Preview.jpg")
            .attr("storyId", storyId)
        })
        fetch("http://saintmolly.ru:3005/api/story/text/" + String(storyId))
        .then(response => {
            if(response.headers.get("content-type") !== null) return response.json();

        }).then(commits=>{
            //console.log(commits)
            if(commits !== undefined && commits !== null){
                d3.select(".cont-text-story").selectChild("section").text(commits["text"])
            }
        })
        fetch("http://saintmolly.ru:3005/api/story/" + String(storyId))
        .then(response => response.json())
        .then(commits => FillBookInfoInBookProfile(commits)) 
        d3.select("#main-reader-books-wrapper").style("display", "flex");
    }

    const FillBookInCatalogBooks = (commits)=>{
        commits.map(data=>{
            const list = d3.select(".cont-list-catalog-books").append("div").attr("class", "cont-bookInCatalog")
            //let URL = ;
            const preview = list.append("img").on('click', imageClicked.bind(this, data["id"]));
                fetch('http://saintmolly.ru:3005/api/story/image/'+String(data["id"]))
                .then(response => response.blob())
                .then(blob=>{
                    let img = URL.createObjectURL(blob);
                    preview.attr("src", blob.type==="application/octet-stream" ? img : "Preview.jpg")
                    .attr("class","preview-img-book")
                    .attr("storyId", data["id"])
                })
                
                list.append("span").text(data["name"])
            if(data["audioId"] !== null){
                /* list.append("span").text("Озвучил: ").attr("class", "author-book-span") */
                const div = list.append("div").attr("class", "book-specification-img")
                div.append("img").attr("src", "AudioAndBook.svg").attr("class", "AudioAndBook-img")
                //div.append("img").attr("src", "star.svg").attr("class", "img-star")
                
                /* if(data["audioId"] !== undefined)
                {
                    
                    fetch("http://saintmolly.ru:3005/api/story/rating/"+String(data["audioId"]))
                    .then(response => response.json())
                    .then(commit=>{
                        
                        div.append("span").attr("class", "rating-audio-book-in-catalog").text(commit["ratingAudio"])
                    })
                } */
                
            }
            if(data["audioId"] === null){
                const div = list.append("div").attr("class", "book-specification-img")
                div.append("img").attr("src", "opened_book.svg").attr("class", " opened-book-img")
                //div.append("img").attr("src", "star.svg").attr("class", "img-star")

            }
        })
    }

    const FillCatalogBooks = (event, target) =>{
        event.stopPropagation()
        d3.select("#main-cat-books-wrapper").style("display", "flex");
        d3.select("#ethnicGroup-span-list-fairyTales").attr("ethnicGroupId", target.attr("ethnicGroup"))
        fetch('http://saintmolly.ru:3005/api/ethnic-group/'+String(target.attr("ethnicGroup")))
            .then(response => response.json()).then(commits=>{
                d3.select("#ethnicGroup-span-list-fairyTales").text(commits["name"]);
                fetch('http://saintmolly.ru:3005/api/story/ethnic-group/'+String(target.attr("ethnicGroup")))
                    .then(response => response.json()).then(commits=>{
                        //d3.select(".list-catalog-books").selectChildren().remove()
                        d3.select(".cont-list-catalog-books").selectChildren().remove()
                        FillBookInCatalogBooks(commits)
                    })
            })
    }


    
    function pointClicked(event){
        event.stopPropagation()

        d3.select(".rect-menu-fairyTales-cont").remove()

        const parent_target = d3.select(event.target.parentNode)
        const target = d3.select(event.target)
        let size_rect = [20*scaleCenter.scale/800, 15*scaleCenter.scale/800];
        let parent_target_g = parent_target.insert("g", ":first-child")
                                            .attr("width", size_rect[0])
                                            .attr("height", size_rect[1])
        
        appendRectForPointClicked(parent_target_g, target, size_rect)
        
        const rect = d3.select(".rect-menu-fairyTales").on("click", SVGRectMenu)
 
        const xText = Number(rect.attr("x")) //+ 13.5 * scaleCenter.scale/800;
        const yText = Number(rect.attr("y")) + 5.5*scaleCenter.scale/800

        const content_svg = d3.select(".rect-menu-fairyTales-cont")
        .append("svg")
        .attr("class", "content-cont-rect-menu-svg")
        .attr("x", xText )
        .attr("y", yText- 6*scaleCenter.scale/850)
        .attr("width", size_rect[0])
        .attr("height", size_rect[1])
        
        
        appendTextToRectMenuFairyTales(content_svg, "50%", 3*scaleCenter.scale/800, target.attr("ethnicGroup"), 1.8)
        appendTextToRectMenuFairyTales(content_svg, "50%", 5*scaleCenter.scale/800, target.attr("regionName"), 1)

        const appendContentRect = (y, image_link, font_size_k, Text_, countText)=>{
            const width = size_rect[0]*0.75
            const rect_g = content_svg.append("g").attr("class", "cont-books-rects-menu")
            rect_g.on("click", FillCatalogBooks.bind(this, event, target))
            rect_g.append("rect")
            .attr("x", size_rect[0]/2 - (width)/2)
            .attr("y", y)
            .attr("width", width)
            .attr("height", 2.1*scaleCenter.scale/800)
            .attr("rx", scaleCenter.scale/800).attr("ry", scaleCenter.scale/800)

            rect_g.append("g:image")
            .attr("x", size_rect[0]/2 - width/2 + 1.4*scaleCenter.scale/800)
            .attr("y", y + ((2.1 - 1.4)*scaleCenter.scale/800)/2)
            .attr("width", 1.4*scaleCenter.scale/800)
            .attr("height", 1.4*scaleCenter.scale/800)
            .attr("xlink:href", image_link)
            
            const text =  rect_g.append("text")
            .attr("class", "text-rect-button-content-menu")
            .attr("x", size_rect[0]/2 - width/2 + 1.4*2*scaleCenter.scale/800 + 1.2*scaleCenter.scale/800)
            .style("font-size", String(font_size_k*scaleCenter.scale/800)+"px")
            .text(Text_)
            text.attr("y", y +((2.1)*scaleCenter.scale/800)/2 + (text.node().getBBox().height/2) - 0.25*scaleCenter.scale/800)

            const count =  rect_g.append("text")
            .attr("class", "countBooks-rect-button-content-menu text-rect-button-content-menu")
            .attr("x", width + scaleCenter.scale/800)
            .style("font-size", String(font_size_k*scaleCenter.scale/800)+"px")
            .text(countText)
            count.attr("y", y +((2.1)*scaleCenter.scale/800)/2 + (count.node().getBBox().height/2) - 0.25*scaleCenter.scale/800)
        }
        fetch('http://saintmolly.ru:3005/api/story/ethnic-group/'+String(target.attr("ethnicGroup")))
            .then(response => response.json()).then(commits=>{
                appendContentRect(6.8*scaleCenter.scale/800, "books.svg", 1, "Книги", commits.length)
                let countAudio = 0
                commits.map(data => {if(data["audioId"]) countAudio++})
                appendContentRect((6.8+2.7)*scaleCenter.scale/800, "note.svg", 1, "Аудиокниги", countAudio)
                parent_target_g = parent_target_g.append("g")

                appendClipPathForCircleRectMenu(parent_target_g, target, size_rect)

                appendSemiCircleForRectMenu(parent_target_g, target)
            }
        )
        
    }

    function PathClicked(event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        event.stopPropagation();
        
        let g = d3.select(".points");
        
        //let json = JSON.parse(points);
        
        if(d3.select(event.target).style("fill")!== "rgb(255, 0, 0)"){
            document.getElementsByClassName("points")[0].innerHTML="";
            //console.log(String(event.target.getAttribute("ID")))
            fetch("http://saintmolly.ru:3005/api/map/ethnic-group/"+String(event.target.getAttribute("ID")))
            .then(response => response.json())
            .then(commits =>{
                //console.log(commits)
                    if(commits.statusCode === undefined){
                         
                        commits.map((data)=>{
                            //console.log(data)
                            /* if(data["regionName"] === event.target.getAttribute("regionName")){ */
                            //console.log(data)
                            const coord = projection([Number(data["longitude"]), Number(data["latitude"])])
                            const circle = g.append("g").append('circle')
                            .attr('cx', coord[0])
                            .attr('cy', coord[1])
                            .attr('r', pointRadius)
                            .attr("regionName", event.target.getAttribute("regionName"))
                            .attr("ethnicGroup", data["ethnicGroupId"])
                            .attr("class", "points-circle")
                            .on("click", pointClicked)
                            
                                //.transition().duration(650).attr("r", (2.3*scaleCenter.scale/1000)*1.4);
                            //}
                        })
                    }}
                );
        }
        
        states.transition().style("fill", null);
        d3.select(event.target)
        .transition()
        .style("fill", "red");    
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(22, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, svg.node())
        );
    }

    const zoomPlus = ()=>{
        svg.transition().call(zoom.scaleBy, 1.5);
    };

    const zoomMinus = ()=>{
        svg.transition().call(zoom.scaleBy, 0.6);
    };
    const SVGRectMenu = (event)=>{
        event.stopPropagation()
    }

    useEffect(() => {
        //console.log(geojson)
        svg = d3.select("svg");
        svg.on("click", reset);
        states = d3.select("#states").selectAll("path")
                .data(data)
                .join("path")
                .style("stroke-linejoin", "round")
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