var original = true; //switches between original and recreation background

var opacity = 0.5;

var refreshBtn = document.getElementById("refresher");
var switchBtn = document.getElementById("switcher");
var slider = document.getElementById("slider");

var imgOrig = document.getElementById("preload_orig");
imgOrig.crossOrigin = "anonymous";
var original_url = document.getElementsByTagName("p")[0].innerText;

var img = document.getElementById("preload");
img.crossOrigin = "anonymous";
var newest_url = "https://live.mcatho.me/mainmenu/cubemap32.png?t="+Date.now();
img.src = newest_url;

var styler = document.getElementById("styler");

//--------------------------------------


var PanoViewer = eg.view360.PanoViewer; //shortcut


var container1 = document.getElementById("myPanoViewer1");
var panoViewer1 = new PanoViewer(container1, {
    image: original_url,
    projectionType: "cubemap",
    gyroMode: PanoViewer.GYRO_MODE.NONE
});
PanoControls.init(document.querySelector("#myPanoViewer1"), panoViewer1);

var container2 = document.getElementById("myPanoViewer2");
var panoViewer2 = new PanoViewer(container2, {
    image: newest_url,
    projectionType: "cubemap",
    gyroMode: PanoViewer.GYRO_MODE.NONE
});
PanoControls.init(document.querySelector("#myPanoViewer2"), panoViewer2);

panoViewer1.on("viewChange", function(e) {
  panoViewer2.lookAt({yaw: e.yaw, pitch: e.pitch, fov: e.fov});
});

/*panoViewer2.on("viewChange", function(e) {
  panoViewer1.lookAt({yaw: e.yaw, pitch: e.pitch, fov: e.fov});
});*/

//---------------------------------


//preloads a fresh recreation image
function reloadImg(e) {
  e.preventDefault();
  
  img.onload = refresh;
  
  //appended timestamp to prevent caching
  newest_url = "https://live.mcatho.me/mainmenu/cubemap32.png?t="+Date.now();
  img.src = newest_url;
}


function setImg1(im) {
  panoViewer1.setImage(im, {projectionType: PanoViewer.PROJECTION_TYPE.CUBEMAP});
  panoViewer1.on({"ready": function() {
    panoViewer1.lookAt({
      yaw:panoViewer2.getYaw(),
      pitch:panoViewer2.getPitch(),
      fov:panoViewer2.getFov()},
    0);
  }});
}

function setImg2(im) {
  panoViewer2.setImage(im, {projectionType: PanoViewer.PROJECTION_TYPE.CUBEMAP});
  panoViewer2.on({"ready": function() {
    panoViewer2.lookAt({
      yaw:panoViewer1.getYaw(),
      pitch:panoViewer1.getPitch(),
      fov:panoViewer1.getFov()},
    0);
  }});
}


function setOpac1(k) {
  styler.innerText = "#myPanoViewer1 canvas {z-index:4;opacity:"+k+";} #myPanoViewer2 canvas {z-index:3;opacity:1;}";
}

function setOpac2(k) {
  styler.innerText = "#myPanoViewer2 canvas {z-index:4;opacity:"+k+";} #myPanoViewer1 canvas {z-index:3;opacity:1;}";
}


//loads the fresh recreation image into the viewer
function refresh() {
  setImg2(img);
}

function flip(e) {
  e.preventDefault();
  original = !original;
  
  if(original) setOpac2(opacity);
  else setOpac1(opacity);
}


//document.addEventListener("contextmenu", flip);
document.addEventListener("keypress", function(e) {
  if(e.key=="f" || e.key=="F") {
    flip(e);
  }
  else if(e.key=="r" || e.key=="R") {
    reloadImg(e);
  }
});

refreshBtn.onclick = reloadImg
switchBtn.onclick = flip;

slider.oninput = function() {
  opacity = this.value;
  if(original) setOpac2(opacity);
  else setOpac1(opacity);
}
slider.onload = function() {this.value = 0.5;};

setOpac2(0.5);