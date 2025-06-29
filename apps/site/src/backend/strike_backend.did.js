export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const StrikeStatus = IDL.Variant({
    'Blocked' : IDL.Null,
    'Submitted' : IDL.Null,
    'Trusted' : IDL.Null,
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
  return IDL.Service({
    'add_admin' : IDL.Func([IDL.Principal], [Result], []),
    'add_registry' : IDL.Func(
        [
          IDL.Principal,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
        ],
        [Result],
        [],
      ),
    'get_registry' : IDL.Func([], [IDL.Vec(StrikeRegistry)], ['query']),
    'get_registry_by_status' : IDL.Func(
        [IDL.Opt(StrikeStatus)],
        [IDL.Vec(StrikeRegistry)],
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
        [IDL.Principal, StrikeStatus],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
