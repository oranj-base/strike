import { Principal } from '@dfinity/principal';
import { StrikeRegistry } from './strike_backend.did';

export interface Registry {
  canisterId: Principal;
  name: string;
  email: string;
  telegram: string;
  twitter: string;
  projectName: string;
  description: string;
  strikeCardLink: string;
  status: 'Submitted' | 'Trusted' | 'Blocked' | null;
  createdAt: Date;
  addedBy: Principal;
}

export const asStrikeSearch = (
  rawResult: StrikeRegistry,
): { canisterId: Principal; status: string } => {
  return {
    canisterId: rawResult.canister_id,
    status: Object.keys(rawResult.status)[0],
  };
};

export const asRegistry = (rawResult: StrikeRegistry): Registry => {
  return {
    canisterId: rawResult.canister_id,
    name: rawResult.name,
    email: rawResult.email,
    telegram: rawResult.telegram[0] || '',
    twitter: rawResult.twitter[0] || '',
    projectName: rawResult.project_name,
    description: rawResult.description,
    strikeCardLink: rawResult.website_url[0] || '',
    status: Object.keys(rawResult.status)[0] as
      | 'Submitted'
      | 'Trusted'
      | 'Blocked'
      | null,
    createdAt: new Date(Number(rawResult.created_at) / 1000000), // Convert from nanoseconds to seconds
    addedBy: rawResult.added_by,
  };
};
