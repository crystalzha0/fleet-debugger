(this["webpackJsonpdune-buggy"]=this["webpackJsonpdune-buggy"]||[]).push([[0],{151:function(e,t,a){"use strict";a.r(t);var o,n,i,s,r,l,c,u,g,d,p,m,h,f,v=a(7),S=a.n(v),T=a(21),y=a(4),w=a(5),O=a(58),D=a(57),L=a(0),b=a.n(L),j=a(22),k=a(1),C=a.n(k),F=a(19),R=a(6),x=a(23),_=a.n(x),P=function(e){var t=window.location.protocol+"//"+window.location.host+window.location.pathname+e;window.history.pushState({path:t},"",t)},E=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:window.location.search,a=_.a.parse(t);return a[e]},I=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window.location.search,o=_.a.parse(a),n=_.a.stringify(Object(R.a)(Object(R.a)({},o),{},Object(F.a)({},e,t)));P("?".concat(n))},A=function(){function e(){Object(y.a)(this,e)}return Object(w.a)(e,null,[{key:"formatDuration",value:function(e){var t=e/1e3,a=Math.floor(t/3600),o=Math.floor((t-3600*a)/60),n=Math.floor(t-3600*a-60*o),i="";return a>0&&(i+=a+" hours "),o>0&&(i+=o+" minutes "),n>0&&(i+=n+" seconds"),i}}]),e}(),M=a(2),N=new Promise((function(e){o=e})),V=[],U=[],H=[],J={},W={},B=function(e){return e===j.Status.LOADING?Object(M.jsxs)("h3",{children:[e," .."]}):e===j.Status.FAILURE?Object(M.jsxs)("h3",{children:[e," ..."]}):null};function G(e){C.a.forEach(V,(function(e){return e.setMap(null)})),V=[],C.a.forEach(U,(function(e){return e.setMap(null)})),U=[];var t,a=m.getTrips(),o=new window.google.maps.LatLngBounds;if(C.a.forEach(a,(function(a){var s,r=a.getPathCoords(n,i);if(r.length>0){t=C.a.last(r);var l=new window.google.maps.Polyline({path:r,geodesic:!0,strokeColor:K(a.tripIdx),strokeOpacity:.5,strokeWeight:6});google.maps.event.addListener(l,"mouseover",(function(){l.setOptions({strokeOpacity:1,strokeWeight:8})})),google.maps.event.addListener(l,"mouseout",(function(){l.setOptions({strokeOpacity:.5,strokeWeight:6})})),google.maps.event.addListener(l,"click",(function(){var e=a.getFeaturedData();h(e),f(e.firstUpdate.getTime(),e.lastUpdate.getTime())})),s=o,l.getPath().forEach((function(e){s.extend(e)})),l.setMap(e),V.push(l)}})),t){var s=new window.google.maps.Marker({position:t,map:e,icon:{url:"http://maps.google.com/mapfiles/kml/shapes/"+("LMFS"===p?"truck.png":"cabs.png"),scaledSize:new google.maps.Size(25,25)},title:"Last Location"});U.push(s)}return o}function q(){var e=Object(L.useRef)();return Object(L.useEffect)((function(){var t,a=E("zoom"),n=E("center");t=e.current,d=new google.maps.journeySharing.FleetEngineTripLocationProvider({projectId:g,authTokenFetcher:function(e){return console.log("Ignoring options using prebuilt jwt",e),{token:u}}}),s=new google.maps.journeySharing.JourneySharingMapView({element:t,locationProvider:d}).map,o();var i=G(s);a&&n?(console.log("setting zoom & center from url",a,n),s.setZoom(parseInt(a)),s.setCenter(JSON.parse(n))):s.fitBounds(i),s.addListener("zoom_changed",(function(){I("zoom",s.getZoom())})),s.addListener("center_changed",C.a.debounce((function(){I("center",JSON.stringify(s.getCenter().toJSON()))}),100))})),Object(M.jsx)("div",{ref:e,id:"map",style:{height:"500px"}})}function K(e){var t=["#2d7dd2","#97cc04","#eeb902","#f45d01","#474647","00aa00"];return t[e%t.length]}function z(e){m=e.logData.tripLogs,n=m.minDate.getTime(),i=m.maxDate.getTime();var t=new URLSearchParams(window.location.search);return r=t.get("apikey")||e.logData.apikey,u=e.logData.jwt,g=e.logData.projectId,p=e.logData.solutionType,Object(M.jsx)(j.Wrapper,{apiKey:r,render:B,version:"beta",libraries:["geometry","journeySharing"],children:Object(M.jsx)(q,{})})}var Y=C.a.debounce((function(e,t){n=new Date(e),i=new Date(t),G(s),C.a.forEach(W,(function(e,t){J[t]&&e(!0)}))}),100);function X(e,t){return function(a){C.a.forEach(J[e],(function(e){return e.setMap(null)})),delete J[e],a&&(J[e]=m.getLogs_(n,i).map((function(e){var a,o=e.lastLocation,n=void 0;return o&&(a=o.rawLocation)&&(n=t(new google.maps.LatLng({lat:a.latitude,lng:a.longitude}),o,e)),n})).compact().value())}}W.showGPSBubbles=X("showGPSBubbles",(function(e,t){var a;switch(t.locSensor){case"LOCATION_SENSOR_GPS":case"LOCATION_SENSOR_FUSED_LOCATION_PROVIDER":a="#11FF11";break;case"LOCATION_SENSOR_NETWORK":a="#FF1111";break;case"LOCATION_SENSOR_PASSIVE":a="#FF0000";break;case"LOCATION_SENSOR_ROAD_SNAPPED_LOCATION_PROVIDER":a="#00FF00";break;default:a="#000000"}var o=t.rawLocationAccuracy;if(o){var n=new google.maps.Circle({strokeColor:a,strokeOpacity:.6,strokeWeight:2,fillColor:a,fillOpacity:.2,map:s,center:e,radius:o});return google.maps.event.addListener(n,"mouseover",(function(){h({rawLocationAccuracy:t.rawLocationAccuracy,locSensor:t.locSensor})})),n}})),W.showClientServerTimeDeltas=X("showClientServerTimeDeltas",(function(e,t,a){var o=C.a.get(a.lastLocationResponse,"rawLocationTime"),n=C.a.get(a.lastLocationResponse,"serverTime");if(o&&n){var i,r=new Date(o),l=new Date(n),c=Math.abs(r.getTime()-l.getTime())/1e3;i=r>l?"#0000F0":"#0F0000";var u=new google.maps.Circle({strokeColor:i,strokeOpacity:.6,strokeWeight:2,fillColor:i,fillOpacity:.2,map:s,center:e,radius:c});return google.maps.event.addListener(u,"mouseover",(function(){h({timeDeltaSeconds:c,serverDate:l,clientDate:r})})),u}})),W.showHeading=X("showHeading",(function(e,t,a){var o=C.a.get(a.lastLocation,"heading"),n=C.a.get(a.lastLocation,"bearingAccuracy");if(o&&n){var i=new google.maps.Polyline({strokeColor:"#0000F0",strokeOpacity:.6,strokeWeight:2,icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,strokeColor:"#0000FF",strokeWeight:4},offset:"100%"}],map:s,path:[e,google.maps.geometry.spherical.computeOffset(e,20,o)]});return google.maps.event.addListener(i,"click",(function(){c=new google.maps.StreetViewPanorama(document.getElementById("map"),{position:e,pov:{heading:o,pitch:10},addressControlOptions:{position:google.maps.ControlPosition.BOTTOM_CENTER},linksControl:!1,panControl:!1,enableCloseButton:!0}),console.log("loaded panorama",c)})),i}})),W.showSpeed=X("showSpeed",(function(e,t){var a=t.speed;if(void 0!==t.speed){var o=a<0?"#FF0000":"#00FF00";return new google.maps.Circle({strokeColor:o,strokeOpacity:.5,fillColor:o,fillOpacity:.5,map:s,center:e,radius:Math.abs(a)})}})),W.showTripStatus=X("showTripStatus",(function(e,t,a){var o,n=5,i=m.getTripStatusAtDate(a.date);switch(i){case"TRIP_STATUS_NEW":o="#002200",n=30;break;case"TRIP_STATUS_ENROUTE_TO_PICKUP":o="#FFFF00";break;case"TRIP_STATUS_ARRIVED_AT_PICKUP":o="#FFFF10",n=10;break;case"TRIP_STATUS_ARRIVED_AT_INTERMEDIATE_DESTINATION":o="10FFFF",n=20;break;case"TRIP_STATUS_ENROUTE_TO_DROPOFF":o="00FFFF";break;case"TRIP_STATUS_COMPLETE":n=30,o="#00FF00";break;case"TRIP_STATUS_CANCELED":n=30,o="#FF0000";break;default:o="#000000"}var r=new google.maps.Circle({strokeColor:o,strokeOpacity:.5,fillColor:o,fillOpacity:.5,map:s,center:e,radius:n});return google.maps.event.addListener(r,"mouseover",(function(){h({tripStatus:i})})),r})),W.showTraffic=function(e){l||(l=new google.maps.TrafficLayer),e?l.setMap(s):l.setMap(null)},W.showDwellLocations=function(e){var t="showDwellLocations",a=m.getDwellLocations(n,i);C.a.forEach(J[t],(function(e){return e.setMap(null)})),delete J[t],e&&(J[t]=C.a.map(a,(function(e){var t=new google.maps.Circle({strokeColor:"#000000",strokeOpacity:.25,fillColor:"#FFFF00",fillOpacity:.25,map:s,center:e.leaderCoords,radius:3*e.updates});return google.maps.event.addListener(t,"mouseover",(function(){h({startDate:e.startDate,duration:A.formatDuration(e.endDate-e.startDate),endDate:e.endDate})})),t})))},W.showNavStatus=X("showNavStatus",(function(e,t,a){var o=a.navStatus;if(void 0!==o){var n,i=5;switch(o){case"NAVIGATION_STATUS_UNKNOWN_NAVIGATION_STATUS":n="#222222";break;case"NAVIGATION_STATUS_NO_GUIDANCE":n="#090909";break;case"NAVIGATION_STATUS_ENROUTE_TO_DESTINATION":n="#00FF00";break;case"NAVIGATION_STATUS_OFF_ROUTE":n="#FF0000",i=30;break;case"NAVIGATION_STATUS_ARRIVED_AT_DESTINATION":n="0000FF",i=10;break;default:n="#000000"}var r=new google.maps.Circle({strokeColor:n,strokeOpacity:.5,fillColor:n,fillOpacity:.5,map:s,center:e,radius:i});return google.maps.event.addListener(r,"mouseover",(function(){h({navStatus:o,vehicleState:C.a.get(a,"jsonPayload.response.state"),tripStatus:"??"})})),r}})),W.showETADeltas=function(e){var t="showETADeltas";C.a.forEach(J[t],(function(e){return e.setMap(null)})),delete J[t];var a=m.getETADeltas(n,i);e&&(J[t]=C.a.map(a,(function(e){var t=new google.maps.Circle({strokeColor:"#000000",strokeOpacity:.25,fillColor:"FF0000",fillOpacity:.25,map:s,center:e.coords,radius:C.a.min([e.deltaInSeconds,300])});return google.maps.event.addListener(t,"mouseover",(function(){h({etaDeltaInSeconds:e.deltaInSeconds})})),t})))},W.showHighVelocityJumps=function(e){var t="showHighVelocityJumps",a=m.getHighVelocityJumps(n,i);C.a.forEach(J[t],(function(e){return e.setMap(null)})),delete J[t],e?J[t]=C()(a).map((function(e){function t(e){return e<=100?2:e<1e3?6:e<2e3?10:14}var a=new window.google.maps.Polyline({path:[e.startLoc,e.endLoc],geodesic:!0,strokeColor:K(e.jumpIdx),strokeOpacity:.8,strokeWeight:t(e.velocity),map:s,icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,strokeColor:K(e.jumpIdx),strokeWeight:t(e.velocity)},offset:"100%"}]});return google.maps.event.addListener(a,"mouseover",(function(){h(e.getFeaturedData())})),google.maps.event.addListener(a,"click",(function(){h(e.getFeaturedData()),f(e.startDate.getTime()-6e4,e.endDate.getTime()+6e4)})),[a]})).flatten().value():f(m.minDate.getTime(),m.maxDate.getTime())},W.showMissingUpdates=function(e){var t="showMissingUpdates",a=m.getMissingUpdates(n,i);C.a.forEach(J[t],(function(e){return e.setMap(null)})),delete J[t],e?J[t]=C()(a).map((function(e){function t(e){return e<=6e4?2:e<6e5?6:e<36e6?10:14}var a=(google.maps.geometry.spherical.computeHeading(e.startLoc,e.endLoc)+360+90)%360-180,o=[e.startLoc,google.maps.geometry.spherical.computeOffset(e.startLoc,1e3,a),google.maps.geometry.spherical.computeOffset(e.startLoc,900,a),google.maps.geometry.spherical.computeOffset(e.endLoc,900,a),google.maps.geometry.spherical.computeOffset(e.endLoc,1e3,a),e.endLoc],n=new window.google.maps.Polyline({path:o,geodesic:!0,strokeColor:"#008B8B",strokeOpacity:.5,strokeWeight:t(e.interval),map:s,icons:[{icon:{path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,strokeColor:"#008B8B",strokeWeight:t(e.interval),scale:6},offset:"50%"},{icon:{path:google.maps.SymbolPath.CIRCLE,scale:6,strokeColor:"#000000",strokeWeight:1,strokeOpacity:.5},offset:"0%"},{icon:{path:google.maps.SymbolPath.CIRCLE,scale:6,strokeColor:"#000000",strokeWeight:1,strokeOpacity:.5},offset:"100%"}]});return google.maps.event.addListener(n,"mouseover",(function(){h(e.getFeaturedData()),n.setOptions({strokeOpacity:1,strokeWeight:1.5*t(e.interval)})})),google.maps.event.addListener(n,"mouseout",(function(){n.setOptions({strokeOpacity:.5,strokeWeight:t(e.interval)})})),google.maps.event.addListener(n,"click",(function(){h(e.getFeaturedData()),f(e.startDate.getTime()-6e4,e.endDate.getTime()+6e4)})),[n]})).flatten().value():f(m.minDate.getTime(),m.maxDate.getTime())},W.showLiveJS=function(e){u?d.tripId=e?C.a.last(m.getTripIDs()):"":console.log("Issue #25 -- no/invalid jwt")};var Z=a(48),Q=a.n(Z);var $=function(e){return Object(M.jsx)(Q.a,{src:e.featuredObject,onSelect:e.onClick})},ee=a(33),te=(a(148),(0,ee.a.createSliderWithTooltip)(ee.a.Range)),ae={width:"100%"};var oe,ne=function(e){var t=e.logData.tripLogs,a={};C.a.map(t.getTripStatusChanges(),(function(e){a[e.date.getTime()]={}}));var o=t.minDate.getTime(),n=t.maxDate.getTime(),i=C.a.max([o,e.curMin]),s=C.a.min([n,e.curMax]);return Object(M.jsx)("div",{style:ae,children:Object(M.jsx)(te,{min:o,max:n,marks:a,step:1,onChange:function(t){e.onSliderChange({minTime:t[0],maxTime:t[1]})},defaultValue:[o,n],value:[i,s],tipFormatter:function(e){var a=new Date(e),o=t.getTripStatusAtDate(new Date(e));return"".concat(a).concat(o)}})})},ie=a(11),se=a(52),re=a(12),le=re.a.div(oe||(oe=Object(ie.a)(["\n  padding: 1rem;\n\n  table {\n    border-spacing: 0;\n    border: 1px solid black;\n\n    tr {\n      :last-child {\n        td {\n          border-bottom: 0;\n        }\n      }\n    }\n\n    th,\n    td {\n      margin: 0;\n      padding: 0.5rem;\n      border-bottom: 1px solid black;\n      border-right: 1px solid black;\n\n      :last-child {\n        border-right: 0;\n      }\n    }\n  }\n"])));function ce(e){var t=e.columns,a=e.data,o=e.onSelectionChange,n=Object(se.useTable)({columns:t,data:a}),i=n.getTableProps,s=n.getTableBodyProps,r=n.headerGroups,l=n.rows,c=n.prepareRow;return Object(M.jsxs)("table",Object(R.a)(Object(R.a)({},i()),{},{children:[Object(M.jsx)("thead",{children:r.map((function(e){return Object(M.jsx)("tr",Object(R.a)(Object(R.a)({},e.getHeaderGroupProps()),{},{children:e.headers.map((function(e){return Object(M.jsx)("th",Object(R.a)(Object(R.a)({},e.getHeaderProps()),{},{children:e.render("Header")}))}))}))}))}),Object(M.jsx)("tbody",Object(R.a)(Object(R.a)({},s()),{},{children:l.map((function(e){return c(e),Object(M.jsx)("tr",Object(R.a)(Object(R.a)({},e.getRowProps()),{},{onClick:function(){return o(e.original)},children:e.cells.map((function(e){return Object(M.jsx)("td",Object(R.a)(Object(R.a)({},e.getCellProps()),{},{children:e.render("Cell")}))}))}))}))}))]}))}var ue,ge,de,pe=function(e){var t=e.value,a=e.trim;return Object(M.jsx)(M.Fragment,{children:t&&t.replace(a,"")})};function me(e){var t=e.timeRange.minTime,a=e.timeRange.maxTime,o=e.logData.tripLogs.getLogs_(new Date(t),new Date(a)).value(),n=b.a.useMemo((function(){var t=C.a.filter([{Header:"Date",accessor:"formattedDate",solutionTypes:["ODRD","LMFS"]},{Header:"SDK Version",accessor:"jsonPayload.request.header.sdkVersion",solutionTypes:["ODRD","LMFS"]},{Header:"OS Version",accessor:"jsonPayload.request.header.osVersion",solutionTypes:["ODRD","LMFS"]},{Header:"Method",accessor:"jsonPayload.@type",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(pe,{value:t,trim:"type.googleapis.com/maps.fleetengine."})},solutionTypes:["ODRD","LMFS"]},{Header:"Vehicle",accessor:"labels.vehicle_id",solutionTypes:["ODRD"]},{Header:"Vehicle",accessor:"labels.delivery_vehicle_id",solutionTypes:["LMFS"]},{Header:"Trip",accessor:"labels.trip_id",solutionTypes:["ODRD"]},{Header:"Vehicle State",accessor:"jsonPayload.response.state",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(pe,{value:t,trim:"VEHICLE_STATE_"})},solutionTypes:["ODRD"]},{Header:"Task State",accessor:"jsonPayload.response.state",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(pe,{value:t,trim:"TASK_STATE_"})},solutionTypes:["LMFS"]},{Header:"Trip Status",accessor:"jsonPayload.response.status",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(pe,{value:t,trim:"TRIP_STATUS_"})},solutionTypes:["ODRD"]},{Header:"Remaining tasks",id:"reamining_tasks",accessor:"jsonPayload.response.remainingVehicleJourneySegments",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(M.Fragment,{children:t&&C.a.sumBy(t,"stop.tasks.length")})},solutionTypes:["LMFS"]},{Header:"Remaining Distance This Segment",accessor:"jsonPayload.request.deliveryVehicle.remainingDistanceMeters",solutionTypes:["LMFS"]},{Header:"Remaining Segements",accessor:"jsonPayload.response.remainingVehicleJourneySegments",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(M.Fragment,{children:t&&t.length})},solutionTypes:["LMFS"]},{Header:"Nav Status",accessor:"navStatus",Cell:function(e){var t=e.cell.value;return Object(M.jsx)(pe,{value:t,trim:"NAVIGATION_STATUS_"})},solutionTypes:["ODRD","LMFS"]}],(function(t){return-1!==t.solutionTypes.indexOf(e.logData.solutionType)}));return C.a.map(e.extraColumns,(function(e){var a=e.split(".");t.push({Header:a[a.length-1],accessor:e})})),[{Header:"Log Entries (click row to view full log entry)",columns:t}]}),[e.extraColumns]);return Object(M.jsx)(le,{children:Object(M.jsx)(ce,{columns:n,data:o,onSelectionChange:e.onSelectionChange})})}var he=re.a.button(ue||(ue=Object(ie.a)([""]))),fe=Object(re.a)(he)(ge||(ge=Object(ie.a)(["\n  opacity: 0.6;\n  ","\n"])),(function(e){return e.active&&"\n    opacity: 1;\n    color: Green;\n  "})),ve=re.a.div(de||(de=Object(ie.a)(["\n  display: flex;\n"])));var Se=function(e){var t=e.toggleState,a=C.a.map(e.toggles,(function(a){return Object(M.jsxs)(fe,{active:t[a.id],onClick:function(){return e.clickHandler(a.id)},children:[a.name,Object(M.jsx)("a",{href:a.docLink,target:"_blank",rel:"noreferrer",children:"?"})]},a.id)}));return Object(M.jsx)(ve,{children:a})};function Te(e,t){return"true"===E(e)&&(t=!0),t}var ye,we,Oe,De,Le,be=function(e){Object(O.a)(a,e);var t=Object(D.a)(a);function a(e){var o;Object(y.a)(this,a),o=t.call(this,e);var n=new Date,i=E("minTime"),s=E("maxTime");return o.initialMinTime=i?parseInt(i):0,o.initialMaxTime=s?parseInt(s):n.setFullYear(n.getFullYear()+1),o.logData=e.logData,o.state={timeRange:{minTime:o.initialMinTime,maxTime:o.initialMaxTime},featuredObject:{msg:"Click a table row to select object"},extraColumns:[],toggleOptions:{showGPSBubbles:Te("showGPSBubbles",!1),showHeading:Te("showHeading",!1),showSpeed:Te("showSpeed",!1),showTraffic:Te("showTraffic",!1),showTripStatus:Te("showTripStatus",!1),showDwellLocations:Te("showDwellLocations",!1),showNavStatus:Te("showNavStatus",!1),showETADeltas:Te("showETADeltas",!1),showHighVelocityJumps:Te("showHighVelocityJumps",!1),showMissingUpdates:Te("showMissingUpdates",!1),showLiveJS:Te("showLiveJS",!1),showClientServerTimeDeltas:Te("showClientServerTimeDeltas",!1)}},o.onSliderChangeDebounced=C.a.debounce((function(e){return o.onSliderChange(e)}),25),h=function(e){return o.setFeaturedObject(e)},f=function(e,t){return o.setTimeRange(e,t)},o.toggles=C.a.filter([{id:"showGPSBubbles",name:"GPS Accuracy",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/GPSAccuracy.md",columns:["lastLocation.rawLocationAccuracy","lastLocation.locSensor"],solutionTypes:["ODRD","LMFS"]},{id:"showHeading",name:"Heading",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/Heading.md",columns:["lastLocation.heading","lastLocation.bearingAccuracy"],solutionTypes:["ODRD","LMFS"]},{id:"showSpeed",name:"Speed",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/Speed.md",columns:["lastLocation.speed"],solutionTypes:["ODRD","LMFS"]},{id:"showTripStatus",name:"Trip Status",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/TripStatus.md",columns:[],solutionTypes:["ODRD"]},{id:"showNavStatus",name:"Navigation Status",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/NavStatus.md",columns:[],solutionTypes:["ODRD","LMFS"]},{id:"showDwellLocations",name:"Dwell Locations",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/DwellTimes.md",columns:[],solutionTypes:["ODRD","LMFS"]},{id:"showHighVelocityJumps",name:"Jumps (unrealistic velocity)",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/VelocityJumps.md",columns:["lastLocation.speed"],solutionTypes:["ODRD","LMFS"]},{id:"showMissingUpdates",name:"Jumps (Temporal)",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/MissingUpdates.md",columns:["jsonPayload.temporal_gap"],solutionTypes:["ODRD","LMFS"]},{id:"showClientServerTimeDeltas",name:"Client/Server Time Deltas",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/README.md",columns:["jsonPayload.response.lastLocation.rawLocationTime","jsonPayload.response.lastLocation.serverTime"],solutionTypes:["ODRD","LMFS"]},{id:"showETADeltas",name:"ETA Deltas",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/docs/EtaDeltas.md",columns:["jsonPayload.request.vehicle.etaToFirstWaypoint"],solutionTypes:["ODRD"]},{id:"showTraffic",name:"Traffic",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/README.md",columns:[],solutionTypes:["ODRD","LMFS"]},{id:"showLiveJS",name:"Start Live Journey Sharing for newest trip",docLink:"https://github.com/googlemaps/fleet-debugger/blob/main/README.md",columns:[],solutionTypes:["ODRD","LMFS"]}],(function(e){return-1!==e.solutionTypes.indexOf(o.logData.solutionType)})),o}return Object(w.a)(a,[{key:"componentDidMount",value:function(){var e=this;N.then((function(){e.setTimeRange(e.initialMinTime,e.initialMaxTime),C.a.map(e.toggles,(function(t){"true"===E(t.id)&&e.updateToggleState(!0,t.id,t.columns)}))}))}},{key:"updateToggleState",value:function(e,t,a){this.setState((function(o){o.toggleOptions[t]=e,function(e,t){W[e](t)}(t,e),I(t,e);var n=C.a.clone(o.extraColumns);return C.a.forEach(a,(function(t){e?n.push(t):C.a.pull(n,t)})),o.extraColumns=C.a.uniq(n),o}))}},{key:"onSliderChange",value:function(e){this.setTimeRange(e.minTime,e.maxTime)}},{key:"onSelectionChange",value:function(e){!function(e){C.a.forEach(H,(function(e){return e.setMap(null)})),H=[];var t={path:"M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",fillColor:"blue",fillOpacity:.6,strokeWeight:0,rotation:0,scale:2,anchor:new google.maps.Point(15,30)},a=C.a.get(e.lastLocation,"rawLocation");if(a){var o=C.a.get(e,"jsonPayload.response.status"),n=C.a.get(e,"jsonPayload.response.state"),i=new window.google.maps.Marker({position:{lat:a.latitude,lng:a.longitude},map:s,icon:t,title:"Vehicle state "+n+" Trip Status "+o});H.push(i)}}(e),this.setFeaturedObject(e)}},{key:"setFeaturedObject",value:function(e){this.setState({featuredObject:e})}},{key:"setTimeRange",value:function(e,t){I("minTime",e),I("maxTime",t),this.setState({timeRange:{minTime:e,maxTime:t}}),Y(e,t)}},{key:"onDataframePropClick",value:function(e){this.setState((function(t){var a=C.a.join(e.namespace,".")+"."+e.name;return{extraColumns:C.a.find(t.extraColumns,(function(e){return e===a}))?C.a.without(t.extraColumns,a):[].concat(Object(T.a)(t.extraColumns),[a])}}))}},{key:"toggleClickHandler",value:function(e){var t=C.a.find(this.toggles,{id:e}),a=!this.state.toggleOptions[e];this.updateToggleState(a,e,t.columns)}},{key:"render",value:function(){var e=this;return Object(M.jsxs)("div",{children:[Object(M.jsx)(ne,{logData:this.logData,curMin:this.state.timeRange.minTime,curMax:this.state.timeRange.maxTime,onSliderChange:this.onSliderChangeDebounced}),Object(M.jsx)(Se,{toggles:this.toggles,toggleState:this.state.toggleOptions,clickHandler:function(t){return e.toggleClickHandler(t)}}),Object(M.jsxs)("div",{style:{width:"100%",marginTop:"20px"},children:[Object(M.jsx)("div",{style:{width:"65%",overflowX:"scroll",overFlowY:"scroll",height:"100%",float:"left"},children:Object(M.jsx)(me,{logData:this.logData,style:{width:"100%"},timeRange:this.state.timeRange,extraColumns:this.state.extraColumns,onSelectionChange:function(t){return e.onSelectionChange(t)}})}),Object(M.jsx)("div",{style:{marginLeft:"65%",overFlowX:"scroll",overFlowY:"scroll",height:"100%"},children:Object(M.jsx)($,{featuredObject:this.state.featuredObject,onClick:function(t){return e.onDataframePropClick(t)}})})]})]})}}]),a}(b.a.Component),je=a(20),ke=a.n(je),Ce=a(56),Fe=function(){function e(t,a,o){Object(y.a)(this,e),this.tripIdx=t,this.tripName=a,this.updateRequests=1,this.pathCoords=[],this.tripDuration=0,this.creationTime="Unknown",this.firstUpdate=o,this.lastUpdate="Unknown"}return Object(w.a)(e,[{key:"getTraveledDistance",value:function(){return window.google.maps.geometry.spherical.computeLength(this.pathCoords)}},{key:"getFeaturedData",value:function(){return{updateRequests:this.updateRequests,tripName:this.tripName,duration:A.formatDuration(this.tripDuration),creationTime:this.creationTime,traveledDistanceKilometers:this.getTraveledDistance()/1e3,traveledDistanceMiles:this.getTraveledDistance()/1609,firstUpdate:this.firstUpdate,lastUpdate:this.lastUpdate}}},{key:"getPathCoords",value:function(e,t){return e&&t?C()(this.pathCoords).filter((function(a){return a.date>=e&&a.date<=t})).value():this.pathCoords}},{key:"appendCoords",value:function(e,t){this.pathCoords.push({lat:e.rawLocation.latitude,lng:e.rawLocation.longitude,trip_id:this.tripName,date:new Date(t)})}}]),e}(),Re=function(){function e(){Object(y.a)(this,e)}return Object(w.a)(e,null,[{key:"median",value:function(e){if(1===e.length)return e[0];var t=Object(T.a)(e).sort(),a=Math.ceil(t.length/2),o=Math.floor(t.length/2);return a===o?t[o]:(t[a]+t[o])/2}}]),e}(),xe=0,_e=function(){function e(t,a,o){Object(y.a)(this,e);var n=a.lastLocation,i=o.lastLocation,s=new google.maps.LatLng({lat:n.rawLocation.latitude,lng:n.rawLocation.longitude}),r=new google.maps.LatLng({lat:i.rawLocation.latitude,lng:i.rawLocation.longitude}),l=window.google.maps.geometry.spherical.computeDistanceBetween(s,r),c=o.date-a.date,u=l/(c/1e3);this.entry=o,this.prevEntry=a,this.timeSpentMS=c,this.distanceTraveled=l,this.velocity=u,this.startLoc=s,this.startDate=a.date,this.endDate=o.date,this.endLoc=r,this.jumpIdx=t}return Object(w.a)(e,[{key:"getFeaturedData",value:function(){return{timeSpentMS:this.timeSpentMS,distanceTraveled:this.distanceTraveled,velocity:this.velocity,velocityMPH:2.237*this.velocity,startLoc:this.startLoc.toString(),startDate:this.prevEntry.date,endDate:this.entry.date,endLoc:this.endLoc.toString(),jumpIdx:this.jumpIdx,date:this.entry.date,computedOutlierVelocity:xe}}},{key:"getLogViewerEntry",value:function(){var e=this.getFeaturedData();return e.timestampMS=this.startDate.getTime(),e.formattedDate=this.startDate.toISOString(),e.jsonPayload={"@type":"Jump"},e.lastLocation={speed:this.velocity},e}}],[{key:"getSignificantJumps",value:function(e){if(!e)return[];var t=C.a.map(e,"velocity"),a=C.a.mean(t),o=Re.median(t),n=C.a.min(t),i=C.a.max(t);return console.log("avgVelocity",a),console.log("medianVelocity",o),console.log("minVelocity",n),console.log("maxVelocity",i),xe=C.a.min([68,100*o]),C()(e).filter((function(e){return e.velocity>=xe})).sortBy("velocity").value()}}]),e}(),Pe=0,Ee=function(){function e(t,a,o){Object(y.a)(this,e);var n=o.date-a.date,i=o.lastLocation,s=a.lastLocation,r=new google.maps.LatLng({lat:s.rawLocation.latitude,lng:s.rawLocation.longitude}),l=new google.maps.LatLng({lat:i.rawLocation.latitude,lng:i.rawLocation.longitude});this.entry=o,this.prevEntry=a,this.interval=n,this.startLoc=r,this.startDate=a.date,this.endDate=o.date,this.endLoc=l,this.idx=t,this.startVehicleState=C.a.get(o,"jsonPayload.response.state"),this.endVehicleState=C.a.get(a,"jsonPayload.response.state"),this.duration=A.formatDuration(this.interval)}return Object(w.a)(e,[{key:"getFeaturedData",value:function(){return{duration:this.duration,interval:this.interval,startDate:this.startDate,startLoc:this.startLoc.toString(),endDate:this.endDate,endLoc:this.endLoc.toString(),startVehicleState:this.startVehicleState,endVehicleState:this.endVehicleState,computedOutlier:A.formatDuration(Pe)}}},{key:"getStateTransition",value:function(){return this.startVehicleState.replace("VEHICLE_STATE_","")+">"+this.endVehicleState.replace("VEHICLE_STATE_","")}},{key:"getLogViewerEntry",value:function(){var e=this.getFeaturedData();return e.date=this.startDate,e.timestampMS=this.startDate.getTime(),e.formattedDate=this.startDate.toISOString(),e.jsonPayload={"@type":"Missing Updates",temporal_gap:e.duration,response:{state:this.getStateTransition()}},e}}],[{key:"getSignificantMissingUpdates",value:function(e){if(!e)return[];var t=C.a.map(e,"interval"),a=C.a.mean(t),o=Re.median(t),n=C.a.min(t),i=C.a.max(t);return console.log("avgInternal",a),console.log("medianInternal",o),console.log("minInternal",n),console.log("maxInternal",i),console.log("updateOutlier",6e4),Pe=C.a.min([10*o,6e4]),console.log("computedOutlier",Pe),C()(e).filter((function(e){return e.interval>=Pe})).sortBy("interval").value()}}]),e}(),Ie=function(){function e(t,a){var o=this;Object(y.a)(this,e),this.solutionType=a,"LMFS"===this.solutionType?(this.updateVehicleSuffix="update_delivery_vehicle",this.vehiclePath="jsonPayload.request.deliveryVehicle",this.navStatusPropName="navigationStatus"):(this.updateVehicleSuffix="update_vehicle",this.vehicleName="vehicle",this.vehiclePath="jsonPayload.request.vehicle",this.navStatusPropName="navStatus"),this.lastLocationPath=this.vehiclePath+".lastLocation",this.trip_ids=[],this.trips=[],this.tripStatusChanges=[],this.rawLogs=C.a.reverse(t),this.processTripSegments(),this.minDate=new Date(t[0].timestamp),this.maxDate=new Date(C.a.last(t).timestamp),this.velocityJumps=[],this.missingUpdates=[],this.dwellLocations=[],this.etaDeltas=[],C.a.map(this.rawLogs,(function(e,t){e.date=new Date(e.timestamp),e.formattedDate=e.date.toISOString(),e.timestampMS=e.date.getTime(),e.idx=t,e.lastLocation=C.a.get(e,o.lastLocationPath),e.lastLocationResponse=C.a.get(e,"jsonPayload.response.lastLocation"),e.navStatus=C.a.get(e,"jsonPayload.response."+o.navStatusPropName)}))}return Object(w.a)(e,[{key:"getRawLogs_",value:function(e,t){return e=e||this.minDate,t=t||this.maxDate,C()(this.rawLogs).filter((function(a){return a.date>=e&&a.date<=t}))}},{key:"getLogs_",value:function(e,t){return this.getRawLogs_(e,t).concat(this.velocityJumps.map((function(e){return e.getLogViewerEntry()}))).concat(this.missingUpdates.map((function(e){return e.getLogViewerEntry()}))).filter((function(a){return a.date>=e&&a.date<=t})).sortBy("timestampMS")}},{key:"getTripStatusChanges",value:function(){return this.tripStatusChanges}},{key:"getTripStatusAtDate",value:function(e){var t=C.a.sortedIndexBy(this.tripStatusChanges,{date:e},"date");if(t>=1)return this.tripStatusChanges[t-1].newStatus}},{key:"getTripIDs",value:function(){return this.trip_ids}},{key:"getTrips",value:function(){return this.trips}},{key:"getMissingUpdates",value:function(e,t){var a,o=this,n=this.getRawLogs_(e,t).filter((function(e){return C.a.get(e,o.lastLocationPath+".rawLocation")})).map((function(e){var t;return a&&(t=new Ee(e.idx,a,e)),a=e,t})).compact().value();return this.missingUpdates=Ee.getSignificantMissingUpdates(n),this.missingUpdates}},{key:"getETADeltas",value:function(e,t){var a,o=this;return this.etaDeltas=this.getRawLogs_(e,t).filter((function(e){return C.a.get(e,o.vehiclePath+".etaToFirstWaypoint")&&C.a.get(e,o.lastLocationPath+".rawLocation")})).map((function(e){var t;if(a){var n=C.a.get(e,o.lastLocationPath);t={deltaInSeconds:(e.date-a.date)/1e3,coords:new google.maps.LatLng({lat:n.rawLocation.latitude,lng:n.rawLocation.longitude})}}return a=e,t})).compact().value(),this.etaDeltas}},{key:"getHighVelocityJumps",value:function(e,t){var a,o=this,n=this.getRawLogs_(e,t).filter((function(e){return C.a.get(e,o.lastLocationPath+".rawLocation")})).map((function(e){var t;return a&&(t=new _e(e.idx,a,e)),a=e,t})).compact().value();return this.velocityJumps=_e.getSignificantJumps(n),this.velocityJumps}},{key:"getDwellLocations",value:function(e,t){var a=[];return C.a.forEach(this.rawLogs,(function(o){var n=o.lastLocation;if(!(!n||!n.rawLocation||o.date<e||o.date>t)){var i={lat:n.rawLocation.latitude,lng:n.rawLocation.longitude},s=C.a.find(a,(function(e){return window.google.maps.geometry.spherical.computeDistanceBetween(e.leaderCoords,new google.maps.LatLng(i))<=20}));s?(s.updates++,s.endDate=o.date):a.push({leaderCoords:new window.google.maps.LatLng(i),updates:1,startDate:o.date})}})),this.dwellLocations=C.a.filter(a,(function(e){return e.updates>=12})),this.dwellLocations}},{key:"getSegmentID",value:function(e){if("LMFS"===this.solutionType){var t=C.a.get(e,"jsonPayload.response.remainingVehicleJourneySegments");return t&&"Stops Left "+t.length}return C.a.get(e,"labels.trip_id")}},{key:"processTripSegments",value:function(){var e=this,t="this is not a segment",a=void 0,o=0,n=0,i="no status";C.a.forEach(this.rawLogs,(function(s){if(s.logName.match(e.updateVehicleSuffix)){var r=e.getSegmentID(s);if(r!==t)t=r,a=new Fe(o,r||"non-trip-segment-"+n,new Date(s.timestamp)),e.trips.push(a),e.trip_ids.push(a.tripName),o++,void 0===r&&n++;else a.lastUpdate=new Date(s.timestamp),a.tripDuration=a.lastUpdate-a.firstUpdate,a.updateRequests++;var l=C.a.get(s,e.lastLocationPath);l&&l.rawLocation&&a.appendCoords(l,s.timestamp)}var c=C.a.get(s,"jsonPayload.response.status");c&&c!==i&&(e.tripStatusChanges.push({newStatus:c,date:new Date(s.timestamp)}),i=c)}))}}]),e}();function Ae(){return(Ae=Object(Ce.a)(ke.a.mark((function e(){var t,a;return ke.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("./data.json");case 2:return t=e.sent,e.next=5,t.json();case 5:a=e.sent,ye=a.jwt,we=a.projectId,Oe=a.APIKEY,De=a.solutionType||"ODRD",Le=new Ie(a.rawLogs,De);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(function(){return Ae.apply(this,arguments)})().then((function(){var e={tripLogs:Le,apikey:Oe,jwt:ye,projectId:we,solutionType:De};S.a.render(Object(M.jsxs)("div",{children:[Object(M.jsx)(z,{logData:e}),Object(M.jsx)(be,{logData:e})]}),document.getElementById("root"))}))}},[[151,1,2]]]);
//# sourceMappingURL=main.cb682888.chunk.js.map