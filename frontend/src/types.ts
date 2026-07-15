// ── Business ──
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

// ── Captain (enriched from PC Overview & Responsibilities doc) ──
export type ZoneId = 'north' | 'central' | 'south';
export type ActivityType =
  | 'petition'
  | 'door_knock'
  | 'phone_bank'
  | 'text_bank'
  | 'distribute_materials'
  | 'host_event'
  | 'voter_reg_drive'
  | 'early_vote_outreach'
  | 'mail_vote_education'
  | 'resource_table'
  | 'social_media'
  | 'block_club'
  | 'poll_watching';

export interface Activity {
  type: ActivityType;
  date: string;          // ISO date
  notes: string;
  volunteers: number;    // how many helped
  reach: number;         // doors knocked / calls made / people reached
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
  // PAL-enriched fields from PC doc
  zone: ZoneId | null;
  member_48_dems: boolean;
  election_year_role: 'captain' | 'volunteer' | 'both';
  activities: Activity[];
}

// ── Campaign Goals (from PC doc) ──
export interface CampaignGoal {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  activities: ActivityType[];
}

export const ZONES: { id: ZoneId; label: string; precincts: number[] }[] = [
  { id: 'north', label: 'North Zone', precincts: [1,2,3,4,5,6,7,8,9] },
  { id: 'central', label: 'Central Zone', precincts: [10,11,12,13,14,15,16,17,18,19,20,21,22,23] },
  { id: 'south', label: 'South Zone', precincts: [24,25,26,27,28,29,30,31,32,33,34,35] },
];

export const ACTIVITY_LABELS: Record<ActivityType, { label: string; icon: string; goal: 1 | 2 | 3 }> = {
  petition:             { label: 'Ballot Petitioning', icon: '📋', goal: 1 },
  door_knock:           { label: 'Door Knocking', icon: '🚪', goal: 1 },
  phone_bank:           { label: 'Phone Banking', icon: '📞', goal: 1 },
  text_bank:            { label: 'Text Banking', icon: '💬', goal: 1 },
  distribute_materials: { label: 'Distribute Materials', icon: '📦', goal: 1 },
  host_event:           { label: 'Host Campaign Event', icon: '🎉', goal: 1 },
  voter_reg_drive:      { label: 'Voter Registration Drive', icon: '🗳️', goal: 2 },
  early_vote_outreach:  { label: 'Early Vote Outreach', icon: '📮', goal: 2 },
  mail_vote_education:  { label: 'Mail-in Vote Education', icon: '✉️', goal: 2 },
  resource_table:       { label: 'Resource Table', icon: '🪑', goal: 3 },
  social_media:         { label: 'Social Media Engagement', icon: '📱', goal: 3 },
  block_club:           { label: 'Block Club Meeting', icon: '🏘️', goal: 3 },
  poll_watching:        { label: 'Poll Watching', icon: '👀', goal: 1 },
};

export const CAMPAIGN_GOALS: CampaignGoal[] = [
  {
    id: 1,
    title: 'Get Out the Vote',
    description: 'Get out the vote for progressive Democrats up and down the ballot in city, state and federal elections.',
    target: 100,
    current: 0,
    unit: 'activities',
    activities: ['petition', 'door_knock', 'phone_bank', 'text_bank', 'distribute_materials', 'host_event', 'poll_watching'],
  },
  {
    id: 2,
    title: 'Increase Voter Turnout',
    description: 'Increase the number of voters and the number of ballots cast in the 48th Ward.',
    target: 100,
    current: 0,
    unit: 'activities',
    activities: ['voter_reg_drive', 'early_vote_outreach', 'mail_vote_education'],
  },
  {
    id: 3,
    title: 'Build Community',
    description: 'Build a stronger, more connected community through civic engagement, education and empowerment.',
    target: 100,
    current: 0,
    unit: 'activities',
    activities: ['resource_table', 'social_media', 'block_club'],
  },
];

// ── School ──
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

// ── Religious ──
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

// ── Precinct ──
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

// ── Turnout ──
export interface Turnout {
  precinct: number;
  registered_voters: number;
  ballots_cast: number;
  turnout_pct: number;
}

// ── Park ──
export interface Park {
  precinct: string;
  name: string;
  type: string;
  address: string;
}

// ── Service ──
export interface Service {
  precinct: string;
  name: string;
  type: string;
  address: string;
  phone: string | null;
  website: string | null;
}
