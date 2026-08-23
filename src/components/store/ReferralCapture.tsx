"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams?.get("ref");
    if (ref) {
      const cleanRef = ref.trim().toUpperCase();
      try {
        localStorage.setItem("referralCode", cleanRef);
        localStorage.setItem("referralTimestamp", Date.now().toString());
      } catch (err) {
        console.error("Failed to save referral code in localStorage:", err);
      }
    }
  }, [searchParams]);

  return null;
}
