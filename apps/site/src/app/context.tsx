'use client';
import React, { useEffect, useState } from 'react';

import { createActor, canisterId } from '@/backend';
import { Actor, HttpAgent, Identity, SignIdentity } from '@dfinity/agent';
import { useConnect } from '@oranjbase/icp-wallet-adapter-react';
import { isTestIdentity } from '@/config';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { IdbStorage, KEY_STORAGE_KEY } from '@dfinity/auth-client';
import DevAuthModal from '@/components/modals/DevAuthModal';

type BackendContextProps = {
  agent: HttpAgent;
  actor: ReturnType<typeof createActor>;
  setIdentity: (identity: SignIdentity | null) => void;
  identity: Identity | null;
  isAdmin: boolean;
  isCheckingAdmin: boolean;
};

const DFX_URL =
  process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
    ? 'https://ic0.app'
    : 'http://127.0.0.1:4943';

const BackendContext = React.createContext<BackendContextProps | null>(null);

export function useBackend() {
  const context = React.useContext(BackendContext);
  if (!context) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
}

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const agent = HttpAgent.createSync({ host: DFX_URL });
  const [actor, setActor] = useState(
    createActor(canisterId, {
      agent,
    }),
  );

  const [isAdmin, setIsAmdin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmini] = useState(true);

  const { identity: icpIdentity } = useConnect();
  const [identity, setIdentity] = useState<SignIdentity | Identity | null>(
    null,
  );

  useEffect(() => {
    if (icpIdentity) {
      setIdentity(icpIdentity);
    }
  }, [icpIdentity]);

  useEffect(() => {
    if (identity) {
      setIsCheckingAdmini(true);
      if (isTestIdentity(identity) && identity instanceof Ed25519KeyIdentity) {
        const storage = new IdbStorage();
        storage.set(KEY_STORAGE_KEY, JSON.stringify(identity.toJSON()));
      }

      (async () => {
        Actor.agentOf(actor as unknown as Actor)?.replaceIdentity?.(identity);
        setActor(actor);
        const adminStatus = await actor.is_admin(identity.getPrincipal());
        setIsAmdin(adminStatus);
        setIsCheckingAdmini(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity]);

  return (
    <BackendContext.Provider
      value={{ agent, actor, identity, setIdentity, isAdmin, isCheckingAdmin }}
    >
      {children}
      <DevAuthModal />
    </BackendContext.Provider>
  );
}
