"use client";

import { ReactNode, useEffect, useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/UseTokens";
import { PrimaryButton } from "./Button";
import axios from "axios";

export function Swap({
  publicKey,
  tokenBalances,
}: {
  publicKey: string;
  tokenBalances: {
    totalBalance: number;
    tokens: TokenWithBalance[];
  } | null;
}) {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [quoteAmount, setQuoteAmount] = useState<string>("");
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [quoteResponse, setQuoteResponse] = useState<any>(null);

  useEffect(() => {
    if (!baseAmount) return;

    setFetchingQuote(true);

    axios
      .get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${baseAsset.mint}&outputMint=${quoteAsset.mint}&amount=${
          Number(baseAmount) * 10 ** baseAsset.decimals
        }&slippageBps=50`
      )
      .then((res) => {
        setQuoteAmount(
          (
            Number(res.data.outAmount) /
            10 ** quoteAsset.decimals
          ).toString()
        );
        setQuoteResponse(res.data);
      })
      .finally(() => setFetchingQuote(false));
  }, [baseAsset, quoteAsset, baseAmount]);

  return (
    <div className="p-12 bg-slate-50">
      <div className="text-2xl font-bold pb-4">Swap Tokens</div>

      <SwapInputRow
        amount={baseAmount}
        onAmountChange={setBaseAmount}
        onSelect={setBaseAsset}
        selectedToken={baseAsset}
        title="You pay:"
        topBorderEnabled
        bottomBorderEnabled={false}
        subtitle={
          <div className="text-slate-500 pt-1 text-sm pl-1 flex">
            <div className="font-normal pr-1">Current Balance:</div>
            <div className="font-semibold">
              {
                tokenBalances?.tokens.find(
                  (x) => x.name === baseAsset.name
                )?.balance
              }{" "}
              {baseAsset.name}
            </div>
          </div>
        }
      />

      <div className="flex justify-center">
        <div
          onClick={() => {
            setBaseAsset(quoteAsset);
            setQuoteAsset(baseAsset);
          }}
          className="cursor-pointer rounded-full w-10 h-10 border absolute mt-[-20px] bg-white flex justify-center pt-2"
        >
          <SwapIcon />
        </div>
      </div>

      <SwapInputRow
        inputLoading={fetchingQuote}
        inputDisabled
        amount={quoteAmount}
        onSelect={setQuoteAsset}
        selectedToken={quoteAsset}
        title="You receive"
        topBorderEnabled={false}
        bottomBorderEnabled
      />

      <div className="flex justify-end pt-4">
        <PrimaryButton
          onClick={async () => {
            try {
              const res = await axios.post("/api/swap", {
                quoteResponse,
              });

              if (res.data?.txnId) {
                alert("Swap done!");
              }
            } catch {
              alert("Error while sending a txn");
            }
          }}
        >
          Swap
        </PrimaryButton>
      </div>
    </div>
  );
}

function SwapInputRow({
  onSelect,
  amount,
  onAmountChange,
  selectedToken,
  title,
  subtitle,
  topBorderEnabled,
  bottomBorderEnabled,
  inputDisabled,
  inputLoading,
}: {
  onSelect: (asset: TokenDetails) => void;
  selectedToken: TokenDetails;
  title: string;
  subtitle?: ReactNode;
  topBorderEnabled: boolean;
  bottomBorderEnabled: boolean;
  amount?: string;
  onAmountChange?: (value: string) => void;
  inputDisabled?: boolean;
  inputLoading?: boolean;
}) {
  return (
    <div
      className={`border flex justify-between p-6 ${
        topBorderEnabled ? "rounded-t-xl" : ""
      } ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}
    >
      <div>
        <div className="text-xs font-semibold mb-1">{title}</div>
        <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
        {subtitle}
      </div>

      <div>
        <input
          disabled={inputDisabled}
          value={inputLoading ? "Loading" : amount || ""}
          onChange={(e) => onAmountChange?.(e.target.value)}
          placeholder="0"
          type="text"
          className="bg-slate-50 p-6 outline-none text-4xl"
          dir="rtl"
        />
      </div>
    </div>
  );
}

function AssetSelector({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokenDetails;
  onSelect: (asset: TokenDetails) => void;
}) {
  return (
    <div className="w-24">
      <select
        value={selectedToken.name}
        onChange={(e) => {
          const token = SUPPORTED_TOKENS.find(
            (t) => t.name === e.target.value
          );
          if (token) onSelect(token);
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        {SUPPORTED_TOKENS.map((token) => (
          <option key={token.name} value={token.name}>
            {token.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </svg>
  );
}
