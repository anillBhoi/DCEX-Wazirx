"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton, TabButton } from "./Button";
import { useEffect, useState } from "react";
import { useTokens } from "../api/hooks/UseTokens";
import { Swap } from "./Swap";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw";

const tabs: { id: Tab; name: string }[] = [
  { id: "tokens", name: "Tokens" },
  { id: "send", name: "Send" },
  { id: "add_funds", name: "Add Funds" },
  { id: "withdraw", name: "Withdraw" },
  { id: "swap", name: "Swap" },
];

export const ProfileCard = ({ publicKey }: { publicKey: string }) => {
  const session = useSession();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<Tab>("tokens");

  // ✅ SINGLE source of truth
  const { tokenBalances, loading } = useTokens(publicKey);

  if (session.status === "loading") return <div>Loading...</div>;

  if (!session.data?.user) {
    router.push("/");
    return null;
  }

  return (
    <div className="pt-8 flex justify-center">
      <div className="max-w-4xl bg-white rounded shadow w-full">

        <Greeting
          image={session.data.user.image ?? ""}
          name={session.data.user.name ?? ""}
        />

        <div className="w-full flex px-10 py-12">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={tab.id === selectedTab}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.name}
            </TabButton>
          ))}
        </div>

        {selectedTab === "tokens" && (
          <Assets
            publicKey={publicKey}
            tokenBalances={tokenBalances}
            loading={loading}
          />
        )}

        {selectedTab === "swap" && (
          <Swap publicKey={publicKey} tokenBalances={tokenBalances} />
        )}
      </div>
    </div>
  );
};

/* -------------------- ASSETS -------------------- */

function Assets({
  publicKey,
  tokenBalances,
  loading,
}: {
  publicKey: string;
  tokenBalances: {
    totalBalance: number;
    tokens: any[];
  } | null;
  loading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(t);
  }, [copied]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!tokenBalances) return null;

  return (
    <div className="text-slate-500 mt-4 px-10 pb-10">
      Account assets

      <div className="flex justify-between pt-2">
        <div className="flex">
          <div className="text-5xl font-bold text-black pt-2">
            ${tokenBalances.totalBalance.toFixed(2)}
          </div>
          <div className="font-slate-500 font-bold text-3xl flex flex-col justify-end pb-0 pl-2">
            USD
          </div>
        </div>

        <PrimaryButton
          onClick={() => {
            navigator.clipboard.writeText(publicKey);
            setCopied(true);
          }}
        >
          {copied ? "Copied" : "Your wallet address"}
        </PrimaryButton>
      </div>

      <div className="mt-6 space-y-3">
        {tokenBalances.tokens.map((token) => (
          <div
            key={token.mint}
            className="flex items-center justify-between border rounded p-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={token.image}
                className="w-8 h-8 rounded-full"
                alt={token.name}
              />
              <div>
                <div className="font-medium text-black">{token.name}</div>
                <div className="text-xs text-gray-500">
                  {token.balance}
                </div>
              </div>
            </div>

            <div className="font-semibold text-black">
              ${token.usdBalance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- HEADER -------------------- */

function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex p-10">
      <img src={image} className="rounded-full w-16 h-16 mr-4" />
      <div className="text-2xl font-semibold flex flex-col justify-center">
        Welcome back, {name}
      </div>
    </div>
  );
}
