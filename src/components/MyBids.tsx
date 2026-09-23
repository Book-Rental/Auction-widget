import { useState } from "react";
import { Info, Bell, Loader2, Inbox } from "lucide-react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

import { useMyBids, MyBid } from "../hooks/useMyBids";

const tabs = ["Active Bids", "Won", "Lost", "Cancelled"] as const;
type Tab = (typeof tabs)[number];

type BidStatus = "active" | "won" | "lost" | "cancelled";

const getInitialTab = (): Tab => {
    const params = new URLSearchParams(window.location.search);

    const tab = params.get("tab");

    if (tab === "won") {
        return "Won";
    }

    if (tab === "lost") {
        return "Lost";
    }

    if (tab === "cancelled") {
        return "Cancelled";
    }

    return "Active Bids";
};

// Semantic pill styling per status, kept consistent with the OrderHistory
// status-pill conventions (semantic colors + hover state).
const STATUS_PILL: Record<
    BidStatus,
    { label: string; className: string }
> = {
    active: {
        label: "Active",
        className:
            "bg-blue-50 text-[#2454FF] ring-1 ring-blue-100 hover:bg-blue-100",
    },
    won: {
        label: "Won",
        className:
            "bg-green-50 text-green-700 ring-1 ring-green-100 hover:bg-green-100",
    },
    lost: {
        label: "Lost",
        className:
            "bg-gray-100 text-gray-500 ring-1 ring-gray-200 hover:bg-gray-200",
    },
    cancelled: {
        label: "Cancelled",
        className:
            "bg-red-50 text-red-600 ring-1 ring-red-100 hover:bg-red-100",
    },
};

