export interface CountryData {
  id: string; // ISO 3166-1 numeric or alpha-3 code used in topojson
  name: string;
  value: number; // Poll count
}

export interface PollState {
  hasVoted: boolean;
  selectedCountry: string | null;
}

export interface GeoJSONFeature {
  type: "Feature";
  id: string;
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: any[];
  };
}