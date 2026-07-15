export interface Business {
  precinct: string;
  category: string;
  name: string;
  address: string;
  neighborhood: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  hours: string | null;
  owner: string | null;
  owner_phone: string | null;
  community_friendly: boolean;
  notes: string | null;
}

export interface Captain {
  precinct: number;
  polling_location: string;
  name: string;
  email: string;
  phone: string;
  google_group: boolean;
  signal: boolean;
  vote_builder: boolean;
  notes: string | null;
}

export interface School {
  precinct: string;
  name: string;
  type: string;
  level: string;
  address: string;
  phone: string | null;
  website: string | null;
  principal: string | null;
  principal_email: string | null;
  enrollment: number | null;
}

export interface Religious {
  precinct: string;
  name: string;
  religion: string;
  denomination: string | null;
  address: string;
  phone: string | null;
  website: string | null;
  leader: string | null;
  leader_title: string | null;
  congregation_size: number | null;
  community_programs: string | null;
}

export interface Precinct {
  precinct: string;
  neighborhood: string | null;
  businesses_count: number;
  schools_count: number;
  religious_count: number;
  parks_count: number;
  gov_buildings_count: number;
  services_count: number;
  residential_buildings: number;
}

export interface Turnout {
  precinct: number;
  registered_voters: number;
  ballots_cast: number;
  turnout_pct: number;
}

export interface Park {
  precinct: string;
  name: string;
  type: string;
  address: string;
}

export interface Service {
  precinct: string;
  name: string;
  type: string;
  address: string;
  phone: string | null;
  website: string | null;
}
