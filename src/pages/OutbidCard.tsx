import OtherLiveAuctions from "../components/OtherLiveAuctions";
import OutbidCard from "../components/OutbidCard";
const OutBidPage = () => {
  return (
    <div className="min-h-screen">
  <div className="mx-auto max-w-7xl px-6 py-8">
  <OutbidCard />

  <div className="mt-8">
    <OtherLiveAuctions />
  </div>
</div>
    </div>
  );
};

export default OutBidPage;