import AuctionBanner from "../components/AuctionBanner";
import AuctionWorks from "../components/AuctionWorks";
import LiveAuction from "../components/LiveAuction";

const AuctionHomePage = () => {
  return (
    <div className="min-h-screen">
      <AuctionBanner />

      <div className="py-10 space-y-12">
        <LiveAuction />
        <AuctionWorks />
      </div>

      
    </div>
  );
};

export default AuctionHomePage;