"use client";

import React, { Children } from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  prefix?: React.ReactNode;
};

export const PrimaryButton = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 border border-transparent font-medium rounded-base text-sm px-4 py-2.5 inline-flex items-center"
    >
      
      {children}
    </button>
  );
};

export const SecondaryButton = ({
  children,
  onClick,
  prefix,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 border border-transparent font-medium rounded-base text-sm px-4 py-2.5 inline-flex items-center gap-2"
    >
      {prefix}
      <GoogleIcon />
      {children}
    </button>
  );
};

const GoogleIcon = () => (
  <svg
    className="w-4 h-4"
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
    />
  </svg>
);


export const TabButton = ({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}  
      className={`text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium
      rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
        active ? "bg-blue-500" : "bg-blue-300"
      }`}
    >
      {children}
    </button>
  );
};
