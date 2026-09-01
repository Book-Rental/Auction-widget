import { useEffect, useState } from "react";

import AuctionBidCard from "../components/AuctionBidCard";
import AuctionBookDetails from "../components/AuctionBookDetails";
import AuctionBookInfo from "../components/AuctionBookInfo";

const BidingPage = () => {
    const getBookIdFromUrl = () => {
        const params = new URLSearchParams(
            window.location.search
        );

        return params.get("id") || undefined;
    };

    const [bookId, setBookId] = useState<
        string | undefined
    >(getBookIdFromUrl);

    useEffect(() => {
        const handlePopState = () => {
            const id = getBookIdFromUrl();

            console.log(
                "BidingPage - Book ID:",
                id
            );

            setBookId(id);
        };

        window.addEventListener(
            "popstate",
            handlePopState
        );

        return () => {
            window.removeEventListener(
                "popstate",
                handlePopState
            );
        };
    }, []);

    console.log(
        "BidingPage bookId:",
        bookId
    );

    return (
        <div className="min-h-screen">
            <div className="px-10 py-10">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                    {/* Book Information */}
                    <div className="lg:col-span-7">
                        {bookId ? (
                            <AuctionBookInfo
                                bookId={bookId}
                            />
                        ) : (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                                Book ID is missing.
                            </div>
                        )}
                    </div>

                    {/* Bidding Card */}
                    <div className="lg:col-span-5">
                        {bookId ? (
                            <AuctionBidCard
                                auctionId="6a8517dcfaa1d91f3883ce6e"
                                bookId={bookId}
                                // userId="6a82ef1af704d3b3471c4ef5"
                                bookTitle="Harry Potter"
                                currentHighestBid={320}
                                auctionEndsIn="2d 14h 20m 45s"
                            />
                        ) : (
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                                Unable to load bidding information.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Book Details */}
            <div className="px-10 pb-10">
                <AuctionBookDetails />
            </div>
        </div>
    );
};

export default BidingPage;