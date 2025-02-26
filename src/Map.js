/*
 * Map.js
 *
 * Uses the react-wrapper to make using google maps js sdk
 * easier in react.  Beyond basic loading doesn't pretend to
 * act like a normal react component.
 */
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";
import _ from "lodash";
import { getQueryStringValue, setQueryStringValue } from "./queryString";
import Utils from "./Utils";

let minDate;
let maxDate;
let allPaths = [];
let allMarkers = [];
let map;
let apikey;
let mapId;
let dataMakers = [];
let trafficLayer;
const bubbleMap = {};
const toggleHandlers = {};
let panorama;
let jwt;
let projectId;
let locationProvider;
let solutionType;
let tripLogs;
let taskLogs;
let setFeaturedObject;
let setTimeRange;

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

function addTripPolys(map) {
  _.forEach(allPaths, (p) => p.setMap(null));
  allPaths = [];
  _.forEach(allMarkers, (m) => m.setMap(null));
  allMarkers = [];

  const trips = tripLogs.getTrips();
  const vehicleBounds = new window.google.maps.LatLngBounds();
  let lastVehicleCoords;
  _.forEach(trips, (trip) => {
    const tripCoords = trip.getPathCoords(minDate, maxDate);
    if (tripCoords.length > 0) {
      lastVehicleCoords = _.last(tripCoords);
      const path = new window.google.maps.Polyline({
        path: tripCoords,
        geodesic: true,
        strokeColor: getColor(trip.tripIdx),
        strokeOpacity: 0.5,
        strokeWeight: 6,
      });
      google.maps.event.addListener(path, "mouseover", () => {
        path.setOptions({
          strokeOpacity: 1,
          strokeWeight: 8,
        });
      });
      google.maps.event.addListener(path, "mouseout", () => {
        path.setOptions({
          strokeOpacity: 0.5,
          strokeWeight: 6,
        });
      });
      google.maps.event.addListener(path, "click", () => {
        const fd = trip.getFeaturedData();
        setFeaturedObject(fd);
        // TODO: https://github.com/googlemaps/fleet-debugger/issues/79
        // this time range won't capture the createTrip logs
        setTimeRange(fd.firstUpdate.getTime(), fd.lastUpdate.getTime());
      });
      getPolyBounds(vehicleBounds, path);
      path.setMap(map);
      allPaths.push(path);
    }
  });
  if (lastVehicleCoords) {
    const urlBase = "http://maps.google.com/mapfiles/kml/shapes/";
    const lastVehicleLocMark = new window.google.maps.Marker({
      position: lastVehicleCoords,
      map: map,
      icon: {
        url: urlBase + (solutionType === "LMFS" ? "truck.png" : "cabs.png"),
        scaledSize: new google.maps.Size(25, 25),
      },
      title: "Last Location",
    });
    allMarkers.push(lastVehicleLocMark);
  }
  return vehicleBounds;
}

/*
 * Creates the map object using a journeySharing location
 * provider.
 */
function initializeMapObject(element) {
  // In a more normal implementation authTokenFetcher
  // would actually be making a RPC to a backend to generate
  // the jwt.  For debugging use cases the jwt gets bundled into
  // the extracted log data.
  function authTokenFetcher(options) {
    // TODO #25 - bake in actual expiration time -- and give a
    // better error message for expired jwts
    console.log("Ignoring options using prebuilt jwt", options);
    const authToken = {
      token: jwt,
    };
    return authToken;
  }

  locationProvider =
    new google.maps.journeySharing.FleetEngineTripLocationProvider({
      projectId,
      authTokenFetcher,
    });
  const jsMapView = new google.maps.journeySharing.JourneySharingMapView({
    element: element,
    locationProvider,
    mapOptions: {
      mapId: mapId,
      mapTypeControl: true,
      streetViewControl: true,
    },
  });
  const map = jsMapView.map;

  const tiltButtons = [
    ["Tilt Down", 20, google.maps.ControlPosition.TOP_CENTER],
    ["Tilt Up", -20, google.maps.ControlPosition.TOP_CENTER],
  ];

  tiltButtons.forEach(([text, amount, position]) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("button");

    controlUI.classList.add("ui-button");
    controlUI.innerText = `${text}`;
    controlUI.addEventListener("click", () => {
      map.setTilt(map.getTilt() + amount);
    });
    controlDiv.appendChild(controlUI);
    map.controls[position].push(controlDiv);
  });
  return map;
}

