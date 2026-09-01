import React from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { auctionBooks } from "./auctionData";

const OrderSummary: React.FC = () => {
  const book = auctionBooks[0];

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-4">
      
      <Rb_Text
        variant="h3"
        className="mb-3 font-semibold text-[#17152B]"
      >
        Order Summary
      </Rb_Text>

      {/* Book */}
      <div className="flex gap-5">
        <img
          src={book.image}
          alt={book.title}
          className="h-[105px] w-[70px] rounded-md border object-cover"
        />

        <div className="flex-1">
          <Rb_Text
            
            className="font-semibold text-[#17152B]"
          >
            {book.title}
          </Rb_Text>

          <Rb_Text
            
            className="mt-1 text-[10px] text-gray-600"
          >
            by {book.author}
          </Rb_Text>

          <span className="mt-2 inline-block rounded bg-blue-50 px-2 py-1 text-[9px] font-medium text-blue-600">
            Won through auction
          </span>
        </div>

        <Rb_Text
          
          className="font-semibold text-[#17152B]"
        >
          ₹370.00
        </Rb_Text>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-[#E5E7EB]" />

      {/* Price details */}
      <div className="space-y-3">

        <div className="flex justify-between">
          <Rb_Text
            
            className="text-xs text-gray-600"
          >
            Winning Bid
          </Rb_Text>

          <Rb_Text
            
            className="text-xs font-medium"
          >
            ₹370.00
          </Rb_Text>
        </div>

        <div className="flex justify-between">
          <Rb_Text
            
            className="text-xs text-gray-600"
          >
            Platform Fee
          </Rb_Text>

          <Rb_Text
            
            className="text-xs font-medium"
          >
            ₹20.00
          </Rb_Text>
        </div>

        <div className="flex justify-between">
          <Rb_Text
            
            className="text-xs text-gray-600"
          >
            Shipping
          </Rb_Text>

          <Rb_Text
            
            className="text-xs font-medium"
          >
            ₹60.00
          </Rb_Text>
        </div>

      </div>

      <div className="my-3 border-t border-[#E5E7EB]" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <Rb_Text
          
          className="font-semibold text-[#17152B]"
        >
          Total Paid
        </Rb_Text>

        <Rb_Text
          variant="h3"
          className="font-bold text-[#1455E6]"
        >
          ₹450.00
        </Rb_Text>
      </div>

    </div>
  );
};

export default OrderSummary;