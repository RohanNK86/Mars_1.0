import React, { useEffect, useRef, useState } from 'react';
import { MARS_IMAGERY_URL, MARS_LANDMARKS } from '../constants';
import { Landmark } from '../types';

// Declare Cesium in global scope since we load it via script tag
declare global {
  interface Window {
    Cesium: any;
  }
}

interface MarsViewerProps {
  selectedLandmark: Landmark | null;
  onLandmarkClick: (landmark: Landmark) => void;
}

const MarsViewer: React.FC<MarsViewerProps> = ({ selectedLandmark, onLandmarkClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Cesium
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    const Cesium = window.Cesium;
    if (!Cesium) {
      console.error("CesiumJS not loaded");
      return;
    }

    // 1. Setup Mars Ellipsoid
    const marsEllipsoid = Cesium.Ellipsoid.MARSIAU2000;

    // 2. Setup Viewer with custom Mars settings
    const viewer = new Cesium.Viewer(containerRef.current, {
      terrainProvider: undefined, // Start flat, add terrain if available
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false, // We'll build our own nav
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: true,
      timeline: true,
      fullscreenButton: false,
      infoBox: false, // Disable default info box, we use React UI
      selectionIndicator: false,
      skyAtmosphere: new Cesium.SkyAtmosphere(marsEllipsoid),
      globe: new Cesium.Globe(marsEllipsoid),
      mapProjection: new Cesium.GeographicProjection(marsEllipsoid),
      shouldAnimate: true,
    });

    viewerRef.current = viewer;

    // 3. Configure Imagery (Mars Texture)
    // Using a SingleTileImageryProvider for the base if tiles fail, or a tile provider.
    // For this demo, we use a URL template that points to an open planetary map.
    const imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: MARS_IMAGERY_URL,
      ellipsoid: marsEllipsoid,
      credit: 'OpenPlanetary',
      tilingScheme: new Cesium.GeographicTilingScheme({ ellipsoid: marsEllipsoid })
    });

    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(imageryProvider);

    // 4. Atmosphere & Lighting settings
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.atmosphereBrightnessShift = 0.1;
    viewer.scene.fog.enabled = true;
    viewer.scene.fog.density = 0.0005;
    viewer.scene.skyBox = new Cesium.SkyBox({
      sources: {
        positiveX: 'https://assets.babylonjs.com/environments/space/px.jpg',
        negativeX: 'https://assets.babylonjs.com/environments/space/nx.jpg',
        positiveY: 'https://assets.babylonjs.com/environments/space/py.jpg',
        negativeY: 'https://assets.babylonjs.com/environments/space/ny.jpg',
        positiveZ: 'https://assets.babylonjs.com/environments/space/pz.jpg',
        negativeZ: 'https://assets.babylonjs.com/environments/space/nz.jpg',
      },
    });

    // 5. Add Simulated Orbiter (MRO)
    addOrbiter(viewer, Cesium, marsEllipsoid);

    // 6. Add Landmarks
    addLandmarks(viewer, Cesium, marsEllipsoid);

    // 7. Click Handler
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.position);
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.landmarkData) {
        onLandmarkClick(pickedObject.id.landmarkData);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Force resize to ensure canvas fits
    setTimeout(() => viewer.resize(), 100);
    setIsReady(true);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Handle flying to selected landmark
  useEffect(() => {
    if (!viewerRef.current || !selectedLandmark || !isReady) return;
    const Cesium = window.Cesium;
    const { lat, lng, alt } = selectedLandmark.position;
    
    // Convert Lat/Lng to Cartesian on Mars
    const destination = Cesium.Cartesian3.fromDegrees(
      lng, 
      lat, 
      (alt || 1000) + 100000, // Fly to height above terrain
      Cesium.Ellipsoid.MARSIAU2000
    );

    viewerRef.current.camera.flyTo({
      destination: destination,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-60), // Look down at an angle
        roll: 0.0
      },
      duration: 2.5
    });
    
    // Highlight entity if it exists
    const entities = viewerRef.current.entities.values;
    for (const entity of entities) {
        if (entity.landmarkData && entity.landmarkData.id === selectedLandmark.id) {
            viewerRef.current.selectedEntity = entity;
            break;
        }
    }

  }, [selectedLandmark, isReady]);

  // Helper to add Orbiter
  const addOrbiter = (viewer: any, Cesium: any, ellipsoid: any) => {
    // Math to calculate simple polar orbit
    const startTime = Cesium.JulianDate.now();
    const stopTime = Cesium.JulianDate.addSeconds(startTime, 3600 * 24, new Cesium.JulianDate()); // 24hr sim
    
    const positionProperty = new Cesium.SampledPositionProperty();
    const period = 5400; // 90 min orbit
    const altitude = 300000; // 300km

    // Generate path points
    for (let i = 0; i <= 3600 * 24; i += 60) {
      const time = Cesium.JulianDate.addSeconds(startTime, i, new Cesium.JulianDate());
      // Simple physics approximation for visuals
      const angle = (i / period) * Math.PI * 2;
      const lat = (Math.sin(angle) * 180) / Math.PI; // Oscillate N/S
      // Longitude rotates due to planet rotation + orbit
      const lng = -120 + (i / 86400) * 360; 

      const position = Cesium.Cartesian3.fromDegrees(lng, lat, altitude, ellipsoid);
      positionProperty.addSample(time, position);
    }

    viewer.entities.add({
      name: "Mars Reconnaissance Orbiter",
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: startTime, stop: stopTime })]),
      position: positionProperty,
      orientation: new Cesium.VelocityOrientationProperty(positionProperty),
      model: {
        // Use a generic satellite model or box if GLB fails
        uri: "https://raw.githubusercontent.com/CesiumGS/cesium/master/Apps/SampleData/models/CesiumAir/Cesium_Air.glb", 
        minimumPixelSize: 64,
        maximumScale: 20000,
      },
      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.CYAN,
        }),
        width: 5,
      },
      description: "Orbiter collecting high-res imagery."
    });
  };

  // Helper to add Landmarks
  const addLandmarks = (viewer: any, Cesium: any, ellipsoid: any) => {
    MARS_LANDMARKS.forEach(lm => {
      const position = Cesium.Cartesian3.fromDegrees(lm.position.lng, lm.position.lat, lm.position.alt || 0, ellipsoid);
      
      viewer.entities.add({
        position: position,
        billboard: {
          image: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg", // Simple pin
          scale: 0.05,
          color: lm.type === 'Rover' ? Cesium.Color.ORANGE : Cesium.Color.CYAN,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        },
        label: {
          text: lm.name,
          font: '14px monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 5),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000000), // Hide when far away
        },
        // Store our data in the entity for click handling
        landmarkData: lm
      });

      // If rover, add a "trail" visual
      if (lm.type === 'Rover') {
        const pathPositions = [
           Cesium.Cartesian3.fromDegrees(lm.position.lng - 0.01, lm.position.lat - 0.01, 0, ellipsoid),
           Cesium.Cartesian3.fromDegrees(lm.position.lng - 0.005, lm.position.lat - 0.002, 0, ellipsoid),
           position
        ];
        viewer.entities.add({
            polyline: {
                positions: pathPositions,
                width: 2,
                material: Cesium.Color.ORANGE.withAlpha(0.6)
            }
        });
      }
    });
  };

  return <div id="cesiumContainer" ref={containerRef} className="w-full h-screen bg-black" />;
};

export default MarsViewer;