function MyMapComponent(props) {
  const ref = useRef();

  useEffect(() => {
    const urlZoom = getQueryStringValue("zoom");
    const urlCenter = getQueryStringValue("center");
    const urlTilt = getQueryStringValue("tilt");
    const urlHeading = getQueryStringValue("heading");
    map = initializeMapObject(ref.current);
    const vehicleBounds = addTripPolys(map);
    if (urlZoom && urlCenter) {
      console.log("setting zoom & center from url", urlZoom, urlCenter);
      map.setZoom(parseInt(urlZoom));
      map.setCenter(JSON.parse(urlCenter));
    } else {
      map.fitBounds(vehicleBounds);
    }

    if (urlTilt) {
      map.setTilt(parseInt(urlTilt));
    }
    if (urlHeading) {
      map.setHeading(parseInt(urlHeading));
    }
    map.setOptions({ maxZoom: 100 });
    map.addListener("zoom_changed", () => {
      setQueryStringValue("zoom", map.getZoom());
    });

    map.addListener("tilt_changed", () => {
      setQueryStringValue("tilt", map.getTilt());
    });

    map.addListener("heading_changed", () => {
      setQueryStringValue("heading", map.getHeading());
    });

    map.addListener(
      "center_changed",
      _.debounce(() => {
        setQueryStringValue("center", JSON.stringify(map.getCenter().toJSON()));
      }, 100)
    );
  }, []);

  /*
   * Handler for timewindow change.  Updates global min/max date globals
   * and recomputes the paths as well as all the bubble markers to respect the
   * new date values.
   *
   * Debounced to every 100ms as a blance between performance and reactivity when
   * the slider is dragged.
   */
  useEffect(
    () =>
      _.debounce(() => {
        minDate = new Date(props.rangeStart);
        maxDate = new Date(props.rangeEnd);
        addTripPolys(map);
        _.forEach(toggleHandlers, (handler, name) => {
          if (bubbleMap[name]) {
            handler(true);
          }
        });
      }, 100),
    [props.rangeStart, props.rangeEnd]
  );

  useEffect(() => {
    const data = props.selectedRow;
    if (!data) return;
    _.forEach(dataMakers, (m) => m.setMap(null));
    dataMakers = [];
    const svgMarker = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };

    const rawLocation = _.get(data.lastLocation, "rawLocation");
    if (rawLocation) {
      const status = _.get(data, "jsonPayload.response.status");
      const state = _.get(data, "jsonPayload.response.state");
      const locationForLog = new window.google.maps.Marker({
        position: { lat: rawLocation.latitude, lng: rawLocation.longitude },
        map: map,
        icon: svgMarker,
        title: "Vehicle state " + state + " Trip Status " + status,
      });
      dataMakers.push(locationForLog);
    }
    // TODO: for non-vehicle api calls could attempt to interpolate the location
  }, [props.selectedRow]);

  for (const toggle of props.toggles) {
    const id = toggle.id;
    const enabled = props.toggleOptions[id];
    useEffect(() => {
      toggleHandlers[id](enabled);
    }, [props.toggleOptions[id]]);
  }

  return <div ref={ref} id="map" style={{ height: "500px" }} />;
}

function getPolyBounds(bounds, p) {
  p.getPath().forEach((e) => {
    bounds.extend(e);
  });
  return bounds;
}

/*
 * Deterministically assign a color per trip using tripIdx
 * Colors were chosen for visibility
 */
function getColor(tripIdx) {
  const colors = [
    "#2d7dd2",
    "#97cc04",
    "#eeb902",
    "#f45d01",
    "#474647",
    "00aa00",
  ];
  return colors[tripIdx % colors.length];
}

