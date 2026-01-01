import axios from "axios";
import { Connection } from "@solana/web3.js";
import { SUPPORTED_TOKENS } from "./tokens";

let LAST_UPDATED: number | null = null;

let prices: Record<string, { price: number }> = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000;


export const connection = new Connection(
  "https://api.mainnet-beta.solana.com"
);

export async function getSupportedTokens() {
  const now = Date.now();

  if (!LAST_UPDATED || now - LAST_UPDATED > TOKEN_PRICE_REFRESH_INTERVAL) {
    const response = await axios.get("https://lite-api.jup.ag/price/v3", {
      params: {
        ids: SUPPORTED_TOKENS.map(t => t.mint).join(","),
        vsToken: "USDC",
      },
    });

    prices = response.data?.data ?? {};
    LAST_UPDATED = now;
  }

  return SUPPORTED_TOKENS.map(token => ({
    ...token,
    price: prices?.[token.mint]?.price ?? null,
  }));
}


getSupportedTokens();