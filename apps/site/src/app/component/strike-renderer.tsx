import React from "react";
import { HttpAgent } from "@dfinity/agent";
import { Blink, useAction, useActionICPWalletAdapter } from "@blinks-icp/core";

import { host } from "../../config";

export default function StrikeRenderer({ url }: { url: string }) {
  // TODO: update this
  const agent = new HttpAgent({ host });
  const { adapter } = useActionICPWalletAdapter({
    agent,
  });
  const { action } = useAction({ url, adapter });
  return (
    <>
      {action ? (
        <Blink action={action} websiteText={action.canisterId} />
      ) : null}
    </>
  );
}