function Map(props) {
  tripLogs = props.logData.tripLogs;
  taskLogs = props.logData.taskLogs;
  minDate = tripLogs.minDate;
  maxDate = tripLogs.maxDate;
  const urlParams = new URLSearchParams(window.location.search);
  apikey = urlParams.get("apikey") || props.logData.apikey;
  mapId = urlParams.get("mapId") || props.logData.mapId;
  jwt = props.logData.jwt;
  projectId = props.logData.projectId;
  solutionType = props.logData.solutionType;
  setFeaturedObject = props.setFeaturedObject;
  setTimeRange = props.setTimeRange;

  return (
    <Wrapper
      apiKey={apikey}
      render={render}
      version="beta"
      libraries={["geometry", "journeySharing"]}
    >
      <MyMapComponent
        rangeStart={props.rangeStart}
        rangeEnd={props.rangeEnd}
        selectedRow={props.selectedRow}
        toggles={props.toggles}
        toggleOptions={props.toggleOptions}
      />
    </Wrapper>
  );
}

/*
 * GenerateBubbles() -- helper function for generating map features based
 * on per-log entry data.
 *
 * Handles the gunk of iterating over log entries and clearing/setting the map
 */
function GenerateBubbles(bubbleName, cb) {
  return (showBubble) => {
    _.forEach(bubbleMap[bubbleName], (bubble) => bubble.setMap(null));
    delete bubbleMap[bubbleName];
    if (showBubble) {
      bubbleMap[bubbleName] = tripLogs
        .getLogs_(minDate, maxDate)
        .map((le) => {
          const lastLocation = le.lastlocation;
          let rawlocation;
          let bubble = undefined;
          if (lastLocation && (rawlocation = lastLocation.rawlocation)) {
            bubble = cb(
              new google.maps.LatLng({
                lat: rawlocation.latitude,
                lng: rawlocation.longitude,
              }),
              lastLocation,
              le
            );
          }
          return bubble;
        })
        .compact()
        .value();
    }
  };
}

/*
 * Draws circles on map with a radius equal to the
 * GPS accuracy.
 */
toggleHandlers["showGPSBubbles"] = GenerateBubbles(
  "showGPSBubbles",
  (rawLocationLatLng, lastLocation) => {
    let color;
    switch (lastLocation.locsensor) {
      case "LOCATION_SENSOR_GPS":
        color = "#11FF11";
        break;
      case "LOCATION_SENSOR_NETWORK":
        color = "#FF1111";
        break;
      case "LOCATION_SENSOR_PASSIVE":
        color = "#FF0000";
        break;
      case "LOCATION_SENSOR_ROAD_SNAPPED_LOCATION_PROVIDER":
        color = "#00FF00";
        break;
      case "LOCATION_SENSOR_FUSED_LOCATION_PROVIDER":
        color = "#11FF11";
        break;
      case "LOCATION_SENSOR_LOG_UNSPECIFIED":
      default:
        color = "#000000";
    }
    const accuracy = lastLocation.rawlocationaccuracy;
    if (accuracy) {
      let circ = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.2,
        map,
        center: rawLocationLatLng,
        radius: accuracy, // units is this actually meters?
      });
      google.maps.event.addListener(circ, "mouseover", () => {
        setFeaturedObject({
          rawlocationaccuracy: lastLocation.rawlocationaccuracy,
          locsensor: lastLocation.locsensor,
        });
      });
      return circ;
    }
  }
);

/*
 * Draws circles on map with a radius equal to the
 * time delta (1 meter radius = 1 second of delta)
 */
toggleHandlers["showClientServerTimeDeltas"] = GenerateBubbles(
  "showClientServerTimeDeltas",
  (rawLocationLatLng, lastLocation, logEntry) => {
    const clientTimeStr = _.get(
      logEntry.lastlocationResponse,
      "rawlocationtime"
    );
    const serverTimeStr = _.get(logEntry.lastlocationResponse, "servertime");
    if (clientTimeStr && serverTimeStr) {
      const clientDate = new Date(clientTimeStr);
      const serverDate = new Date(serverTimeStr);
      const timeDeltaSeconds =
        Math.abs(clientDate.getTime() - serverDate.getTime()) / 1000;
      let color;
      if (clientDate > serverDate) {
        color = "#0000F0";
      } else {
        color = "#0F0000";
      }

      let circ = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.2,
        map,
        center: rawLocationLatLng,
        radius: timeDeltaSeconds,
      });
      google.maps.event.addListener(circ, "mouseover", () => {
        setFeaturedObject({
          timeDeltaSeconds: timeDeltaSeconds,
          serverDate: serverDate,
          clientDate: clientDate,
        });
      });
      return circ;
    }
  }
);

