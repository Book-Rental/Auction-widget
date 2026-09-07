import { useState } from "react";
import { Info, Bell, Loader2 } from "lucide-react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

import { useMyBids, MyBid } from "../hooks/useMyBids";

const tabs = ["Active Bids", "Won", "Lost"];

const getInitialTab = () => {
  const params = new URLSearchParams(window.location.search);

  const tab = params.get("tab");

  if (tab === "won") {
    return "Won";
  }

  if (tab === "lost") {
    return "Lost";
  }

  return "Active Bids";
};

const MyBids = () => {
  const [activeTab, setActiveTab] = useState(getInitialTab);

  /*
   * Get logged-in user ID from the host application.
   */
  const userId = window.HOST_USER_INFO?._id ?? "";

  /*
   * Fetch user's bids using TanStack Query.
   */
  const {
    data: bids = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useMyBids(userId);

  /*
   * Determine the status of the user's bid.
   *
   * Rules:
   *
   * 1. Active/live auction
   *    -> Active Bids
   *
   * 2. Completed auction
   *    -> If user's bid is the highest bid -> Won
   *    -> If user's bid is NOT the highest bid -> Lost
   *
   * 3. Explicit won status
   *    -> Won
   *
   * 4. Explicit lost/closed status
   *    -> Lost
   */
  const getBookStatus = (item: MyBid) => {
    const auctionStatus =
      item.auction?.status?.toLowerCase();

    /*
     * Your bid amount.
     */
    const yourBid = Number(
      item.bid?.bidPrice ?? 0
    );

    /*
     * Highest bid in the auction.
     *
     * currentBidPrice should contain the latest/highest
     * bid amount from the auction.
     *
     * bidPrice is used as fallback for the starting bid.
     */
    const highestBid = Number(
      item.auction?.currentBidPrice ??
        item.auction?.bidPrice ??
        0
    );

    /*
     * Once auction is completed, determine whether
     * the logged-in user actually won by comparing
     * their bid against the highest bid.
     */
    if (auctionStatus === "completed") {
      if (yourBid >= highestBid) {
        return "won";
      }

      return "lost";
    }

    /*
     * If backend explicitly sends won.
     */
    if (auctionStatus === "won") {
      return "won";
    }

    /*
     * If backend explicitly sends lost/closed.
     */
    if (
      auctionStatus === "lost" ||
      auctionStatus === "closed"
    ) {
      return "lost";
    }

    /*
     * Live / active / anything else
     * is treated as an active auction.
     */
    return "active";
  };

  /*
   * Navigate to Bid Details page.
   *
   * URL:
   * /bid-details/:auctionId
   */
  const handleViewBid = (auctionId?: string) => {
    if (!auctionId) {
      return;
    }

    window.history.pushState(
      {},
      "",
      `/bid-details/${auctionId}`
    );

    /*
     * Notify the host application so that
     * routing can update without a full page reload.
     */
    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /*
   * Change tab and update URL.
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    const queryTab =
      tab === "Active Bids"
        ? "active"
        : tab.toLowerCase();

    window.history.pushState(
      {},
      "",
      `/my-bids?tab=${queryTab}`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /*
   * Filter bids according to selected tab.
   */
  const filteredBids = bids.filter((item) => {
    const status = getBookStatus(item);

    if (activeTab === "Active Bids") {
      return status === "active";
    }

    if (activeTab === "Won") {
      return status === "won";
    }

    if (activeTab === "Lost") {
      return status === "lost";
    }

    return false;
  });

  /*
   * Format currency.
   */
  const formatPrice = (price?: number) => {
    if (
      price === undefined ||
      price === null
    ) {
      return "₹0.00";
    }

    return `₹${Number(price).toFixed(2)}`;
  };

  /*
   * Calculate auction end date.
   *
   * duration is treated as number of days.
   */
  const getAuctionEndDate = (
    startDate: string,
    duration: number
  ) => {
    const start = new Date(startDate);

    start.setDate(
      start.getDate() +
        Number(duration || 0)
    );

    return start;
  };

  /*
   * Format remaining auction time.
   */
  const formatTimeRemaining = (
    startDate: string,
    duration: number
  ) => {
    const endDate = getAuctionEndDate(
      startDate,
      duration
    );

    const difference =
      endDate.getTime() -
      new Date().getTime();

    if (difference <= 0) {
      return "Ended";
    }

    const days = Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24
    );

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

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        {/* Header */}
        <h2 className="text-2xl font-semibold text-[#1B1530]">
          My Bids
        </h2>

        {/* Tabs */}
        <div className="mt-6 flex gap-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() =>
                handleTabChange(tab)
              }
              className={`border-b-2 px-2 pb-3 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-[#2454FF] text-[#2454FF]"
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
          filteredBids.length > 0 && (
            <div>
              {filteredBids.map((item) => {
                /*
                 * Determine status using the complete item.
                 */
                const status =
                  getBookStatus(item);

                /*
                 * Current highest bid in the auction.
                 */
                const currentBid =
                  item.auction
                    ?.currentBidPrice ??
                  item.bid?.bidPrice ??
                  item.auction?.bidPrice ??
                  0;

                /*
                 * Your own bid.
                 */
                const yourBid =
                  item.bid?.bidPrice ?? 0;

                /*
                 * Auction end date.
                 */
                const auctionEndDate =
                  getAuctionEndDate(
                    item.auction?.startDate ?? "",
                    item.auction?.duration ?? 0
                  );

                return (
                  <div
                    key={
                      item.bid?.bidId ||
                      item.auction?._id
                    }
                    className="grid grid-cols-12 items-center border-b border-gray-200 py-5 last:border-none"
                  >

                    {/* Book */}
                    <div className="col-span-5 flex items-center gap-4">
                      <img
                        src={
                          item.book
                            ?.coverImage
                        }
                        alt={
                          item.book?.name ||
                          "Book"
                        }
                        className="h-20 w-14 rounded border object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-[#1B1530]">
                          {item.book?.name}
                        </h3>

                        {item.book
                          ?.author && (
                          <p className="mt-1 text-sm text-gray-500">
                            by{" "}
                            {
                              item.book
                                .author
                            }
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
                          : "Current Bid"}
                      </p>

                      <p className="mt-1 font-semibold text-[#1B1530]">
                        {formatPrice(
                          currentBid
                        )}
                      </p>

                      {/* Your bid */}
                      {(status === "active" ||
                        status === "lost") && (
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
                          : "Ends in"}
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#1B1530]">
                        {status ===
                        "active"
                          ? formatTimeRemaining(
                              item.auction
                                ?.startDate ?? "",
                              item.auction
                                ?.duration ?? 0
                            )
                          : formatDate(
                              auctionEndDate.toISOString()
                            )}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="col-span-3 flex items-center justify-end gap-4">

                      {/* Won */}
                      {status === "won" ? (
                        <Rb_Button
                          variant="secondary"
                          className="!border-green-300 !bg-green-50 !text-green-700"
                        >
                          Pay Now
                        </Rb_Button>
                      ) : status === "lost" ? (

                        /* Lost -> View Bid Details */
                        <Rb_Button
                          variant="secondary"
                          className="!border-gray-300 !text-gray-500"
                          onClick={() =>
                            handleViewBid(
                              item.auction?._id
                            )
                          }
                        >
                          View
                        </Rb_Button>

                      ) : (

                        /* Active -> View Bid Details */
                        <Rb_Button
                          variant="secondary"
                          className="!border-[#4F7CF3] !text-[#2454FF]"
                          onClick={() =>
                            handleViewBid(
                              item.auction?._id
                            )
                          }
                        >
                          View
                        </Rb_Button>
                      )}

                      {/* Notification */}
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
          )}

        {/* No bids */}
        {!isLoading &&
          !isError &&
          userId &&
          filteredBids.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No bids found.
            </div>
          )}

        {/* Footer Info */}
        <div className="mt-5 flex items-center gap-2 border-t border-gray-200 pt-5">
          <Info
            size={16}
            className="text-[#2454FF]"
          />

          <p className="text-sm text-gray-500">
            You will be notified if you are
            outbid on any auction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyBids;

