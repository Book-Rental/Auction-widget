import React from "react";
import { Rb_Button, Rb_Image } from "@rentbook/rentbook-ui-lib";
import AuctionBannerImage from "../assets/AuctionBannerImage.png";

const AuctionBanner: React.FC = () => {
  const handleClick = () => {
    window.history.pushState({}, "", "/auction");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {/* Banner Image */}
      <Rb_Image
        src={AuctionBannerImage}
        alt="Auction Banner"
        className="w-full h-full"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Bottom Left Content */}
      <div className="absolute bottom-10 left-10 max-w-xl text-white">
        <h1 className="text-4xl font-bold leading-tight">
          Book Auctions
        </h1>

        <p className="mt-4 text-lg text-gray-200 leading-relaxed">
          Bid on rare and popular books. Discover exclusive collections,
          compete with other readers, and win your favorite books before the
          auction ends.
        </p>

        <Rb_Button
          onClick={handleClick}
          className="mt-8"
          size="lg"
        >
          Explore Auctions
        </Rb_Button>
      </div>
    </div>
  );
};

export default AuctionBanner;