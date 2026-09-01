import React from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { CheckCircle } from "lucide-react";

const PaymentSuccessHeader: React.FC = () => {
  return (
    <div className="relative flex min-h-[105px] items-center overflow-hidden rounded-t-lg border-b border-[#E5E7EB] bg-white px-8">
      
      {/* Decorative dots */}
      <span className="absolute left-10 top-5 h-1 w-1 rounded-full bg-green-500" />
      <span className="absolute left-20 top-12 h-1 w-1 rounded-full bg-blue-500" />
      <span className="absolute left-14 bottom-5 h-1 w-1 rounded-full bg-orange-400" />
      <span className="absolute left-36 top-7 h-1 w-1 rounded-full bg-purple-500" />

      {/* Success icon */}
      <div className="mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0FA968]">
          <CheckCircle
            size={32}
            strokeWidth={2}
            className="text-white"
          />
        </div>
      </div>

      {/* Text */}
      <div>
        <Rb_Text
          variant="h2"
          className="font-bold text-[#17152B]"
        >
          Payment Successful!
        </Rb_Text>

        <Rb_Text
          
          className="mt-1 text-sm text-gray-600"
        >
          Your order has been confirmed and is now being processed.
        </Rb_Text>

        <Rb_Text
          
          className="mt-1 text-xs text-gray-500"
        >
          We've sent an email with your order details and receipt.
        </Rb_Text>
      </div>

      {/* Decorative books */}
      <div className="absolute right-10 bottom-2 hidden text-5xl md:block">
        📚
      </div>
    </div>
  );
};

export default PaymentSuccessHeader;