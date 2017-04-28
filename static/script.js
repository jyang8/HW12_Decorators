var resetBtn = document.getElementById("resetbtn");
var playBtn = document.getElementById("playbtn");
var rewindBtn = document.getElementById("rewindbtn");
var playing = 0;
var slider = document.getElementById("timeSlider");
var playBtnIc = document.getElementById("playBtnIcon");
var rewindBtnIc = document.getElementById("rewindBtnIcon");
var rid;
var frameTime = 500;
var hsRadio = document.getElementById("hsRadio");
var colRadio = document.getElementById("colRadio");
var bothRadio = document.getElementById("bothRadio");
var timeText = document.getElementById("timeText");

var addStates = function(){
    var width = 50;

    var states = [
        ["Alabama", 7, 6],
        ["Alaska", 0, 0],
        ["Arizona", 2, 5],
        ["Arkansas", 5, 5],
        ["California", 1, 4],
        ["Colorado", 3, 4],
        ["Connecticut", 10, 3],
        ["Delaware", 10, 4],
        ["District of Columbia", 9, 5],
        ["Florida", 9, 7],
        ["Georgia", 8, 6],
        ["Hawaii", 0, 7],
        ["Idaho", 2, 2],
        ["Illinois", 6, 2],
        ["Indiana", 6, 3],
        ["Iowa", 5, 3],
        ["Kansa", 4, 5],
        ["Kentucky", 6, 4],
        ["Louisiana", 5, 6],
        ["Maine", 11, 0],
        ["Maryland", 9, 4],
        ["Massachusetts", 11, 2],
        ["Michigan", 8, 2],
        ["Minnesota", 5, 2],
        ["Mississippi", 6, 6],
        ["Missouri", 5, 4],
        ["Montana", 3, 2],
        ["Nebraska", 4, 4],
        ["Nevada", 2, 3],
        ["New Hampshire", 11, 1],
        ["New Jersey", 9, 3],
        ["New Mexico", 3, 5],
        ["New York", 9, 2],
        ["North Carolina", 7, 5],
        ["North Dakota", 4, 2],
        ["Ohio", 7, 3],
        ["Oklahoma", 4, 6],
        ["Oregon", 1, 3],
        ["Pennsylvania", 8, 3],
        ["Rhode Island", 10, 2],
        ["South Carolina", 8, 5],
        ["South Dakota", 4, 3],
        ["Tennessee", 6, 5],
        ["Texas", 4, 7],
        ["Utah", 2, 4],
        ["Vermont", 10, 1],
        ["Virginia", 8, 4],
        ["Washington", 1, 2],
        ["West Virginia", 7, 4],
        ["Wisconson", 7, 2],
        ["Wyoming", 3, 3],
    ];

    for (i = 0; i < states.length; i++){
        var state = states[i];
        var newState = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        newState.setAttribute("id", state[0]);
        newState.setAttribute("width", String(width));
        newState.setAttribute("height", String(width));
        newState.setAttribute("x", String(width/2 + width*state[1]));
        newState.setAttribute("y", String(width/2 + width*state[2]));
        newState.setAttribute("stroke", "white");
        s.appendChild(newState);
    };
};

var resetSlider = function(){
    slider.value = slider.getAttribute("min");
    timeText.innerHTML = slider.value;
    retrieveData();
}

var playForward = function(){
    playing = 1;
    playBtnIc.setAttribute("class", "glyphicon glyphicon-pause");
    play();
}

var playBackward = function(){
    playing = -1;
    rewindBtnIc.setAttribute("class", "glyphicon glyphicon-pause");
    rewind();
}

var masterControl = function(dir){

    if (!playing){
        if (slider.value == slider.getAttribute("max")){
            if (dir == 1) resetSlider();
            else playBtnIc.setAttribute("class", "glyphicon glyphicon-play");
        }

        if (dir == 1)	    playForward();
        else if (dir == -1) playBackward();
    }

    else if (playing == 1){
        playBtnIc.setAttribute("class", "glyphicon glyphicon-play");
        if (dir ==  1) playing = 0;
        else {
            playing = -1;
            playBackward();
        }
    }

    else if (playing == -1){
        rewindBtnIc.setAttribute("class", "glyphicon glyphicon-backward");
        if (dir == 1) {
            playing = 1;
            playForward();
        }
        else playing = 0;

    }

    else console.log("that's not good");
}

var play = function(){

    window.cancelAnimationFrame(rid);

    //console.log("max = " + slider.getAttribute("max"));
    var anim = function(){setTimeout(function(){

        slider.stepUp();
        timeText.innerHTML = slider.value;

        if (playing == 1 && slider.value < slider.getAttribute("max")){

            rid = window.requestAnimationFrame(anim);

        }

        if (slider.value == slider.getAttribute("max")){

            masterControl(1);
            playBtnIc.setAttribute("class", "glyphicon glyphicon-repeat");

        }
        retrieveData();
    }, frameTime);}

    anim();

}

var rewind = function(){

    window.cancelAnimationFrame(rid);

    var anim = function(){setTimeout(function(){

        slider.stepDown();
        timeText.innerHTML = slider.value;

        if (playing == -1 && slider.value > slider.getAttribute("min")){

            rid = window.requestAnimationFrame(anim);

        }

        if (slider.value == slider.getAttribute("min")){

            masterControl(-1);

        }
        retrieveData();
    }, frameTime);}

    anim();

}

var playButton = function(){
    masterControl(1);
}

var rewindButton = function(){
    masterControl(-1);
}

resetBtn.addEventListener("click", resetSlider);
rewindBtn.addEventListener("click", rewindButton);
playBtn.addEventListener("click", playButton);


var data = {};

var getSlider = function(){
    return slider.value;
}

var getDataset = function(){
    if (hsRadio.checked) return 0;
    else if (colRadio.checked) return 1;
    else return -1;
}

var retrieveData = function(){
    if (getDataset() == 0) {
        $.ajax({
            url: "/getHS",
            type: "GET",
            data: {"year": getSlider()},
            success: function(d){
                data = JSON.parse(d);
                loadMap();
            }
        });
    } else {
        $.ajax({
            url: "/getCollege",
            type: "GET",
            data: {"year": getSlider()},
            success: function(d){
                data = JSON.parse(d);
                loadMap();
            }
        });
    }
};

var onLoadFunctions = function(){
    resetSlider();
    hsRadio.checked = true;
    addStates();
    retrieveData();
}

window.onLoad = onLoadFunctions();

$("input[type=radio]").on("change", function() {
    retrieveData();
});

$("#timeSlider").on("change", function() {
    retrieveData();
    timeText.innerHTML = slider.value;
});

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var loadMap = function() {
    var color;
    if (getDataset() == 0) {
        color = "rgb(255, 0, 0)";
    } else {
        color = "rgb(0, 0, 255)";
    }
    var formatted = []
    var keys = Object.keys(data).sort();
    var values = keys.map(k => parseFloat(data[k]))
    for (var i = 0; i < keys.length; i++) {
        formatted.push({
            "state": keys[i],
            "data": data[keys[i]]
        });
    }
    var opacityScale = d3.scale.linear()
        .domain([d3.min(values), d3.max(values)])
        .range([0.1, 1])
    d3.select("svg").selectAll("rect")
        .data(formatted)
        .attr("fill", function(d, i) {
            return color;
        })
        .attr("fill-opacity", function(d, i) {
            return opacityScale(d["data"])
        })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div .html(d["state"] + "<br>" + d["data"] + "%")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .enter()
}
