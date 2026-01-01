"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./Button";
import { useEffect, useState } from "react";
import { time } from "console";
import { useTokens } from "../api/hooks/UseTokens";

export const ProfileCard = ({publicKey}:{
    publicKey:string
}) => {
     const session = useSession();
        const router = useRouter();
    
        if(session.status === "loading") {
            // Todo: replace with a skeleton
            return <div>
                Loading...
            </div>
        }
    
        if(!session.data?.user) {
            router.push("/")
        }

          
    
        return <div className="pt-8 flex justify-center">
          <div className="max-w-4xl bg-white rounded shadow w-full p-12">
              <Greeting 
              image={session.data?.user?.image ?? ""} 
              name={session.data?.user?.name ?? ""} 
              />
              
               <Assets publicKey={publicKey}/>
          </div>
        </div>
    }
    
    function Assets({publicKey}: {
        publicKey: string
    }) {
       
        const [copied, setCopied] = useState(false);
        const {tokenBalances,loading} = useTokens(publicKey);
        useEffect(() => {
          
            if(copied) {
                const timeout = setTimeout(() => {

                    setCopied(false)
                },3000)
                return () => {
                    clearTimeout(timeout);
                }
            }

        }, [copied])

        if(loading) {
            return "Loading...."
        }

        return <div className="text-slate-500 mt-4">
             Account assets 
             <br />
             <div className="flex justify-between pt-2">
                <div className="flex">
                       <div className="text-5xl font-bold text-black pt-2">
                           $ {tokenBalances?.totalBalance.toFixed(2)}
               </div>
               <div className="font-slate-500 font-bold text-3xl flex flex-col justify-end pb-0 pl-2">
                    USD
               </div>
                </div>
               
               <div>
                <PrimaryButton onClick={() => {
                    navigator.clipboard.writeText(publicKey);
                    setCopied(true);
                }}>
                    {copied ? "copied" :"Your wallet address "}
                </PrimaryButton>
               </div>
             </div>
            <div className="mt-6 space-y-3">
  {tokenBalances?.tokens.map((token) => (
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

    }
    
    function Greeting ({
        image, name
       
    }: {
        image: string, name: string
    }) {
        return <div className="flex">
              <img src={image} className="rounded-full w-16 h-16 mr-4" />
              <div className="text-2xl font-semibold flex flex-col justify-center">
                  Welcome back,  {name}
              </div>
        </div>
}