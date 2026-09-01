import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import {
    Rb_Button,
    Rb_Text,
    Rb_Icon,
} from "@rentbook/rentbook-ui-lib";

interface SuccessfulBid {
    auctionId: string;
    bookId: string;
    userId: string;
    bidPrice: number;
    bookTitle: string;
    currentHighestBid: number;
    auctionEndsIn: string;
}

const BidSuccessCard = () => {
    const [bidData, setBidData] =
        useState<SuccessfulBid | null>(
            null
        );

    useEffect(() => {
        const storedBid =
            sessionStorage.getItem(
                "successfulBid"
            );

        if (!storedBid) {
            console.log(
                "No successful bid found."
            );
            return;
        }

        try {
            const parsedBid: SuccessfulBid =
                JSON.parse(storedBid);

            console.log(
                "Successful bid:",
                parsedBid
            );

            setBidData(parsedBid);
        } catch (error) {
            console.error(
                "Failed to parse successful bid:",
                error
            );
        }
    }, []);

    const handleViewAuction = () => {
        if (!bidData) {
            return;
        }

        window.history.pushState(
            {},
            "",
            `/auction-details?id=${bidData.bookId}`
        );

        window.dispatchEvent(
            new PopStateEvent(
                "popstate"
            )
        );
    };

    const handleBackToAuctions = () => {
        window.history.pushState(
            {},
            "",
            "/auction"
        );

        window.dispatchEvent(
            new PopStateEvent(
                "popstate"
            )
        );
    };

    /*
     * If there is no stored bid
     */
    if (!bidData) {
        return (
            <div className="mx-auto max-w-4xl bg-white p-8">
                <Rb_Text
                    variant="h3"
                    className="text-center"
                >
                    Bid information not
                    found.
                </Rb_Text>

                <div className="mt-6 flex justify-center">
                    <Rb_Button
                        variant="primary"
                        onClick={
                            handleBackToAuctions
                        }
                    >
                        Back to Auctions
                    </Rb_Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl bg-white p-8">

            {/* Success Icon */}
            <div className="flex flex-col items-center">
                <Rb_Icon
                    icon={CheckCircle2}
                    size={80}
                    color="#16A34A"
                />

                <Rb_Text
                    variant="h2"
                    className="mt-6 text-center font-bold text-[#1B1530]"
                >
                    Bid Placed Successfully!
                </Rb_Text>

                <Rb_Text
                    variant="p"
                    className="mt-3 text-center text-gray-600"
                >
                    Your bid of{" "}
                    <span className="font-semibold text-[#1B1530]">
                        ₹
                        {bidData.bidPrice.toFixed(
                            2
                        )}
                    </span>{" "}
                    has been placed
                    successfully.
                </Rb_Text>
            </div>

            {/* Summary Card */}
            <div className="mt-10 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">

                    {/* Highest Bid */}
                    <div className="p-6">
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            Current Highest Bid
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="mt-2 !text-2xl !font-semibold text-[#2454FF]"
                        >
                            ₹
                            {bidData.currentHighestBid.toFixed(
                                2
                            )}
                        </Rb_Text>

                        <Rb_Text
                            variant="p"
                            className="mt-2 text-sm text-gray-500"
                        >
                            Your bid is
                            currently the
                            highest
                        </Rb_Text>
                    </div>

                    {/* Your Bid */}
                    <div className="p-6">
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            Your Bid
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="mt-2 !text-2xl !font-semibold text-[#1B1530]"
                        >
                            ₹
                            {bidData.bidPrice.toFixed(
                                2
                            )}
                        </Rb_Text>

                        <Rb_Text
                            variant="p"
                            className="mt-2 text-sm text-gray-500"
                        >
                            {bidData.bookTitle}
                        </Rb_Text>
                    </div>

                    {/* Countdown */}
                    <div className="p-6">
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            Auction Ends
                            In
                        </Rb_Text>

                        <Rb_Text
                            variant="h3"
                            className="mt-3 !text-2xl !font-semibold text-[#2454FF]"
                        >
                            {
                                bidData.auctionEndsIn
                            }
                        </Rb_Text>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex">
                <Rb_Button
                    variant="secondary"
                    className="mr-2 w-full"
                    onClick={
                        handleViewAuction
                    }
                >
                    View Auction
                </Rb_Button>

                <Rb_Button
                    variant="primary"
                    className="ml-2 w-full"
                    onClick={
                        handleBackToAuctions
                    }
                >
                    Back to Auctions
                </Rb_Button>
            </div>
        </div>
    );
};

export default BidSuccessCard;