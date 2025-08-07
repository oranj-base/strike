export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const AddRegistryParams = IDL.Record({
    'website_url' : IDL.Opt(IDL.Text),
    'twitter' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'canister_id' : IDL.Principal,
    'description' : IDL.Text,
    'email' : IDL.Text,
    'project_name' : IDL.Text,
    'telegram' : IDL.Opt(IDL.Text),
  });
  const StrikeStatus = IDL.Variant({
    'Blocked' : IDL.Null,
    'Submitted' : IDL.Null,
    'Trusted' : IDL.Null,
  });
  const Pagination = IDL.Record({ 'page' : IDL.Nat32, 'pageSize' : IDL.Nat32 });
  const GetRegistriesParams = IDL.Record({
    'status' : IDL.Opt(StrikeStatus),
    'pagination' : Pagination,
  });
  const StrikeRegistry = IDL.Record({
    'status' : StrikeStatus,
    'website_url' : IDL.Opt(IDL.Text),
    'twitter' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'canister_id' : IDL.Principal,
    'added_by' : IDL.Principal,
    'description' : IDL.Text,
    'created_at' : IDL.Nat64,
    'email' : IDL.Text,
    'module_hash' : IDL.Opt(IDL.Text),
    'project_name' : IDL.Text,
    'telegram' : IDL.Opt(IDL.Text),
  });
  const PaginatedResponse = IDL.Record({
    'total' : IDL.Nat32,
    'items' : IDL.Vec(StrikeRegistry),
  });
  const UpdateRegistryStatusParams = IDL.Record({
    'status' : StrikeStatus,
    'canister_id' : IDL.Principal,
  });
  return IDL.Service({
    'add_admin' : IDL.Func([IDL.Principal], [Result], []),
    'add_registry' : IDL.Func([AddRegistryParams], [Result], []),
    'get_admins' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'get_registries' : IDL.Func(
        [GetRegistriesParams],
        [PaginatedResponse],
        ['query'],
      ),
    'get_strike_by_canister_id' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(StrikeRegistry)],
        ['query'],
      ),
    'is_admin' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'remove_admin' : IDL.Func([IDL.Principal], [Result], []),
    'update_registry_status' : IDL.Func(
        [UpdateRegistryStatusParams],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
