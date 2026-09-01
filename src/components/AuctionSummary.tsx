import React from "react";

const AuctionSummary: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[#6841D8]">♜</span>

        <h3 className="text-sm font-semibold">
          Auction Summary
        </h3>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between">
          <div>
            <p className="text-xs font-medium">
              Starting Bid
            </p>

            <p className="mt-1 text-[10px] text-gray-500">
              Set a competitive starting price
            </p>
          </div>

          <span className="text-xs font-medium text-green-600">
            ₹0.00
          </span>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-xs font-medium">
              Buy Now Price{" "}
              <span className="font-normal text-gray-400">
                (Optional)
              </span>
            </p>

            <p className="mt-1 text-[10px] text-gray-500">
              Allow users to buy instantly
            </p>
          </div>

          <span className="text-xs text-gray-400">
            Not set
          </span>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-xs font-medium">
              Auction Duration
            </p>

            <p className="mt-1 text-[10px] text-gray-500">
              Set how long your auction will run
            </p>
          </div>

          <span className="text-xs text-gray-400">
            Not set
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <div>
              <p className="text-xs font-medium">
                Listing Fee
              </p>

              <p className="mt-1 text-[10px] text-gray-500">
                You won't be charged until it sells
              </p>
            </div>

            <span className="text-xs font-medium text-green-600">
              ₹0.00
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-3">
          <p className="text-xs font-semibold text-[#6841D8]">
            ♢ Secure & Safe
          </p>

          <p className="mt-1 text-[10px] text-[#6841D8]">
            Your book will be listed after review. We
            ensure a safe auction experience for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuctionSummary;