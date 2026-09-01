import { useState } from "react";
import { Info, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
    Rb_Button,
    Rb_Input,
    Rb_Text,
    Rb_Icon,
} from "@rentbook/rentbook-ui-lib";

import ConfirmBidModal from "./ConfirmBidModal";
import { useAuctionBidDetails } from "../hooks/useAuctionBookDetails";

const quickBids = [350, 400, 450, 500];

interface AuctionBidCardProps {
    auctionId: string;
    bookId: string;
    bookTitle: string;
    currentHighestBid?: number;
    auctionEndsIn?: string;
}

const AuctionBidCard = ({
    auctionId,
    bookId,
    bookTitle,
    currentHighestBid = 0,
    auctionEndsIn = "2d 14h 20m 45s",
}: AuctionBidCardProps) => {
    const queryClient = useQueryClient();
const userId =
    window.HOST_USER_INFO?._id ?? "";
    const [bidAmount, setBidAmount] = useState("");

    const [isConfirmOpen, setIsConfirmOpen] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const API_URL =
        import.meta.env.VITE_API_URL;

    /*
     * =========================================================
     * GET AUCTION BID DETAILS
     *
     * GET
     * /api/auction/{bookId}/auction/bid/{userId}
     *
     * This API is called automatically when the component loads.
     * =========================================================
     */

    const {
        data: bidDetails,
        isLoading: isBidLoading,
        error: bidDetailsError,
    } = useAuctionBidDetails(
        bookId,
        userId
    );

    /*
     * =========================================================
     * BACKEND VALUES
     * =========================================================
     */

    const currentBid =
        Number(
            bidDetails?.currentBid ??
                currentHighestBid
        );

    const userBid =
        bidDetails?.userBid ?? null;

    const isHighestBidder =
        Boolean(
            bidDetails?.isHighestBidder
        );

    const auctionStatus =
        bidDetails?.auction?.status?.toLowerCase() ||
        "";

    /*
     * userBid === null
     *      => Place Bid
     *
     * userBid !== null
     *      => Update Bid
     */

    const hasUserBid =
        userBid !== null;

    /*
     * =========================================================
     * KEEP EXISTING USER BID IN INPUT
     *
     * We don't use useEffect here because the input is only
     * initialized from the API when the component loads.
     * =========================================================
     */

    if (
        hasUserBid &&
        !bidAmount &&
        userBid?.bidPrice
    ) {
        setBidAmount(
            userBid.bidPrice.toString()
        );
    }

    /*
     * =========================================================
     * VALIDATE BID
     * =========================================================
     */

    const handlePlaceBid = () => {
        const amount = Number(bidAmount);

        if (
            !bidAmount ||
            Number.isNaN(amount)
        ) {
            alert(
                "Please enter a valid bid amount."
            );
            return;
        }

        /*
         * New bid must be higher than current highest bid.
         */
        if (amount <= currentBid) {
            alert(
                `Your bid must be higher than the current highest bid of ₹${currentBid}.`
            );
            return;
        }

        if (!auctionId) {
            alert(
                "Auction ID is missing."
            );
            return;
        }

        if (!bookId) {
            alert(
                "Book ID is missing."
            );
            return;
        }

        if (!userId) {
            alert(
                "User ID is missing."
            );
            return;
        }

        /*
         * Only live auctions can receive bids.
         */
        if (auctionStatus !== "live") {
            alert(
                "This auction is no longer accepting bids."
            );
            return;
        }

        setIsConfirmOpen(true);
    };

    /*
     * =========================================================
     * CONFIRM PLACE / UPDATE BID
     * =========================================================
     */

    const handleConfirmBid = async () => {
        const amount = Number(bidAmount);

        if (
            !amount ||
            Number.isNaN(amount)
        ) {
            return;
        }

        if (amount <= currentBid) {
            alert(
                `Your bid must be higher than the current highest bid of ₹${currentBid}.`
            );
            return;
        }

        if (!auctionId) {
            alert(
                "Auction ID is missing."
            );
            return;
        }

        if (!bookId) {
            alert(
                "Book ID is missing."
            );
            return;
        }

        if (!userId) {
            alert(
                "User ID is missing."
            );
            return;
        }

        try {
            setIsSubmitting(true);

            const bidPayload = {
                auctionId,
                bookId,
                userId,
                bidPrice: amount,
            };

            console.log(
                "Placing / updating bid:",
                bidPayload
            );

            const response = await fetch(
                `${API_URL}/api/auction/place-a-bid`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(
                        bidPayload
                    ),
                }
            );

            const contentType =
                response.headers.get(
                    "content-type"
                ) || "";

            const responseText =
                await response.text();

            let data: any = null;

            if (
                contentType.includes(
                    "application/json"
                )
            ) {
                try {
                    data =
                        JSON.parse(
                            responseText
                        );
                } catch (error) {
                    console.error(
                        "Failed to parse bid response:",
                        error
                    );
                }
            }

            console.log(
                "Bid API status:",
                response.status
            );

            console.log(
                "Bid API response:",
                data || responseText
            );

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        data?.error ||
                        `Failed to place bid. Server returned ${response.status}.`
                );
            }

            /*
             * Close modal.
             */
            setIsConfirmOpen(false);

            /*
             * Clear input.
             */
            setBidAmount("");

            /*
             * IMPORTANT
             *
             * Refresh:
             *
             * currentBid
             * userBid
             * isHighestBidder
             * auction.status
             *
             * We don't manually set these values because another
             * user may have placed a higher bid.
             */

            await queryClient.invalidateQueries({
                queryKey: [
                    "auction-bid-details",
                    bookId,
                    userId,
                ],
            });

            /*
             * Existing success-page flow.
             */

            const successData = {
                auctionId,
                bookId,
                userId,
                bidPrice: amount,
                bookTitle,
                currentHighestBid:
                    amount,
                auctionEndsIn,
            };

            sessionStorage.setItem(
                "successfulBid",
                JSON.stringify(
                    successData
                )
            );

            window.history.pushState(
                {},
                "",
                "/bid-success"
            );

            window.dispatchEvent(
                new PopStateEvent(
                    "popstate"
                )
            );
        } catch (error) {
            console.error(
                "Place / update bid error:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong while placing your bid.";

            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (isBidLoading) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <Rb_Text
                    variant="p"
                    className="text-center text-sm text-gray-500"
                >
                    Loading auction details...
                </Rb_Text>
            </div>
        );
    }

    /*
     * =========================================================
     * ERROR
     * =========================================================
     */

    if (bidDetailsError) {
        return (
            <div className="w-full rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                <Rb_Text
                    variant="p"
                    className="text-center text-sm text-red-500"
                >
                    {bidDetailsError.message}
                </Rb_Text>
            </div>
        );
    }

    /*
     * =========================================================
     * COMPLETED + WINNER
     * =========================================================
     */

    if (
        auctionStatus === "completed" &&
        isHighestBidder
    ) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-center">
                    <Rb_Text
                        variant="h4"
                        className="font-semibold text-green-600"
                    >
                        🎉 Congratulations!
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-2 text-gray-600"
                    >
                        You are the highest bidder
                        for this auction.
                    </Rb_Text>

                    <Rb_Text
                        variant="h2"
                        className="mt-4 !text-[24px] !font-semibold text-[#2454FF]"
                    >
                        ₹
                        {currentBid.toFixed(
                            2
                        )}
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-1 text-sm text-gray-500"
                    >
                        Winning Bid
                    </Rb_Text>

                    <Rb_Button
                        className="mt-6 w-full"
                        variant="primary"
                        size="lg"
                        onClick={() => {
                            console.log(
                                "Place order for auction:",
                                auctionId
                            );

                            /*
                             * Add your Place Order API here.
                             */
                        }}
                    >
                        Place Order
                    </Rb_Button>
                </div>
            </div>
        );
    }

    /*
     * =========================================================
     * COMPLETED + NOT WINNER
     * =========================================================
     */

    if (
        auctionStatus === "completed"
    ) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-center">
                    <Rb_Text
                        variant="h4"
                        className="font-semibold text-[#1B1530]"
                    >
                        Auction Completed
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-2 text-gray-600"
                    >
                        This auction has ended.
                    </Rb_Text>

                    <Rb_Text
                        variant="h2"
                        className="mt-4 !text-[24px] !font-semibold text-[#2454FF]"
                    >
                        ₹
                        {currentBid.toFixed(
                            2
                        )}
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-1 text-sm text-gray-500"
                    >
                        Final Bid
                    </Rb_Text>

                    {userBid &&
                        !isHighestBidder && (
                            <Rb_Text
                                variant="p"
                                className="mt-4 text-sm text-red-500"
                            >
                                Your bid was not
                                the highest bid.
                            </Rb_Text>
                        )}
                </div>
            </div>
        );
    }

    /*
     * =========================================================
     * CANCELLED
     * =========================================================
     */

    if (
        auctionStatus === "cancelled"
    ) {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-center">
                    <Rb_Text
                        variant="h4"
                        className="font-semibold text-red-600"
                    >
                        Auction Cancelled
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-2 text-gray-600"
                    >
                        This auction is no
                        longer available.
                    </Rb_Text>
                </div>
            </div>
        );
    }

    /*
     * =========================================================
     * LIVE AUCTION
     * =========================================================
     */

    return (
        <>
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                {/* Top */}
                <div className="flex justify-between">
                    <div>
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            Current Highest Bid
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="mt-0 !text-[20px] !font-semibold text-[#2454FF]"
                        >
                            ₹
                            {currentBid.toFixed(
                                2
                            )}
                        </Rb_Text>
                    </div>

                    <div className="text-right">
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            Your Bid Value
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="mt-0 !text-[20px] !font-semibold text-[#1B1530]"
                        >
                            {userBid
                                ? `₹${Number(
                                      userBid.bidPrice
                                  ).toFixed(2)}`
                                : "₹0.00"}
                        </Rb_Text>
                    </div>
                </div>

                <hr className="my-6" />

                {/* Highest Bidder */}
                {isHighestBidder && (
                    <div className="mb-5 rounded-lg bg-green-50 p-4 text-center">
                        <Rb_Text
                            variant="p"
                            className="font-semibold text-green-600"
                        >
                            🎉 Congratulations!
                            You are the highest
                            bidder.
                        </Rb_Text>

                        <Rb_Text
                            variant="p"
                            className="mt-1 text-sm text-gray-600"
                        >
                            Your current bid is ₹
                            {Number(
                                userBid?.bidPrice ??
                                    currentBid
                            ).toFixed(2)}
                        </Rb_Text>
                    </div>
                )}

                {/* Heading */}
                <Rb_Text
                    variant="h5"
                    className="mb-2 font-semibold text-[#1B1530]"
                >
                    {hasUserBid
                        ? "Update Your Bid"
                        : "Place Your Bid"}
                </Rb_Text>

                {/* Input */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 font-semibold text-gray-600">
                        ₹
                    </span>

                    <Rb_Input
                        type="number"
                        placeholder="Enter your maximum bid"
                        value={bidAmount}
                        onChange={(e) =>
                            setBidAmount(
                                e.target.value
                            )
                        }
                        className="h-12 rounded-lg pl-10 pr-4 !m-0"
                    />
                </div>

                {/* Quick Bids */}
                <div className="mt-4 grid grid-cols-4 gap-3">
                    {quickBids.map(
                        (amount) => (
                            <Rb_Button
                                key={amount}
                                variant="outline"
                                className="h-11"
                                onClick={() =>
                                    setBidAmount(
                                        amount.toString()
                                    )
                                }
                            >
                                ₹{amount}
                            </Rb_Button>
                        )
                    )}
                </div>

                {/* Helper */}
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                    <Rb_Icon
                        icon={Lock}
                        size={18}
                        color="#2454FF"
                    />

                    <Rb_Text
                        variant="p"
                        className="text-sm text-gray-600"
                    >
                        Enter a higher amount than
                        the current highest bid
                        <span className="font-medium">
                            {" "}
                            (₹
                            {currentBid.toFixed(
                                2
                            )}
                            )
                        </span>
                    </Rb_Text>
                </div>

                {/* Place / Update */}
                <Rb_Button
                    className="mt-6 w-full"
                    variant="primary"
                    size="lg"
                    onClick={
                        handlePlaceBid
                    }
                    disabled={
                        !bidAmount ||
                        isSubmitting ||
                        auctionStatus !==
                            "live"
                    }
                >
                    {hasUserBid
                        ? "Update Bid"
                        : "Place Bid"}
                </Rb_Button>

                {/* Bottom Info */}
                <div className="mt-5 flex items-start gap-2">
                    <Rb_Icon
                        icon={Info}
                        size={16}
                        color="#9CA3AF"
                        className="mt-1"
                    />

                    <Rb_Text
                        variant="p"
                        className="text-sm leading-6 text-gray-500"
                    >
                        If another bidder places
                        a higher maximum bid, you
                        will be outbid.
                    </Rb_Text>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmBidModal
                isOpen={isConfirmOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsConfirmOpen(
                            false
                        );
                    }
                }}
                onConfirm={
                    handleConfirmBid
                }
                bidAmount={Number(
                    bidAmount
                )}
                bookTitle={bookTitle}
                currentHighestBid={
                    currentBid
                }
                auctionEndsIn={
                    auctionEndsIn
                }
                isSubmitting={
                    isSubmitting
                }
            />
        </>
    );
};

export default AuctionBidCard;