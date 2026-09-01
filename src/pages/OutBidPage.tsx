import React from "react";
import { auctionBooks } from "../components/auctionData";
import OutBidHeader from "../components/OutBidHeader";
import OutBidBidCard from "../components/OutBidBidCard";
import OutBidBookDetails from "../components/OutBidBookDetails";

const OutBidPage: React.FC = () => {
  const params = new URLSearchParams(
    window.location.search
  );

  const bookId = params.get("bookId") || "1";

  const book =
    auctionBooks.find(
      (item) => item.id === bookId
    ) || auctionBooks[0];

  return (
    <div className="min-h-screen bg-[#FAFBFE] px-4 py-6">
      <div className="mx-auto max-w-[900px]">

        {/* Main Outbid Card */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">

          <div className="grid grid-cols-[130px_1fr] gap-5">

            {/* Book Image */}
            <div className="flex justify-center">
              <img
                src={book.image}
                alt={book.title}
                className="h-[155px] w-[110px] rounded-md object-cover"
              />
            </div>

            {/* Right Section */}
            <div className="space-y-3">

              <OutBidHeader
                book={book}
              />

              <OutBidBidCard
                currentBid={380}
                yourBid={350}
                bookId={book.id}
              />

            </div>
          </div>
        </div>

        {/* About Book */}
        <OutBidBookDetails
          book={book}
        />

      </div>
    </div>
  );
};

export default OutBidPage;