import { useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

const quickBids = [400, 450, 500, 550, 600];

const OutbidCard = () => {
  const [bidAmount, setBidAmount] = useState("");

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex gap-8">
        {/* Book Image */}
        <div className="w-48 flex-shrink-0">
          <img
            src="https://m.media-amazon.com/images/I/91bYsX41DVL.jpg"
            alt="Atomic Habits"
            className="h-[240px] w-full rounded-lg border object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle
                size={34}
                className="fill-red-500 text-white"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#1B1530]">
                You've been outbid!
              </h2>

              <p className="mt-1 text-gray-500">
                <span className="font-medium text-[#1B1530]">
                  booklover23
                </span>{" "}
                has placed a higher bid.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-xl border border-gray-200">
            <div className="grid grid-cols-3 divide-x">
              <div className="p-5">
                <p className="text-sm text-gray-500">
                  Current Highest Bid
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#2454FF]">
                  ₹380.00
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  by{" "}
                  <span className="font-medium text-[#2454FF]">
                    booklover23
                  </span>
                </p>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-500">
                  Your Bid
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  ₹350.00
                </h3>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-500">
                  Auction Ends In
                </p>

                <div className="mt-2 flex gap-2 text-[#2454FF]">
                  <span className="text-2xl font-bold">02</span>
                  <span>:</span>

                  <span className="text-2xl font-bold">14</span>
                  <span>:</span>

                  <span className="text-2xl font-bold">20</span>
                  <span>:</span>

                  <span className="text-2xl font-bold">45</span>
                </div>

                <div className="mt-2 flex gap-5 text-xs text-gray-500">
                  <span>Days</span>
                  <span>Hrs</span>
                  <span>Mins</span>
                  <span>Secs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-5 flex items-center gap-3 rounded-lg bg-blue-50 p-4">
            <Lock
              size={18}
              className="text-[#2454FF]"
            />

            <p className="text-sm text-gray-600">
              Don't worry! You can place a higher bid and stay in the
              lead.
            </p>
          </div>

          {/* Bid Form */}
          <div className="mt-8 rounded-xl border border-gray-200 p-6">
            <h3 className="mb-5 text-lg font-semibold text-[#1B1530]">
              Place a Higher Bid
            </h3>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                ₹
              </span>

              <input
                type="number"
                value={bidAmount}
                onChange={(e) =>
                  setBidAmount(e.target.value)
                }
                placeholder="Enter your maximum bid"
                className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 outline-none focus:border-[#2454FF]"
              />
            </div>

            <div className="mt-4 grid grid-cols-5 gap-3">
              {quickBids.map((amount) => (
                <button
                  key={amount}
                  onClick={() =>
                    setBidAmount(amount.toString())
                  }
                  className="h-11 rounded-lg border border-gray-300 transition hover:border-[#2454FF] hover:text-[#2454FF]"
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-lg bg-blue-50 p-4">
              <Lock
                size={18}
                className="text-[#2454FF]"
              />

              <p className="text-sm text-gray-600">
                Enter a higher amount than the current highest bid
                (₹380.00)
              </p>
            </div>

            <Rb_Button className="mt-6 w-full">
              Place Bid
            </Rb_Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutbidCard;