import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AuctionBidCard from "../components/AuctionBidCard";
import AuctionBookDetails from "../components/AuctionBookDetails";
import AuctionBookInfo from "../components/AuctionBookInfo";
import { fetchAuctionBookById } from "../hooks/useAuctionBookDetails";

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

            console.log("BidingPage - Book ID:", id);

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

    const {
        data: bookData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["auction-book", bookId],
        queryFn: () => fetchAuctionBookById(bookId!),
        enabled: !!bookId,
    });

    // Get auction ID from API response
    const auctionId = bookData?.auctionId?._id;

    // Get current bid from API response
    const currentHighestBid =
        bookData?.auctionId?.currentBidPrice ??
        bookData?.auctionId?.bidPrice ??
        0;

    console.log("Auction Book Data:", bookData);
    console.log("Auction ID:", auctionId);
    console.log("Current Highest Bid:", currentHighestBid);

    if (!bookId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                Book ID is missing.
            </div>
        );
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                Failed to load auction book.
            </div>
        );
    }

    if (!bookData) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Book not found.
            </div>
        );
    }

    if (!auctionId) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Auction not available for this book.
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="px-10 py-10">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                    {/* Book Information */}
                    <div className="lg:col-span-7">
                        <AuctionBookInfo
                            bookId={bookId}
                        />
                    </div>

                    {/* Bidding Card */}
                    <div className="lg:col-span-5">
                        <AuctionBidCard
                            auctionId={auctionId}
                            bookId={bookId}
                            bookTitle="Book"
                            currentHighestBid={
                                currentHighestBid
                            }
                        />
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