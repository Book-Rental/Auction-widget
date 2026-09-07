import { useEffect, useState } from "react";
import {
    Info,
    Lock,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
    Rb_Button,
    Rb_Input,
    Rb_Text,
    Rb_Icon,
} from "@rentbook/rentbook-ui-lib";

import ConfirmBidModal from "./ConfirmBidModal";
import { useAuctionBidDetails } from "../hooks/useAuctionBookDetails";

const quickBidIncrements = [50, 100, 150, 200];

interface AuctionBidCardProps {
    auctionId: string;
    bookId: string;
    bookTitle: string;
    currentHighestBid?: number;
}

const AuctionBidCard = ({
    auctionId,
    bookId,
    bookTitle,
    currentHighestBid = 0,
}: AuctionBidCardProps) => {
    const queryClient = useQueryClient();

    const userId = window.HOST_USER_INFO?._id ?? "";
    const API_URL = import.meta.env.VITE_API_URL;

    const [bidAmount, setBidAmount] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const {
        data: bidDetails,
        isLoading: isBidLoading,
        error: bidDetailsError,
    } = useAuctionBidDetails(bookId, userId);

    const auction = bidDetails?.auction;
    const auctionStatus = auction?.status?.toLowerCase() ?? "";

    const currentBid = Number(
        bidDetails?.currentBid ?? currentHighestBid
    );

    const userBid = bidDetails?.userBid ?? null;
    const bidId = userBid?._id;

    const hasUserBid = Boolean(userBid);

    const isHighestBidder = Boolean(
        bidDetails?.isHighestBidder
    );

    useEffect(() => {
        if (userBid?.bidPrice && !bidAmount) {
            setBidAmount(userBid.bidPrice.toString());
        }
    }, [userBid?.bidPrice, bidAmount]);

    // Clear inline error when user edits bid
    useEffect(() => {
        if (formError) {
            setFormError(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bidAmount]);

    /**
     * Shared validation for both the initial
     * "Place Bid" click and confirmation submit.
     */
    const validateBid = (
        amount: number
    ): string | null => {
        if (!bidAmount || Number.isNaN(amount)) {
            return "Please enter a valid bid amount.";
        }

        if (amount <= currentBid) {
            return `Your bid must be higher than the current highest bid of ₹${currentBid}.`;
        }

        if (!auctionId) {
            return "Auction ID is missing.";
        }

        if (!bookId) {
            return "Book ID is missing.";
        }

        if (!userId) {
            return "User ID is missing.";
        }

        if (auctionStatus !== "live") {
            return "This auction is no longer accepting bids.";
        }

        return null;
    };

    const handlePlaceBid = () => {
        const amount = Number(bidAmount);
        const error = validateBid(amount);

        if (error) {
            setFormError(error);
            return;
        }

        setFormError(null);
        setIsConfirmOpen(true);
    };

    const handleConfirmBid = async () => {
        const amount = Number(bidAmount);
        const error = validateBid(amount);

        if (error) {
            setFormError(error);
            setIsConfirmOpen(false);
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError(null);

            let response: Response;

            if (hasUserBid && bidId) {
                response = await fetch(
                    `${API_URL}/api/auction/auction-bids/${bidId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            auctionId,
                            userId,
                            bidPrice: amount,
                        }),
                    }
                );
            } else {
                response = await fetch(
                    `${API_URL}/api/auction/place-a-bid`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            auctionId,
                            bookId,
                            userId,
                            bidPrice: amount,
                        }),
                    }
                );
            }

            const contentType =
                response.headers.get("content-type") || "";

            const responseText = await response.text();

            let data: any = null;

            if (
                contentType.includes(
                    "application/json"
                )
            ) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = null;
                }
            }

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        data?.error ||
                        `Failed to ${
                            hasUserBid
                                ? "update"
                                : "place"
                        } bid.`
                );
            }

            setIsConfirmOpen(false);

            await queryClient.invalidateQueries({
                queryKey: [
                    "auction-bid-details",
                    bookId,
                    userId,
                ],
            });

            sessionStorage.setItem(
                "successfulBid",
                JSON.stringify({
                    auctionId,
                    bookId,
                    userId,
                    bidId:
                        bidId ||
                        data?.data?._id ||
                        null,
                    bidPrice: amount,
                    bookTitle,
                    currentHighestBid: amount,
                })
            );

            window.history.pushState(
                {},
                "",
                "/bid-success"
            );

            window.dispatchEvent(
                new PopStateEvent("popstate")
            );

            setBidAmount("");
        } catch (error) {
            console.error("Bid error:", error);

            setFormError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while processing your bid."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // LOADING
    if (isBidLoading) {
        return (
            <div className="w-full animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-5 h-24 rounded-xl bg-gray-100" />

                <div className="flex justify-between">
                    <div className="h-10 w-24 rounded bg-gray-100" />
                    <div className="h-10 w-24 rounded bg-gray-100" />
                </div>

                <div className="my-6 h-px bg-gray-100" />

                <div className="h-12 rounded-lg bg-gray-100" />

                <div className="mt-4 grid grid-cols-4 gap-3">
                    {quickBidIncrements.map(
                        (amount) => (
                            <div
                                key={amount}
                                className="h-11 rounded bg-gray-100"
                            />
                        )
                    )}
                </div>

                <div className="mt-6 h-12 rounded-lg bg-gray-100" />
            </div>
        );
    }

    // ERROR
    if (bidDetailsError) {
        return (
            <div className="w-full rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
                <AlertCircle
                    className="mx-auto mb-2 h-6 w-6 text-red-500"
                />

                <Rb_Text
                    variant="p"
                    className="text-sm text-red-500"
                >
                    {bidDetailsError.message}
                </Rb_Text>
            </div>
        );
    }

    // COMPLETED AUCTION
    if (auctionStatus === "completed") {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-center">
                    <CheckCircle2
                        size={40}
                        className="mx-auto text-green-600"
                    />

                    <Rb_Text
                        variant="h4"
                        className="mt-3 font-semibold text-green-600"
                    >
                        {isHighestBidder
                            ? "Congratulations!"
                            : "Auction Completed"}
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-2 text-gray-600"
                    >
                        {isHighestBidder
                            ? "You are the highest bidder for this auction."
                            : "This auction has ended."}
                    </Rb_Text>

                    <Rb_Text
                        variant="h2"
                        className="mt-4 !text-[24px] !font-semibold text-[#2454FF]"
                    >
                        ₹{currentBid.toFixed(2)}
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-1 text-sm text-gray-500"
                    >
                        Final Bid
                    </Rb_Text>

                    {isHighestBidder && (
                        <Rb_Button
                            className="mt-6 w-full"
                            variant="primary"
                            size="lg"
                            onClick={() =>
                                console.log(
                                    "Place order:",
                                    auctionId
                                )
                            }
                        >
                            Place Order
                        </Rb_Button>
                    )}

                    {userBid && !isHighestBidder && (
                        <Rb_Text
                            variant="p"
                            className="mt-4 text-sm text-red-500"
                        >
                            Your bid was not the highest bid.
                        </Rb_Text>
                    )}
                </div>
            </div>
        );
    }

    // CANCELLED AUCTION
    if (auctionStatus === "cancelled") {
        return (
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-center">
                    <XCircle
                        size={40}
                        className="mx-auto text-red-600"
                    />

                    <Rb_Text
                        variant="h4"
                        className="mt-3 font-semibold text-red-600"
                    >
                        Auction Cancelled
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-2 text-gray-600"
                    >
                        This auction is no longer available.
                    </Rb_Text>
                </div>
            </div>
        );
    }

    // MAIN BID CARD
    const isLive = auctionStatus === "live";

    return (
        <>
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                {/* BID VALUES */}
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
                            className="!text-[20px] !font-semibold text-[#2454FF]"
                        >
                            ₹{currentBid.toFixed(2)}
                        </Rb_Text>
                    </div>

                    <div className="text-right">
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            Your Bid
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="!text-[20px] !font-semibold text-[#1B1530]"
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

                {/* HIGHEST BIDDER */}
                {isHighestBidder && (
                    <div className="mb-5 rounded-lg bg-green-50 p-4 text-center">
                        <Rb_Text
                            variant="p"
                            className="font-semibold text-green-600"
                        >
                            🎉 You are the highest bidder!
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

                {/* OUTBID NOTICE */}
                {hasUserBid &&
                    !isHighestBidder &&
                    isLive && (
                        <div className="mb-5 flex items-center gap-2 rounded-lg bg-amber-50 p-3">
                            <AlertCircle
                                size={16}
                                className="text-amber-600"
                            />

                            <Rb_Text
                                variant="p"
                                className="text-sm text-amber-700"
                            >
                                You've been outbid. Increase
                                your bid to stay in the running.
                            </Rb_Text>
                        </div>
                    )}

                {/* BID HEADING */}
                <Rb_Text
                    variant="h5"
                    className="mb-2 font-semibold text-[#1B1530]"
                >
                    {hasUserBid
                        ? "Update Your Bid"
                        : "Place Your Bid"}
                </Rb_Text>

                {/* INPUT */}
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
                        aria-label="Bid amount"
                        aria-invalid={Boolean(
                            formError
                        )}
                        className={`h-12 rounded-lg pl-10 pr-4 !m-0 transition-colors ${
                            formError
                                ? "border-red-300 focus:border-red-400"
                                : ""
                        }`}
                    />
                </div>

                {/* FORM ERROR */}
                {formError && (
                    <div className="mt-2 flex items-start gap-1.5 text-sm text-red-500">
                        <AlertCircle
                            size={14}
                            className="mt-0.5 shrink-0"
                        />

                        <span>{formError}</span>
                    </div>
                )}

                {/* QUICK BIDS */}
                <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                    {quickBidIncrements.map(
                        (increment) => {
                            const amount =
                                currentBid +
                                increment;

                            const isSelected =
                                Number(bidAmount) ===
                                amount;

                            return (
                                <Rb_Button
                                    key={increment}
                                    variant={
                                        isSelected
                                            ? "primary"
                                            : "outline"
                                    }
                                    className="h-11 px-1 text-xs transition-colors sm:text-sm"
                                    onClick={() =>
                                        setBidAmount(
                                            amount.toString()
                                        )
                                    }
                                >
                                    ₹{amount}
                                </Rb_Button>
                            );
                        }
                    )}
                </div>

                {/* BID INFO */}
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
                        Enter an amount higher than the
                        current highest bid
                        <span className="font-medium">
                            {" "}
                            (₹
                            {currentBid.toFixed(2)})
                        </span>
                    </Rb_Text>
                </div>

                {/* BID BUTTON */}
                <Rb_Button
                    className="mt-6 w-full"
                    variant="primary"
                    size="lg"
                    onClick={handlePlaceBid}
                    disabled={
                        !bidAmount ||
                        isSubmitting ||
                        !isLive
                    }
                >
                    {hasUserBid
                        ? "Update Bid"
                        : "Place Bid"}
                </Rb_Button>

                {/* FOOTER INFO */}
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
                        If another bidder places a higher
                        maximum bid, you will be outbid.
                    </Rb_Text>
                </div>
            </div>

            {/* CONFIRMATION MODAL */}
            <ConfirmBidModal
                isOpen={isConfirmOpen}
                onClose={() => {
                    if (!isSubmitting) {
                        setIsConfirmOpen(false);
                    }
                }}
                onConfirm={handleConfirmBid}
                bidAmount={Number(bidAmount)}
                bookTitle={bookTitle}
                currentHighestBid={currentBid}
                isSubmitting={isSubmitting}
            />
        </>
    );
};

export default AuctionBidCard;