/*
 * Draws arrows on map showing the measured heading
 * of the vehicle (ie which direction vehicle was traveling
 */
toggleHandlers["showHeading"] = GenerateBubbles(
  "showHeading",
  (rawLocationLatLng, lastLocation, logEntry) => {
    // Note: Heading & accuracy are only on the _request_ not the
    // response.
    const heading = _.get(logEntry.lastlocation, "heading");
    const accuracy = _.get(logEntry.lastlocation, "bearingaccuracy");

    // Not currently using accuracy. How to show it?  Maybe opacity of the arrorw?
    const arrowLength = 20; // meters??
    if (!(heading && accuracy)) {
      return;
    }
    const headingLine = new google.maps.Polyline({
      strokeColor: "#0000F0",
      strokeOpacity: 0.6,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor: "#0000FF",
            strokeWeight: 4,
          },
          offset: "100%",
        },
      ],
      map,
      path: [
        rawLocationLatLng,
        google.maps.geometry.spherical.computeOffset(
          rawLocationLatLng,
          arrowLength,
          heading
        ),
      ],
    });
    google.maps.event.addListener(headingLine, "click", () => {
      // TODO: allow updating panorama based on forward/back
      // stepper buttons (ie at each updatevehicle log we have a heading)
      panorama = new google.maps.StreetViewPanorama(
        document.getElementById("map"),
        {
          position: rawLocationLatLng,
          pov: { heading: heading, pitch: 10 },
          addressControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_CENTER,
          },
          linksControl: false,
          panControl: false,
          enableCloseButton: true,
        }
      );
      console.log("loaded panorama", panorama);
    });
    return headingLine;
  }
);

/*
 * Draws circles on the map. Color indicates vehicle speed at that
 * location.
 */
toggleHandlers["showSpeed"] = GenerateBubbles(
  "showSpeed",
  (rawLocationLatLng, lastLocation) => {
    const speed = lastLocation.speed;
    if (lastLocation.speed === undefined) {
      return;
    }
    const color = speed < 0 ? "#FF0000" : "#00FF00";
    return new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.5,
      fillColor: color,
      fillOpacity: 0.5,
      map,
      center: rawLocationLatLng,
      radius: Math.abs(speed),
    });
  }
);

/*
 * Draws circles on the map. Color indicates trip status
 * at that location.   Note that trip status isn't actually
 * in the update vehicle logs, so current trip status will actually
 * just be the trip status at the time of the vehicle update  --
 * which is a bit wrong and wonky on the boundaries.
 */
toggleHandlers["showTripStatus"] = GenerateBubbles(
  "showTripStatus",
  (rawLocationLatLng, lastLocation, le) => {
    let color,
      radius = 5;
    const tripStatus = tripLogs.getTripStatusAtDate(le.date);
    switch (tripStatus) {
      case "TRIP_STATUS_NEW":
        color = "#002200";
        radius = 30;
        break;
      case "TRIP_STATUS_ENROUTE_TO_PICKUP":
        color = "#FFFF00";
        break;
      case "TRIP_STATUS_ARRIVED_AT_PICKUP":
        color = "#FFFF10";
        radius = 10;
        break;
      case "TRIP_STATUS_ARRIVED_AT_INTERMEDIATE_DESTINATION":
        color = "10FFFF";
        radius = 20;
        break;
      case "TRIP_STATUS_ENROUTE_TO_DROPOFF":
        color = "00FFFF";
        break;
      case "TRIP_STATUS_COMPLETE":
        radius = 30;
        color = "#00FF00";
        break;
      case "TRIP_STATUS_CANCELED":
        radius = 30;
        color = "#FF0000";
        break;
      case "TRIP_STATUS_UNKNOWN_TRIP_STATUS":
      default:
        color = "#000000";
    }

    const statusCirc = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.5,
      fillColor: color,
      fillOpacity: 0.5,
      map,
      center: rawLocationLatLng,
      radius: radius, // set based on trip status?
    });
    google.maps.event.addListener(statusCirc, "mouseover", () => {
      setFeaturedObject({
        tripStatus: tripStatus,
      });
    });
    return statusCirc;
  }
);

