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

const navigateToCheckout = (
    bookId?: string,
  auctionId?: string
) => {
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

  window.dispatchEvent(
    new PopStateEvent("popstate")
  );
};

const navigateToOrder = (
  orderId?: string,
  bookId?: string
) => {
  if (!orderId || !bookId) {
    return;
  }

  window.history.pushState(
    {},
    "",
    `/order-details?orderId=${orderId}&bookId=${bookId}`
  );

  window.dispatchEvent(
    new PopStateEvent("popstate")
  );
};

const MyBids = () => {
  const [activeTab, setActiveTab] =
    useState(getInitialTab);

  /*
   * Get logged-in user ID from host application.
   */
  const userId =
    window.HOST_USER_INFO?._id ?? "";

  /*
   * Convert UI tab to API status.
   *
   * Active Bids -> live
   * Won        -> won
   * Lost       -> lost
   */
  const apiStatus:
    | "live"
    | "won"
    | "lost" =
    activeTab === "Active Bids"
      ? "live"
      : activeTab === "Won"
        ? "won"
        : "lost";

  /*
   * Fetch only the bids required for the
   * currently selected tab.
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

  /*
   * Navigate to Bid Details page.
   */
  const handleViewBid = (
    auctionId?: string
  ) => {
    if (!auctionId) {
      return;
    }

    window.history.pushState(
      {},
      "",
      `/bid-details/${auctionId}`
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );
  };

  /*
   * Change tab and update URL.
   *
   * Changing activeTab also changes apiStatus,
   * which changes the React Query key and
   * triggers the correct API call.
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
   * The API already filters the bids by status,
   * so no frontend filtering is required.
   *
   * API:
   * live -> Active Bids
   * won  -> Won
   * lost -> Lost
   */
  const currentBids: MyBid[] = bids;

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
              className={`border-b-2 px-2 pb-3 text-sm font-medium transition ${activeTab === tab
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
          currentBids.length > 0 && (
            <div>
              {currentBids.map((item) => {
                /*
                 * The API endpoint already determines
                 * which tab this item belongs to.
                 */
                const status =
                  apiStatus === "live"
                    ? "active"
                    : apiStatus;

                /*
                 * Current highest bid.
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

                        {item.book?.author && (
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
  {status === "won" ? (
    item.order ? (
      <>
        {item.order.items?.[0]?.itemStatus && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">
            {item.order.items[0].itemStatus}
          </span>
        )}

        <Rb_Button
          variant="secondary"
          className="!border-green-300 !bg-green-50 !text-green-700"
          onClick={() =>
            navigateToOrder(
              item.order?._id,
              item.book?._id
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
            item.book?._id,
            item.auction?._id
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
        handleViewBid(item.auction?._id)
      }
    >
      View
    </Rb_Button>
  ) : (
    <Rb_Button
      variant="secondary"
      className="!border-[#4F7CF3] !text-[#2454FF]"
      onClick={() =>
        handleViewBid(item.auction?._id)
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
          )}

        {/* No bids */}
        {!isLoading &&
          !isError &&
          userId &&
          currentBids.length === 0 && (
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
