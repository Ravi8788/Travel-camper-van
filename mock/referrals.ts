import type { ReferralProgram } from "@/lib/types";

export const referralProgram: ReferralProgram = {
  id: "ref-001",
  title: "Refer a Friend, Earn Rewards",
  description:
    "Share the adventure! Refer a friend to Travel On Wheels and both of you get ₹1,000 off your next booking.",
  rewardAmount: 1000,
  terms: [
    "Referral must complete their first booking",
    "Reward applied to your next rental (not deposit)",
    "Cannot be combined with other offers",
    "Program terms subject to change",
  ],
  active: true,
};
