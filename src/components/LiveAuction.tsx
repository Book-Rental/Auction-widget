import React from "react";
import {
    Rb_Button,
    Rb_Text,
    ProductCard,
    Rb_Anchor,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import { useAuctionBooks } from "../hooks/useAuctionBooks";

interface Auction {
    _id: string;
    bookId: string;
    bidPrice: number;
    buyNowPrice: number;
    duration: number;
    startDate: string;
    status: string;
    currentBidPrice: number;
    bidCount: number;
}

interface AuctionBook {
    _id: string;
    name: string;
    author: string;
    coverImage?: string;
    rentalPricePerWeek?: number;
    auction?: Auction;
}

const TrendingAuctionBooks = () => {
    const {
        data: auctionBooks = [],
        isLoading,
        isError,
    } = useAuctionBooks();

    const handleViewAllClick = () => {
        window.history.pushState({}, "", "/auction");

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const handleBookClick = (bookId: string) => {
        window.history.pushState(
            {},
            "",
            `/bidding?id=${bookId}`
        );

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const handleBidClick = (
        e: React.MouseEvent<HTMLButtonElement>,
        bookId: string
    ) => {
        e.stopPropagation();

        window.history.pushState(
            {},
            "",
            `/bidding?id=${bookId}`
        );

        window.dispatchEvent(
            new PopStateEvent("popstate")
        );
    };

    const getStatusClasses = (status?: string) => {
        switch (status?.toUpperCase()) {
            case "LIVE":
            case "ACTIVE":
                return "bg-green-100 text-green-700";

            case "UPCOMING":
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "ENDED":
            case "COMPLETED":
                return "bg-red-100 text-red-700";

            case "CANCELLED":
            case "CANCELED":
                return "bg-gray-100 text-gray-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <section className="mt-8 w-full">
            <div className="mx-10 my-10">

                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                    <Rb_Text
                        variant="h2"
                        className="font-bold text-[#1b1530]"
                    >
                        Live Auctions
                    </Rb_Text>

                    <Rb_Anchor
                        className="mt-6 font-medium text-[#2454FF] hover:underline"
                        onClick={handleViewAllClick}
                    >
                        View all
                    </Rb_Anchor>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <Rb_LoadingSpinner />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="py-10 text-center text-red-500">
                        Failed to load auction books.
                    </div>
                )}

                {/* Empty */}
                {!isLoading &&
                    !isError &&
                    auctionBooks.length === 0 && (
                        <div className="py-10 text-center text-gray-500">
                            No books are currently available
                            for auction.
                        </div>
                    )}

                {/* Cards */}
                {!isLoading &&
                    !isError &&
                    auctionBooks.length > 0 && (
                        <div className="flex gap-10 overflow-x-auto overflow-y-hidden scroll-smooth py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {auctionBooks.map(
                                (book: AuctionBook) => {

                                    const auction = book.auction;

                                    return (
                                        <div
                                            key={book._id}
                                            className="w-[220px] flex-shrink-0 cursor-pointer"
                                            onClick={() =>
                                                handleBookClick(
                                                    book._id
                                                )
                                            }
                                        >
                                            <ProductCard
                                                imageUrl={book.coverImage ?? "/images/book-placeholder.png"}
                                                title={
                                                    book.name
                                                }
                                                author={
                                                    book.author
                                                }
                                                priceText={`Current Bid ₹${
                                                    auction?.currentBidPrice ??
                                                    auction?.bidPrice ??
                                                    book.rentalPricePerWeek ??
                                                    0
                                                }`}
                                            >
                                                {/* Auction Details */}
                                                <div className="mb-3 space-y-2 text-sm text-gray-600">

                                                    {/* Status */}
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-500">
                                                            Status
                                                        </span>

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                                                                auction?.status
                                                            )}`}
                                                        >
                                                            {auction?.status ??
                                                                "N/A"}
                                                        </span>
                                                    </div>

                                                    {/* Time Left */}
                                                    <p className="font-bold text-red-600">
                                                        {auction?.status ===
                                                        "live"
                                                            ? `${auction.duration} days auction`
                                                            : auction?.status ??
                                                              "Auction unavailable"}
                                                    </p>

                                                    {/* Number of Bids */}
                                                    <p>
                                                        {auction?.bidCount ??
                                                            0}{" "}
                                                        bids
                                                    </p>
                                                </div>

                                                {/* Place Bid */}
                                                <Rb_Button
                                                    className="primary w-full"
                                                    onClick={(e) =>
                                                        handleBidClick(
                                                            e,
                                                            book._id
                                                        )
                                                    }
                                                >
                                                    Place Bid
                                                </Rb_Button>
                                            </ProductCard>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
            </div>
        </section>
    );
};

export default TrendingAuctionBooks;

