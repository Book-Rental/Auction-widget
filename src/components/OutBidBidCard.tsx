import React, { useState } from "react";
import {
  Rb_Button,
  Rb_Input,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

interface OutBidBidCardProps {
  currentBid: number;
  yourBid: number;
  bookId: string;
}

const OutBidBidCard: React.FC<
  OutBidBidCardProps
> = ({
  currentBid,
  yourBid,
  bookId,
}) => {
  const [bidAmount, setBidAmount] =
    useState("");

  const quickBids = [
    400,
    450,
    500,
    550,
    600,
  ];

  const handlePlaceBid = () => {
    if (!bidAmount) {
      return;
    }

    window.history.pushState(
      {},
      "",
      `/bid-success?bookId=${bookId}&bid=${bidAmount}`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div>

      {/* Bid Information */}
      <div className="grid grid-cols-3 divide-x rounded-md border border-[#E5E7EB]">

        {/* Current Highest Bid */}
        <div className="px-4 py-3">

          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            Current Highest Bid
          </Rb_Text>

          <Rb_Text
            variant="h3"
            className="mt-1 font-bold text-[#1455E6]"
          >
            ₹{currentBid.toFixed(2)}
          </Rb_Text>

          <Rb_Text

            className="mt-1 text-[9px] text-[#1455E6]"
          >
            by booklover23
          </Rb_Text>

        </div>

        {/* Your Bid */}
        <div className="px-4 py-3">

          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            Your Bid
          </Rb_Text>

          <Rb_Text
            variant="h3"
            className="mt-1 font-bold text-[#17152B]"
          >
            ₹{yourBid.toFixed(2)}
          </Rb_Text>

        </div>

        {/* Auction Ends */}
        <div className="px-4 py-3">

          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            Auction Ends In
          </Rb_Text>

          <Rb_Text
            variant="h3"
            className="mt-1 font-bold text-[#1455E6]"
          >
            02 : 14 : 20 : 45
          </Rb_Text>

          <div className="mt-1 flex gap-4 text-[8px] text-gray-500">
            <span>Days</span>
            <span>Hrs</span>
            <span>Mins</span>
            <span>Secs</span>
          </div>

        </div>

      </div>

      {/* Info */}
      <div className="mt-3 rounded-md bg-[#F0F5FF] px-3 py-2.5">

        <Rb_Text

          className="text-[10px] text-gray-600"
        >
          💡 &nbsp; Don't worry! You can place a higher
          bid and stay in the lead.
        </Rb_Text>

      </div>

      {/* Higher Bid */}
      <div className="mt-3 rounded-md border border-[#E5E7EB] p-3">

        <Rb_Text

          className="mb-3 font-semibold text-[#17152B]"
        >
          Place a Higher Bid
        </Rb_Text>

        {/* Input */}
        <Rb_Input
          type="number"
          value={bidAmount}
          onChange={(e) =>
            setBidAmount(e.target.value)
          }
          placeholder="Enter your maximum bid"
          className="w-full"
        />

        {/* Quick Bids */}
        <div className="mt-2 grid grid-cols-5 gap-3">

          {quickBids.map((amount) => (
            <Rb_Button
              key={amount}
              variant="secondary"
              className="h-7 text-[9px]"
              onClick={() =>
                setBidAmount(
                  String(amount)
                )
              }
            >
              ₹{amount}
            </Rb_Button>
          ))}

        </div>

        {/* Validation */}
        <div className="mt-2 rounded-md bg-[#F0F5FF] px-3 py-2">

          <Rb_Text

            className="text-[9px] text-gray-600"
          >
            🔒 &nbsp; Enter a higher amount than the
            current highest bid (₹
            {currentBid.toFixed(2)})
          </Rb_Text>

        </div>

        {/* Place Bid */}
        <Rb_Button
          variant="primary"
          className="mt-2 h-8 w-full"
          disabled={
            !bidAmount ||
            Number(bidAmount) <= currentBid
          }
          onClick={handlePlaceBid}
        >
          Place Bid
        </Rb_Button>

      </div>

    </div>
  );
};

export default OutBidBidCard;