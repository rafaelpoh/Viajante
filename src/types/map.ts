export interface MapPointOfInterest {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly lat: number;
  readonly lon: number;
}

export interface MapCoordinates {
  readonly lat: number;
  readonly lon: number;
  readonly label: string;
}
