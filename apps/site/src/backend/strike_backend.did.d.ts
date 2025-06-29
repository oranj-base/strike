import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'Ok' : null } |
  { 'Err' : string };
export interface StrikeRegistry {
  'status' : StrikeStatus,
  'website_url' : [] | [string],
  'twitter' : [] | [string],
  'name' : string,
  'canister_id' : Principal,
  'added_by' : Principal,
  'description' : string,
  'created_at' : bigint,
  'email' : string,
  'module_hash' : [] | [string],
  'project_name' : string,
  'telegram' : [] | [string],
}
export type StrikeStatus = { 'Blocked' : null } |
  { 'Submitted' : null } |
  { 'Trusted' : null };
export interface _SERVICE {
  'add_admin' : ActorMethod<[Principal], Result>,
  'add_registry' : ActorMethod<
    [
      Principal,
      string,
      string,
      [] | [string],
      [] | [string],
      string,
      string,
      [] | [string],
    ],
    Result
  >,
  'get_registry' : ActorMethod<[], Array<StrikeRegistry>>,
  'get_registry_by_status' : ActorMethod<
    [[] | [StrikeStatus]],
    Array<StrikeRegistry>
  >,
  'get_strike_by_canister_id' : ActorMethod<[Principal], [] | [StrikeRegistry]>,
  'is_admin' : ActorMethod<[Principal], boolean>,
  'remove_admin' : ActorMethod<[Principal], Result>,
  'update_registry_status' : ActorMethod<[Principal, StrikeStatus], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
