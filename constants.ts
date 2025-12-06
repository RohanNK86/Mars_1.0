import { Landmark } from './types';

// Approximate high-res Mars imagery (using a public USGS/NASA service proxied or standard template)
// Using a reliable open-source Basemap URL for Mars.
export const MARS_IMAGERY_URL = 'https://cartocdn-gusc.global.ssl.fastly.net/opmbuilder/api/v1/map/named/opm-mars-basemap-v0-1/all/{z}/{x}/{y}.png';

export const MARS_LANDMARKS: Landmark[] = [
  {
    id: 'olympus_mons',
    name: 'Olympus Mons',
    type: 'Feature',
    position: { lat: 18.65, lng: -133.8, alt: 25000 },
    description: 'The largest volcano in the solar system.',
    image: 'https://picsum.photos/400/300?grayscale'
  },
  {
    id: 'valles_marineris',
    name: 'Valles Marineris',
    type: 'Feature',
    position: { lat: -14.6, lng: -78.5, alt: 5000 },
    description: 'A system of canyons that runs along the Martian surface east of the Tharsis region.',
    image: 'https://picsum.photos/401/300?grayscale'
  },
  {
    id: 'perseverance',
    name: 'Perseverance Rover',
    type: 'Rover',
    position: { lat: 18.4447, lng: 77.4508, alt: 0 },
    description: 'NASA\'s rover searching for signs of ancient microbial life in Jezero Crater.',
    image: 'https://picsum.photos/402/300?grayscale'
  },
  {
    id: 'curiosity',
    name: 'Curiosity Rover',
    type: 'Rover',
    position: { lat: -4.5895, lng: 137.4417, alt: 0 },
    description: 'Exploring Gale Crater to determine if Mars was ever able to support microbial life.',
    image: 'https://picsum.photos/403/300?grayscale'
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity Landing Site',
    type: 'Lander',
    position: { lat: 18.44, lng: 77.45, alt: 0 },
    description: 'First powered, controlled flight by an aircraft on another planet.',
    image: 'https://picsum.photos/404/300?grayscale'
  }
];

export const MRO_TLE_SIMULATION = {
  name: 'Mars Reconnaissance Orbiter',
  inclination: 92.7, // degrees
  altitude: 300000, // meters (approx 300km)
  period: 112, // minutes
};