/*
 * Enable/disables live traffic layer
 */
toggleHandlers["showTraffic"] = function (enabled) {
  if (!trafficLayer) {
    trafficLayer = new google.maps.TrafficLayer();
  }
  if (enabled) {
    trafficLayer.setMap(map);
  } else {
    trafficLayer.setMap(null);
  }
};

/*
 * Draws circles on the map. Size indicates dwell time at that
 * location.
 */
toggleHandlers["showDwellLocations"] = function (enabled) {
  const bubbleName = "showDwellLocations";
  const dwellLocations = tripLogs.getDwellLocations(minDate, maxDate);
  _.forEach(bubbleMap[bubbleName], (bubble) => bubble.setMap(null));
  delete bubbleMap[bubbleName];
  if (enabled) {
    bubbleMap[bubbleName] = _.map(dwellLocations, (dl) => {
      const circ = new google.maps.Circle({
        strokeColor: "#000000",
        strokeOpacity: 0.25,
        fillColor: "#FFFF00",
        fillOpacity: 0.25,
        map,
        center: dl.leaderCoords,
        radius: dl.updates * 3, // make dwell times more obvious
      });
      google.maps.event.addListener(circ, "mouseover", () => {
        setFeaturedObject({
          startDate: dl.startDate,
          duration: Utils.formatDuration(dl.endDate - dl.startDate),
          endDate: dl.endDate,
        });
      });
      return circ;
    });
  }
};

/*
 * Draws markers on the map for all tasks.
 */
toggleHandlers["showTasksAsCreated"] = function (enabled) {
  const bubbleName = "showTasksAsCreated";
  const tasks = taskLogs.getTasks(maxDate).value();
  _.forEach(bubbleMap[bubbleName], (bubble) => bubble.setMap(null));
  delete bubbleMap[bubbleName];
  function getIcon(task) {
    const outcome = task.taskoutcome || "unknown";
    const urlBase = "http://maps.google.com/mapfiles/kml/shapes/";
    const icon = {
      url: urlBase,
      scaledSize: new google.maps.Size(35, 35),
    };
    if (outcome.match("SUCCEEDED")) {
      icon.url += "flag.png";
    } else if (outcome.match("FAIL")) {
      icon.url += "caution.png";
    } else {
      icon.url += "shaded_dot.png";
    }
    return icon;
  }
  if (enabled) {
    bubbleMap[bubbleName] = _(tasks)
      .map((task) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: task.plannedlocation.point.latitude,
            lng: task.plannedlocation.point.longitude,
          },
          map: map,
          icon: getIcon(task),
          title: `${task.state}: ${task.taskid} - ${task.trackingid}`,
        });
        google.maps.event.addListener(marker, "click", () => {
          setFeaturedObject(task);
        });
        const ret = [marker];
        const arrowColor =
          task.plannedVsActualDeltaMeters > 50 ? "#FF1111" : "#11FF11";
        if (task.taskoutcomelocation) {
          const offSetPath = new window.google.maps.Polyline({
            path: [
              {
                lat: task.plannedlocation.point.latitude,
                lng: task.plannedlocation.point.longitude,
              },
              {
                lat: task.taskoutcomelocation.point.latitude,
                lng: task.taskoutcomelocation.point.longitude,
              },
            ],
            geodesic: true,
            strokeColor: arrowColor,
            strokeOpacity: 0.6,
            strokeWeight: 4,
            map: map,
            icons: [
              {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeColor: arrowColor,
                  strokeWeight: 4,
                },
                offset: "100%",
              },
            ],
          });
          ret.push(offSetPath);
        }
        return ret;
      })
      .flatten()
      .value();
  }
};

/*
 * Draws circles on the map. Size indicates dwell time at that
 * location.
 */
