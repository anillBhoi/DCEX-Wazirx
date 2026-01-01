import { useEffect, useState } from "react";
import axios from "axios";
import { TokenDetails } from "@/app/lib/tokens";

export interface TokenWithBalance extends TokenDetails {
  balance: number;
  usdBalance: number;
}

export function useTokens(address: string) {
  const [tokenBalances, setTokenBalances] = useState<{
    totalBalance: number;
    tokens: TokenWithBalance[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    setLoading(true);

    axios
      .get(`/api/tokens?address=${address}`)
      .then((res) => {
        setTokenBalances(res.data);
      })
      .finally(() => setLoading(false));
  }, [address]); // ✅ REQUIRED

  return { loading, tokenBalances };
}
