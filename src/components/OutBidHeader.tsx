import React from "react";
import {
  Rb_Text
} from "@rentbook/rentbook-ui-lib";

interface OutBidHeaderProps {
  book: {
    title: string;
    author: string;
  };
}

const OutBidHeader: React.FC<
  OutBidHeaderProps
> = () => {
  return (
    <>
      <div className="flex items-start gap-3">

        {/* Alert Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
            !
          </div>
        </div>

        <div>
          <Rb_Text
            variant="h3"
            className="font-bold text-[#17152B]"
          >
            You've been outbid!
          </Rb_Text>

          <Rb_Text
            className="mt-1 text-gray-600"
          >
            booklover23 has placed a higher bid.
          </Rb_Text>
        </div>

      </div>
    </>
  );
};

export default OutBidHeader;