interface RouteAnchor {
  id: string;
  name: string;
  coordinates: [lng: number, lat: number];
}

export const ROUTE_ANCHORS: RouteAnchor[] = [
  { id: '', name: 'Uzhhorod', coordinates: [48.58, 48.69] },
] as const;
