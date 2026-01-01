import axios from "axios";
import { Connection } from "@solana/web3.js";

let LAST_UPDATED: number | null = null;

let prices: Record<string, { price: number }> = {};

const TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000;
export interface TokenDetails {
  name: string;
  mint:string;
  native:boolean;
  price:string;
  image:string;
}
export const SUPPORTED_TOKENS = [
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    image: "https://imgs.search.brave.com/BRQCLTlOZQrIoQyNIzERtNSoB5-etM7nz4PckjMyW7Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvdXNk/Yy1jb2luLTNkLWlj/b24tcG5nLWRvd25s/b2FkLTYwNDQ0NzUu/cG5n",
  },
  {
    name: "USDT",
    mint: "Es9vMFrzaCER6kNMcEnz5ZocGL8Hz48hD4i6a6td5Nj1",
    native: false,
    image: "https://imgs.search.brave.com/9F6r_eQQl8R-yAdLHPZ78u7_ugCoY65KGpdJ6BlmpfY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4z/ZC5pY29uc2NvdXQu/Y29tLzNkL3ByZW1p/dW0vdGh1bWIvdGV0/aGVyLWNvaW4tdXNk/dC0zZC1pY29uLXBu/Zy1kb3dubG9hZC01/MzI2Nzk4LnBuZw",
  },
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    image:"https://imgs.search.brave.com/bSTrHkl-tPCkfWjyLJRQP8pLFRKsdfyL3o_PUJGjogA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjQv/MDkzLzMxMi9zbWFs/bC9zb2xhbmEtc29s/LWdsYXNzLWNyeXB0/by1jb2luLTNkLWls/bHVzdHJhdGlvbi1m/cmVlLXBuZy5wbmc",
  },
];

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