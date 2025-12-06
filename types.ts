export interface Coordinate {
  lat: number;
  lng: number;
  alt?: number; // Altitude in meters
}

export interface Landmark {
  id: string;
  name: string;
  type: 'Feature' | 'Rover' | 'Lander' | 'Orbiter';
  position: Coordinate;
  description: string;
  image?: string;
}

export interface MissionLog {
  timestamp: string;
  message: string;
  type: 'info' | 'alert' | 'data';
}

export enum SimulationSpeed {
  PAUSED = 0,
  REALTIME = 1,
  FAST = 100,
}