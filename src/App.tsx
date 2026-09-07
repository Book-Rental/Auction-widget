import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useEffect } from "react";

import "@rentbook/rentbook-ui-lib/microfrontend.min.css";

import AuctionHomePage from "./pages/AuctionHomePage";
import BidingPage from "./pages/Bidingpage";
import BidSuccesspage from "./pages/BidSuccesspage";

import PublishAuctionPage from "./components/PublishAuctionPage";

import AuctionDetailsPage from "./pages/AuctionDetailsPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import ReviewAuctionPage from "./pages/ReviewAuctionPage";

import MyBids from "./components/MyBids";
import OutBidPage from "./pages/OutbidCard";
import BidDetailsPage from "./pages/BidDetailsPage";

const queryClient = new QueryClient();

type View =
  | "auction"
  | "bidding"
  | "bid-success"
  | "my-bids"
  | "outbid"
  | "create-auction"
  | "bids-details";

type AppProps = {
  view?: View;
};

function App({ view }: AppProps) {
  const currentView = view ?? "auction";

  const params = new URLSearchParams(
    window.location.search
  );

  const step = params.get("step");

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("widget-loading-status", {
        detail: false,
      })
    );
  }, [currentView, step]);

  return (
    <QueryClientProvider client={queryClient}>
      
      {/* ---------------- Auction Home ---------------- */}

      {currentView === "auction" && (
        <AuctionHomePage />
      )}

      {/* ---------------- Bidding ---------------- */}

      {currentView === "bidding" && (
        <BidingPage />
      )}

      {/* ---------------- Bid Success ---------------- */}

      {currentView === "bid-success" && (
        <BidSuccesspage />
      )}

      {/* ---------------- My Bids ---------------- */}

      {currentView === "my-bids" && (
        <MyBids />
      )}
 {currentView === "bids-details" && (
        <BidDetailsPage />
      )}
      {/* ---------------- Outbid ---------------- */}

      {currentView === "outbid" && (
        <OutBidPage />
      )}

      {/* ---------------- Create Auction ---------------- */}

      {currentView === "create-auction" && (
        <>
          {(step === "book" || !step) && (
            <BookDetailsPage />
          )}

          {step === "auction" && (
            <AuctionDetailsPage />
          )}

          {step === "review" && (
            <ReviewAuctionPage />
          )}
          

          {step === "publish" && (
            <PublishAuctionPage />
          )}
        </>
      )}

    </QueryClientProvider>
  );
}

export default App;