toggleHandlers["showNavStatus"] = GenerateBubbles(
  "showNavStatus",
  (rawLocationLatLng, lastLocation, le) => {
    const navStatus = le.navStatus;
    if (navStatus === undefined) {
      return;
    }
    let color,
      radius = 5;
    switch (navStatus) {
      case "NAVIGATION_STATUS_UNKNOWN_NAVIGATION_STATUS":
        color = "#222222";
        break;
      case "NAVIGATION_STATUS_NO_GUIDANCE":
        color = "#090909";
        break;
      case "NAVIGATION_STATUS_ENROUTE_TO_DESTINATION":
        color = "#00FF00";
        break;
      case "NAVIGATION_STATUS_OFF_ROUTE":
        color = "#FF0000";
        radius = 30;
        break;
      case "NAVIGATION_STATUS_ARRIVED_AT_DESTINATION":
        color = "0000FF";
        radius = 10;
        break;
      default:
        color = "#000000";
    }
    const statusCirc = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.5,
      fillColor: color,
      fillOpacity: 0.5,
      map,
      center: rawLocationLatLng,
      radius: radius, // set based on trip status?
    });
    google.maps.event.addListener(statusCirc, "mouseover", () => {
      setFeaturedObject({
        navStatus: navStatus,
        vehicleState: _.get(le, "jsonpayload.response.state"),
        tripStatus: "??",
      });
    });
    return statusCirc;
  }
);

/*
 * Draws circles on the map. Size indicates delta in seconds at that
 * location.
 */
toggleHandlers["showETADeltas"] = function (enabled) {
  const bubbleName = "showETADeltas";
  _.forEach(bubbleMap[bubbleName], (bubble) => bubble.setMap(null));
  delete bubbleMap[bubbleName];
  const etaDeltas = tripLogs.getETADeltas(minDate, maxDate);
  if (enabled) {
    bubbleMap[bubbleName] = _.map(etaDeltas, (etaDelta) => {
      const circ = new google.maps.Circle({
        strokeColor: "#000000",
        strokeOpacity: 0.25,
        fillColor: "FF0000",
        fillOpacity: 0.25,
        map,
        center: etaDelta.coords,
        // cap radius to 300 meters to avoid coloring the whole
        // screen when there is a very large delta.  Definitely
        // needs tuning ... and likely better to consider adjusting
        // color as well.
        radius: _.min([etaDelta.deltaInSeconds, 300]),
      });
      google.maps.event.addListener(circ, "mouseover", () => {
        setFeaturedObject({
          etaDeltaInSeconds: etaDelta.deltaInSeconds,
        });
      });
      return circ;
    });
  }
};

/*
 * Draws arrows on the map showing where a vehicle jumped
 * from one location to another at an unrealistic velocity.
 */
toggleHandlers["showHighVelocityJumps"] = function (enabled) {
  const bubbleName = "showHighVelocityJumps";
  const jumps = tripLogs.getHighVelocityJumps(minDate, maxDate);
  _.forEach(bubbleMap[bubbleName], (bubble) => bubble.setMap(null));
  delete bubbleMap[bubbleName];
  if (enabled) {
    bubbleMap[bubbleName] = _(jumps)
      .map((jump) => {
        function getStrokeWeight(velocity) {
          if (velocity <= 100) {
            return 2;
          } else if (velocity < 1000) {
            return 6;
          } else if (velocity < 2000) {
            return 10;
          } else {
            return 14;
          }
        }
        const path = new window.google.maps.Polyline({
          path: [jump.startLoc, jump.endLoc],
          geodesic: true,
          strokeColor: getColor(jump.jumpIdx),
          strokeOpacity: 0.8,
          strokeWeight: getStrokeWeight(jump.velocity),
          map: map,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: getColor(jump.jumpIdx),
                strokeWeight: getStrokeWeight(jump.velocity),
              },
              offset: "100%",
            },
          ],
        });
        google.maps.event.addListener(path, "mouseover", () => {
          setFeaturedObject(jump.getFeaturedData());
        });
        google.maps.event.addListener(path, "click", () => {
          setFeaturedObject(jump.getFeaturedData());
          // show a minute +/- on each side of a jump
          setTimeRange(
            jump.startDate.getTime() - 60 * 1000,
            jump.endDate.getTime() + 60 * 1000
          );
        });
        return [path];
      })
      .flatten()
      .value();
  } else {
    // TODO: ideally reset to timerange that was selected before enabling
    // jump view
    setTimeRange(tripLogs.minDate.getTime(), tripLogs.maxDate.getTime());
  }
};

