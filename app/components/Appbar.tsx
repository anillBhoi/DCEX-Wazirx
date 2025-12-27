"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { PrimaryButton } from "./Button";

export const Appbar = () => {
  const session = useSession();

  return (
    <div className="border-b px-2 py-2 flex justify-between">
      <div className="text-xl font-bold flex items-center">
        DCEX
      </div>

      <div>
        {session.data?.user ? (
          <PrimaryButton onClick={() => signOut()}>
            Sign Out
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={() => signIn()}>
            Sign In
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};
