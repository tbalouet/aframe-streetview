/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

require("./src/PanomNom.min.js");

window.onGoogleMapAPILoaded = function(){
  document.querySelectorAll("[streetview]").forEach(function(entity){
    entity.components["streetview"].loadPano();
  })
}

let apiScript = document.createElement("script");
apiScript.src = "https://maps.google.com/maps/api/js?";
apiScript.src += "key="+"AIzaSyDlXjRBMzVECLoqVIPCZyOT2Pl89QawvUw";
apiScript.src += "&callback=onGoogleMapAPILoaded";
document.querySelector("head").appendChild(apiScript);

/**
* 360 Street View component for A-Frame.
*/
AFRAME.registerComponent('streetview', {
  schema:{
    location : {type: "string", default:"40.730031, -73.991428"},
    radius : {type: "number", default: 100}
  },
  init: function () {
  },
  loadPano: function(){
    var that = this;

    let l = new PANOMNOM.GoogleStreetViewLoader();

    l.addEventListener( 'load', function() {
      let sphereElt = undefined;
      if(that.el.object3D.children.length && that.el.object3D.children[0].geometry.metadata.type === "SphereGeometry"){
        sphereElt = that.el;
      }
      else{
        sphereElt = document.createElement("a-sphere");
        sphereElt.setAttribute("radius", that.data.radius);
        that.el.appendChild(sphereElt);
      }
      sphereElt.setAttribute("material", {src :this.canvas.toDataURL(), side: "double"});
    } );

    l.addEventListener( 'error', function( e ) {
      console.log( e.message );
    } );

    l.addEventListener( 'progress', function( e ) {
      console.log( 'Loaded ' + ( e.message ).toFixed( 0 ) + '%' )
    } );

    let myLatlng = new google.maps.LatLng( that.data.location.split(",")[0], that.data.location.split(",")[1] );
    l.loadFromLocation( myLatlng, 3 );
  }
});