const StatusPill = ({ status }: { status: BidStatus }) => {
    const cfg = STATUS_PILL[status];

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize transition-colors ${cfg.className}`}
        >
            {cfg.label}
        </span>
    );
};

// Tab-specific empty state copy so "No bids found" doesn't read the same
// for every tab.
const EMPTY_STATE_COPY: Record<Tab, { title: string; subtitle: string }> = {
    "Active Bids": {
        title: "No active bids",
        subtitle: "Bids you place on live auctions will show up here.",
    },
    Won: {
        title: "No auctions won yet",
        subtitle: "Books you've won will appear here once an auction ends.",
    },
    Lost: {
        title: "No lost bids",
        subtitle: "Auctions you didn't win will be listed here.",
    },
    Cancelled: {
        title: "No cancelled bids",
        subtitle: "Bids on auctions that got cancelled will show up here.",
    },
};

const navigateToCheckout = (bookId?: string, auctionId?: string) => {
    console.log("Pay Now bookId:", bookId);

    window.history.pushState(
        {
            orderType: "auction",
            bookId,
            userId: window.HOST_USER_INFO?._id ?? "",
            auctionId,
        },
        "",
        "/checkout"
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
};

const navigateToOrder = (orderId?: string, bookId?: string) => {
    if (!orderId || !bookId) {
        return;
    }

    window.history.pushState(
        {},
        "",
        `/order-details?orderId=${orderId}&bookId=${bookId}`
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
};

const MyBids = () => {
    const [activeTab, setActiveTab] = useState<Tab>(getInitialTab);

    /*
     * Get logged-in user ID from host application.
     */
    const userId = window.HOST_USER_INFO?._id ?? "";

    /*
     * Convert UI tab to API status.
     *
     * Active Bids -> live
     * Won         -> won
     * Lost        -> lost
     * Cancelled   -> cancelled
     */
    const apiStatus: "live" | "won" | "lost" | "cancelled" =
        activeTab === "Active Bids"
            ? "live"
            : activeTab === "Won"
                ? "won"
                : activeTab === "Lost"
                    ? "lost"
                    : "cancelled";

    /*
     * Row status is derived directly from the tab/API status,
     * since the endpoint already filters bids per tab.
     */
    const status: BidStatus =
        apiStatus === "live" ? "active" : apiStatus;

    /*
     * Fetch only the bids required for the currently selected tab.
     */
    const {
        data: bids = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useMyBids(userId, apiStatus);

    /*
     * Format currency.
     */
    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) {
            return "₹0.00";
        }

        return `₹${Number(price).toFixed(2)}`;
    };

    /*
     * Calculate auction end date.
     */
    const getAuctionEndDate = (startDate: string, duration: number) => {
        const start = new Date(startDate);

        start.setDate(start.getDate() + Number(duration || 0));

        return start;
    };

    /*
     * Format remaining auction time.
     */
    const formatTimeRemaining = (startDate: string, duration: number) => {
        const endDate = getAuctionEndDate(startDate, duration);

        const difference = endDate.getTime() - new Date().getTime();

        if (difference <= 0) {
            return "Ended";
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

        if (days > 0) {
            return `${days}d ${hours}h`;
        }

        return `${hours}h`;
    };

    /*
     * Format normal date.
     */
    const formatDate = (date?: string) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    /*
     * Navigate to Bid Details page.
     */
    const handleViewBid = (auctionId?: string) => {
        if (!auctionId) {
            return;
        }

        window.history.pushState({}, "", `/bid-details/${auctionId}`);

        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    /*
     * Change tab and update URL.
     *
     * Changing activeTab also changes apiStatus, which changes the
     * React Query key and triggers the correct API call.
     */
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);

        const queryTab = tab === "Active Bids" ? "active" : tab.toLowerCase();

        window.history.pushState({}, "", `/my-bids?tab=${queryTab}`);

        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    /*
     * The API already filters the bids by status,
     * so no frontend filtering is required.
     */
    const currentBids: MyBid[] = bids;

    const emptyCopy = EMPTY_STATE_COPY[activeTab];

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
            <div className="w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-[#1B1530]">
                        My Bids
                    </h2>

                    {!isLoading && !isError && userId && (
                        <span className="hidden text-sm text-gray-400 sm:inline">
                            {currentBids.length}{" "}
                            {currentBids.length === 1 ? "bid" : "bids"}
                        </span>
                    )}
                </div>

                {/* Tabs */}
                <div className="mt-6 flex gap-6 overflow-x-auto border-b border-gray-200 sm:gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`shrink-0 border-b-2 px-2 pb-3 text-sm font-medium transition ${
                                activeTab === tab
                                    ? tab === "Cancelled"
                                        ? "border-red-500 text-red-600"
                                        : "border-[#2454FF] text-[#2454FF]"
                                    : "border-transparent text-gray-500 hover:text-[#2454FF]"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2
                            size={28}
                            className="animate-spin text-[#2454FF]"
                        />

                        <p className="mt-3 text-sm text-gray-500">
                            Loading your bids...
                        </p>
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <p className="text-sm text-red-500">
                            {error instanceof Error
                                ? error.message
                                : "Failed to load your bids."}
                        </p>

                        <Rb_Button
                            variant="secondary"
                            className="mt-4 !border-[#4F7CF3] !text-[#2454FF]"
                            onClick={() => refetch()}
                        >
                            Try Again
                        </Rb_Button>
                    </div>
                )}

                {/* User ID missing */}
                {!userId && !isLoading && (
                    <div className="py-12 text-center text-gray-500">
                        User ID not found.
                    </div>
                )}

                {/* Bids */}
                {!isLoading &&
                    !isError &&
                    userId &&
                    currentBids.length > 0 && (
                        <div>
                            {/* Desktop rows */}
                            <div className="hidden md:block">
                                {currentBids.map((item) => {
                                    const currentBid =
                                        item.auction?.currentBidPrice ??
                                        item.bid?.bidPrice ??
                                        item.auction?.bidPrice ??
                                        0;

                                    const yourBid = item.bid?.bidPrice ?? 0;

                                    const auctionEndDate = getAuctionEndDate(
                                        item.auction?.startDate ?? "",
                                        item.auction?.duration ?? 0
                                    );

                                    return (
                                        <div
                                            key={
                                                item.bid?.bidId ||
                                                item.auction?._id
                                            }
                                            className={`grid grid-cols-12 items-center gap-2 border-b border-gray-200 py-5 last:border-none ${
                                                status === "cancelled"
                                                    ? "opacity-80"
                                                    : ""
                                            }`}
                                        >
                                            {/* Book */}
                                            <div className="col-span-5 flex items-center gap-4">
                                                <img
                                                    src={
                                                        item.book?.coverImage
                                                    }
                                                    alt={
                                                        item.book?.name ||
                                                        "Book"
                                                    }
                                                    className={`h-20 w-14 rounded border object-cover ${
                                                        status ===
                                                        "cancelled"
                                                            ? "grayscale-[30%]"
                                                            : ""
                                                    }`}
                                                />

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-[#1B1530]">
                                                            {item.book?.name}
                                                        </h3>

                                                        <StatusPill
                                                            status={status}
                                                        />
                                                    </div>

                                                    {item.book?.author && (
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            by{" "}
                                                            {item.book.author}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bid */}
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500">
                                                    {status === "won"
                                                        ? "Winning Bid"
                                                        : status === "lost"
                                                            ? "Highest Bid"
                                                            : status ===
                                                                "cancelled"
                                                                ? "Last Bid"
                                                                : "Current Bid"}
                                                </p>

                                                <p
                                                    className={`mt-1 font-semibold ${
                                                        status ===
                                                        "cancelled"
                                                            ? "text-gray-400 line-through decoration-2"
                                                            : "text-[#1B1530]"
                                                    }`}
                                                >
                                                    {formatPrice(currentBid)}
                                                </p>

                                                {/* Your bid */}
                                                {(status === "active" ||
                                                    status === "lost" ||
                                                    status ===
                                                        "cancelled") && (
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Your bid:{" "}
                                                        {formatPrice(
                                                            yourBid
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Date / Time */}
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-500">
                                                    {status === "won"
                                                        ? "Won on"
                                                        : status === "lost"
                                                            ? "Ended on"
                                                            : status ===
                                                                "cancelled"
                                                                ? "Cancelled on"
                                                                : "Ends in"}
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-[#1B1530]">
                                                    {status === "active"
                                                        ? formatTimeRemaining(
                                                            item.auction
                                                                ?.startDate ??
                                                                "",
                                                            item.auction
                                                                ?.duration ??
                                                                0
                                                        )
                                                        : formatDate(
                                                            auctionEndDate.toISOString()
                                                        )}
                                                </p>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-3 flex items-center justify-end gap-4">
                                                {status === "won" ? (
                                                    item.order ? (
                                                        <>
                                                            {item.order
                                                                .items?.[0]
                                                                ?.itemStatus && (
                                                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">
                                                                    {
                                                                        item
                                                                            .order
                                                                            .items[0]
                                                                            .itemStatus
                                                                    }
                                                                </span>
                                                            )}

                                                            <Rb_Button
                                                                variant="secondary"
                                                                className="!border-green-300 !bg-green-50 !text-green-700"
                                                                onClick={() =>
                                                                    navigateToOrder(
                                                                        item
                                                                            .order
                                                                            ?._id,
                                                                        item
                                                                            .book
                                                                            ?._id
                                                                    )
                                                                }
                                                            >
                                                                View Order
                                                            </Rb_Button>
                                                        </>
                                                    ) : (
                                                        <Rb_Button
                                                            variant="secondary"
                                                            className="!border-green-300 !bg-green-50 !text-green-700"
                                                            onClick={() =>
                                                                navigateToCheckout(
                                                                    item.book
                                                                        ?._id,
                                                                    item
                                                                        .auction
                                                                        ?._id
                                                                )
                                                            }
                                                        >
                                                            Pay Now
                                                        </Rb_Button>
                                                    )
                                                ) : status === "lost" ? (
                                                    <Rb_Button
                                                        variant="secondary"
                                                        className="!border-gray-300 !text-gray-500"
                                                        onClick={() =>
                                                            handleViewBid(
                                                                item.auction
                                                                    ?._id
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Rb_Button>
                                                ) : status === "cancelled" ? (
                                                    <Rb_Button
                                                        variant="secondary"
                                                        className="!border-red-200 !text-red-500"
                                                        onClick={() =>
                                                            handleViewBid(
                                                                item.auction
                                                                    ?._id
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Rb_Button>
                                                ) : (
                                                    <Rb_Button
                                                        variant="secondary"
                                                        className="!border-[#4F7CF3] !text-[#2454FF]"
                                                        onClick={() =>
                                                            handleViewBid(
                                                                item.auction
                                                                    ?._id
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Rb_Button>
                                                )}

                                                {status === "active" && (
                                                    <Bell
                                                        size={18}
                                                        className="cursor-pointer text-gray-500"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile cards */}
                            <div className="space-y-3 py-4 md:hidden">
                                {currentBids.map((item) => {
                                    const currentBid =
                                        item.auction?.currentBidPrice ??
                                        item.bid?.bidPrice ??
                                        item.auction?.bidPrice ??
                                        0;

                                    const yourBid = item.bid?.bidPrice ?? 0;

                                    const auctionEndDate = getAuctionEndDate(
                                        item.auction?.startDate ?? "",
                                        item.auction?.duration ?? 0
                                    );

                                    return (
                                        <div
                                            key={
                                                (item.bid?.bidId ||
                                                    item.auction?._id) +
                                                "-m"
                                            }
                                            className={`rounded-xl border border-gray-200 p-4 ${
                                                status === "cancelled"
                                                    ? "opacity-80"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex gap-3">
                                                <img
                                                    src={
                                                        item.book?.coverImage
                                                    }
                                                    alt={
                                                        item.book?.name ||
                                                        "Book"
                                                    }
                                                    className={`h-20 w-14 shrink-0 rounded border object-cover ${
                                                        status ===
                                                        "cancelled"
                                                            ? "grayscale-[30%]"
                                                            : ""
                                                    }`}
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="truncate font-semibold text-[#1B1530]">
                                                            {item.book?.name}
                                                        </h3>

                                                        <StatusPill
                                                            status={status}
                                                        />
                                                    </div>

                                                    {item.book?.author && (
                                                        <p className="mt-0.5 text-sm text-gray-500">
                                                            by{" "}
                                                            {item.book.author}
                                                        </p>
                                                    )}

                                                    <div className="mt-3 flex items-center justify-between gap-2 text-sm">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                {status ===
                                                                "won"
                                                                    ? "Winning Bid"
                                                                    : status ===
                                                                        "lost"
                                                                        ? "Highest Bid"
                                                                        : status ===
                                                                            "cancelled"
                                                                            ? "Last Bid"
                                                                            : "Current Bid"}
                                                            </p>

                                                            <p
                                                                className={`font-semibold ${
                                                                    status ===
                                                                    "cancelled"
                                                                        ? "text-gray-400 line-through decoration-2"
                                                                        : "text-[#1B1530]"
                                                                }`}
                                                            >
                                                                {formatPrice(
                                                                    currentBid
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-500">
                                                                {status ===
                                                                "won"
                                                                    ? "Won on"
                                                                    : status ===
                                                                        "lost"
                                                                        ? "Ended on"
                                                                        : status ===
                                                                            "cancelled"
                                                                            ? "Cancelled on"
                                                                            : "Ends in"}
                                                            </p>

                                                            <p className="font-medium text-[#1B1530]">
                                                                {status ===
                                                                "active"
                                                                    ? formatTimeRemaining(
                                                                        item
                                                                            .auction
                                                                            ?.startDate ??
                                                                            "",
                                                                        item
                                                                            .auction
                                                                            ?.duration ??
                                                                            0
                                                                    )
                                                                    : formatDate(
                                                                        auctionEndDate.toISOString()
                                                                    )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {(status === "active" ||
                                                        status === "lost" ||
                                                        status ===
                                                            "cancelled") && (
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Your bid:{" "}
                                                            {formatPrice(
                                                                yourBid
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                                {status === "active" && (
                                                    <button
                                                        type="button"
                                                        aria-label="Notify me"
                                                        className="flex items-center gap-1 text-xs text-gray-500"
                                                    >
                                                        <Bell size={16} />
                                                        Notify me
                                                    </button>
                                                )}

                                                <div className="ml-auto flex items-center gap-2">
                                                    {status === "won" ? (
                                                        item.order ? (
                                                            <Rb_Button
                                                                variant="secondary"
                                                                className="!border-green-300 !bg-green-50 !text-green-700"
                                                                onClick={() =>
                                                                    navigateToOrder(
                                                                        item
                                                                            .order
                                                                            ?._id,
                                                                        item
                                                                            .book
                                                                            ?._id
                                                                    )
                                                                }
                                                            >
                                                                View Order
                                                            </Rb_Button>
                                                        ) : (
                                                            <Rb_Button
                                                                variant="secondary"
                                                                className="!border-green-300 !bg-green-50 !text-green-700"
                                                                onClick={() =>
                                                                    navigateToCheckout(
                                                                        item
                                                                            .book
                                                                            ?._id,
                                                                        item
                                                                            .auction
                                                                            ?._id
                                                                    )
                                                                }
                                                            >
                                                                Pay Now
                                                            </Rb_Button>
                                                        )
                                                    ) : (
                                                        <Rb_Button
                                                            variant="secondary"
                                                            className={
                                                                status ===
                                                                "cancelled"
                                                                    ? "!border-red-200 !text-red-500"
                                                                    : status ===
                                                                        "lost"
                                                                        ? "!border-gray-300 !text-gray-500"
                                                                        : "!border-[#4F7CF3] !text-[#2454FF]"
                                                            }
                                                            onClick={() =>
                                                                handleViewBid(
                                                                    item
                                                                        .auction
                                                                        ?._id
                                                                )
                                                            }
                                                        >
                                                            View
                                                        </Rb_Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                {/* No bids */}
                {!isLoading &&
                    !isError &&
                    userId &&
                    currentBids.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <Inbox size={22} />
                            </div>

                            <h3 className="font-semibold text-[#1B1530]">
                                {emptyCopy.title}
                            </h3>

                            <p className="mt-1 max-w-xs text-sm text-gray-500">
                                {emptyCopy.subtitle}
                            </p>
                        </div>
                    )}

                {/* Footer Info */}
                <div className="mt-5 flex items-center gap-2 border-t border-gray-200 pt-5">
                    <Info size={16} className="text-[#2454FF]" />

                    <p className="text-sm text-gray-500">
                        You will be notified if you are outbid on any
                        auction.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MyBids;