/*
 * Marks locations on the map where we did not get the expected
 * updateVehicle requests
 */
toggleHandlers["showMissingUpdates"] = function (enabled) {
  const bubbleName = "showMissingUpdates";
  const missingUpdates = tripLogs.getMissingUpdates(minDate, maxDate);
  _.forEach(bubbleMap[bubbleName], (bubble) => bubble.setMap(null));
  delete bubbleMap[bubbleName];
  if (enabled) {
    bubbleMap[bubbleName] = _(missingUpdates)
      .map((update) => {
        function getStrokeWeight(interval) {
          if (interval <= 60 * 1000) {
            return 2;
          } else if (interval < 60 * 10 * 1000) {
            return 6;
          } else if (interval < 60 * 60 * 10 * 1000) {
            return 10;
          } else {
            return 14;
          }
        }
        const heading = google.maps.geometry.spherical.computeHeading(
          update.startLoc,
          update.endLoc
        );
        const offsetHeading = ((heading + 360 + 90) % 360) - 180;
        const points = [
          update.startLoc,
          google.maps.geometry.spherical.computeOffset(
            update.startLoc,
            1000, //TODO compute based on viewport?
            offsetHeading
          ),
          google.maps.geometry.spherical.computeOffset(
            update.startLoc,
            900, //TODO compute based on viewport?
            offsetHeading
          ),
          google.maps.geometry.spherical.computeOffset(
            update.endLoc,
            900, //TODO compute based on viewport?
            offsetHeading
          ),
          google.maps.geometry.spherical.computeOffset(
            update.endLoc,
            1000, //TODO compute based on viewport?
            offsetHeading
          ),
          update.endLoc,
        ];
        const path = new window.google.maps.Polyline({
          path: points,
          geodesic: true,
          strokeColor: "#008B8B",
          strokeOpacity: 0.5,
          strokeWeight: getStrokeWeight(update.interval),
          map: map,
          icons: [
            {
              icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: "#008B8B",
                strokeWeight: getStrokeWeight(update.interval),
                scale: 6,
              },
              offset: "50%",
            },
            {
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                strokeColor: "#000000",
                strokeWeight: 1,
                strokeOpacity: 0.5,
              },
              offset: "0%",
            },
            {
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                strokeColor: "#000000",
                strokeWeight: 1,
                strokeOpacity: 0.5,
              },
              offset: "100%",
            },
          ],
        });
        google.maps.event.addListener(path, "mouseover", () => {
          setFeaturedObject(update.getFeaturedData());
          path.setOptions({
            strokeOpacity: 1,
            strokeWeight: 1.5 * getStrokeWeight(update.interval),
          });
        });
        google.maps.event.addListener(path, "mouseout", () => {
          path.setOptions({
            strokeOpacity: 0.5,
            strokeWeight: getStrokeWeight(update.interval),
          });
        });
        google.maps.event.addListener(path, "click", () => {
          setFeaturedObject(update.getFeaturedData());
          // show a minute +/- on each side of a update
          setTimeRange(
            update.startDate.getTime() - 60 * 1000,
            update.endDate.getTime() + 60 * 1000
          );
        });
        return [path];
      })
      .flatten()
      .value();
  } else {
    // TODO: ideally reset to timerange that was selected before enabling
    // jump view
    setTimeRange(tripLogs.minDate.getTime(), tripLogs.maxDate.getTime());
  }
};

/*
 * Enable/disables live journey sharing view
 */
toggleHandlers["showLiveJS"] = function (enabled) {
  if (!jwt) {
    console.log("Issue #25 -- no/invalid jwt");
    return;
  }
  // call into js to set the trip
  if (enabled) {
    locationProvider.tripId = _.last(tripLogs.getTripIDs());
  } else {
    locationProvider.tripId = "";
  }
};

export { Map as default };
