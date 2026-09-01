import { useQuery } from "@tanstack/react-query";

const API_URL = "https://be-book-rental.onrender.com";

/* =========================================================
   AUCTION
========================================================= */

export interface AuctionDetails {
    _id: string;
    bookId: string;
    bidPrice: number;
    buyNowPrice: number;
    duration: number;
    startDate: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

/* =========================================================
   BOOK
========================================================= */

export interface AuctionBookDetailsData {
    _id: string;
    name: string;
    description: string;

    categoryId?: string;
    language?: string;
    author?: string;
    edition?: string;
    coverImage?: string;
    condition?: string;
    numberOfPages?: number;

    createdAt?: string;
    updatedAt?: string;

    isAuction: boolean;

    auctionId?: AuctionDetails;
}

/* =========================================================
   USER BID
========================================================= */

export interface UserBid {
    _id: string;
    auctionId: string;
    bookId: string;
    userId: string;
    bidPrice: number;
    createdAt: string;
    updatedAt: string;
}

/* =========================================================
   AUCTION BID DETAILS
========================================================= */

export interface AuctionBidDetailsData {
    book: AuctionBookDetailsData;
    auction: AuctionDetails;
    currentBid: number;
    userBid: UserBid | null;
    isHighestBidder: boolean;
}

/* =========================================================
   GET BOOK
========================================================= */

const fetchAuctionBookById = async (
    bookId: string
): Promise<AuctionBookDetailsData> => {
    const response = await fetch(
        `${API_URL}/api/book/${bookId}`
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result?.message ||
                "Failed to fetch book"
        );
    }

    return result.data;
};

/* =========================================================
   GET AUCTION BID DETAILS
========================================================= */

const fetchAuctionBidDetails = async (
    bookId: string,
    userId: string
): Promise<AuctionBidDetailsData> => {
    // const url =
    //     `${API_URL}/api/auction/${bookId}/auction/bid/${userId}`;
 const response = await fetch(
    `${API_URL}/api/auction/${bookId}/auction/bid/${userId}`,
    {
      method: "GET",
      credentials: "include",
    })
    // console.log(
    //     "GET Auction Bid Details:",
    //     url
    // );
//  const response = await fetch(url, {
//      method: "GET",
//         credentials: "include",
//     });
    const result =
        await response.json();

    console.log(
        "Auction Bid Details:",
        result
    );

    if (!response.ok) {
        throw new Error(
            result?.message ||
                "Failed to fetch auction bid details"
        );
    }

    if (!result?.data) {
        throw new Error(
            "Auction bid details not found"
        );
    }

    return result.data;
};

/* =========================================================
   BOOK QUERY
========================================================= */

export const useAuctionBookDetails = (
    bookId?: string
) => {
    return useQuery<
        AuctionBookDetailsData,
        Error
    >({
        queryKey: [
            "auction-book-details",
            bookId,
        ],

        queryFn: () =>
            fetchAuctionBookById(bookId!),

        enabled: Boolean(bookId),

        retry: false,
    });
};

/* =========================================================
   AUCTION BID DETAILS QUERY
========================================================= */

export const useAuctionBidDetails = (
    bookId?: string,
    userId?: string
) => {
    return useQuery<
        AuctionBidDetailsData,
        Error
    >({
        queryKey: [
            "auction-bid-details",
            bookId,
            userId,
        ],

        queryFn: () =>
            fetchAuctionBidDetails(
                bookId!,
                userId!
            ),

        enabled:
            Boolean(bookId) &&
            Boolean(userId),

        retry: false,
    });
};