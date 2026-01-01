import { NextRequest, NextResponse } from "next/server";
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint
} from "@solana/spl-token";
import { getSupportedTokens, connection } from "@/app/lib/constants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const publicKey = new PublicKey(address);
  const supportedTokens = await getSupportedTokens();

  const tokensWithBalances = await Promise.all(
    supportedTokens.map(async (token) => {
      try {
        const balance = await getAccountBalance(token, publicKey);
        return {
          ...token,
          balance,
          usdBalance: balance // placeholder for pricing layer
        };
      } catch {
        return {
          ...token,
          balance: 0,
          usdBalance: 0
        };
      }
    })
  );

  const totalBalance = tokensWithBalances.reduce(
    (sum, t) => sum + Number(t.usdBalance || 0),
    0
  );

  return NextResponse.json({
    totalBalance,
    tokens: tokensWithBalances
  });
}

async function getAccountBalance(
  token: {
    mint: string;
    native: boolean;
  },
  owner: PublicKey
) {
  if (token.native) {
    const lamports = await connection.getBalance(owner);
    return lamports / LAMPORTS_PER_SOL;
  }

  const ata = await getAssociatedTokenAddress(
    new PublicKey(token.mint),
    owner
  );

  const account = await getAccount(connection, ata);
  const mint = await getMint(connection, new PublicKey(token.mint));

  return Number(account.amount) / 10 ** mint.decimals;
}
