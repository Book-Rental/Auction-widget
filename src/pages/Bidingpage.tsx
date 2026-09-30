import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AuctionBidCard from "../components/AuctionBidCard";
import AuctionBookDetails from "../components/AuctionBookDetails";
import AuctionBookInfo from "../components/AuctionBookInfo";
import { fetchAuctionBookById } from "../hooks/useAuctionBookDetails";
import { Rb_LoadingSpinner } from "@rentbook/rentbook-ui-lib";

const BidingPage = () => {
    const getBookIdFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("id") || undefined;
    };

    const [bookId, setBookId] = useState<string | undefined>(
        getBookIdFromUrl()
    );

    useEffect(() => {
        const handlePopState = () => {
            const id = getBookIdFromUrl();
            setBookId(id);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const {
        data: bookData,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["auction-book", bookId],
        queryFn: () => fetchAuctionBookById(bookId!),
        enabled: Boolean(bookId),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });

    // ----------------------------------------
    // Loading
    // ----------------------------------------

    if (!bookId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                Book ID is missing.
            </div>
        );
    }

    if (isPending) {
        return <Rb_LoadingSpinner />;
    }

    // ----------------------------------------
    // Error
    // ----------------------------------------

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                Failed to load auction book.
            </div>
        );
    }

    // ----------------------------------------
    // No book
    // ----------------------------------------

    if (!bookData) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Book not found.
            </div>
        );
    }

    // ----------------------------------------
    // Auction information
    // ----------------------------------------

    const auctionId = bookData.auctionId?._id;

    const currentHighestBid =
        bookData.auctionId?.currentBidPrice ??
        bookData.auctionId?.bidPrice ??
        0;

    if (!auctionId) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Auction not available for this book.
            </div>
        );
    }

    // ----------------------------------------
    // Page
    // ----------------------------------------

    return (
    <div className="min-h-screen">
        <div className="px-10 py-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Book Information */}
                <div className="lg:col-span-7">
                    <AuctionBookInfo bookId={bookId} />
                </div>

                {/* Bidding Card */}
                <div className="lg:col-span-5">
                    <AuctionBidCard
                        auctionId={auctionId}
                        bookId={bookId}
                        bookTitle="Book"
                        currentHighestBid={currentHighestBid}
                    />
                </div>
            </div>
        </div>

        <div className="px-10 pb-10">
            <AuctionBookDetails />
        </div>
    </div>
);
};

export default BidingPage;