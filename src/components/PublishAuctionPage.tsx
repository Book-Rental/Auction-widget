import React from "react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import AuctionStepper from "./AuctionStepper";


const PublishAuctionPage: React.FC = () => {
  const handleViewAuction = () => {
    window.history.pushState(
      {},
      "",
      "/auction"
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <AuctionStepper currentStep={4} />

        <div className="flex min-h-[500px] items-center justify-center">
          <div className="w-full max-w-xl rounded-xl border bg-white p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <span className="text-4xl text-green-600">
                ✓
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Auction Published Successfully!
            </h1>

            <p className="mt-3 text-gray-500">
              Your book has been successfully listed for
              auction.
            </p>

            <div className="mt-6 rounded-lg bg-gray-50 p-5 text-left">
              <p className="text-sm text-gray-500">
                Book
              </p>

              <p className="font-semibold">
                Atomic Habits
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Starting Bid
              </p>

              <p className="font-semibold text-[#2454FF]">
                ₹350.00
              </p>
            </div>

            <Rb_Button
              className="mt-6 w-full"
              onClick={handleViewAuction}
            >
              View Auction
            </Rb_Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishAuctionPage;