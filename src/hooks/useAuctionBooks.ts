import { useQuery } from "@tanstack/react-query";

const API_URL = "https://be-book-rental.onrender.com";

export interface AuctionDetails {
    _id: string;
    bookId: string;
    bidPrice: number;
    buyNowPrice?: number;
    duration: number;
    startDate: string;
    createdAt?: string;

    isActive: boolean;

    status:
        | "upcoming"
        | "live"
        | "completed"
        | "cancelled";

    currentBidPrice?: number;
    highestBid?: number | null;
    highestBidder?: string | null;
    bidCount?: number;
    order?: unknown | null;
}

export interface AuctionBook {
    _id: string;
    name: string;
    author: string;
    coverImage: string;

    rentalPricePerWeek?: number;
    isAuction?: boolean;

    currentBid?: number;
    bids?: number;
    timeLeft?: string;
    status?: string;

    // API returns auction as an array
    auction: AuctionDetails[];
}

const fetchAuctionBooks = async (): Promise<AuctionBook[]> => {
    const response = await fetch(
        `${API_URL}/api/book?isAuction=true&status=live`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch live auction books"
        );
    }

    const result = await response.json();

    if (Array.isArray(result)) {
        return result;
    }

    if (Array.isArray(result?.data?.products)) {
        return result.data.products;
    }

    return [];
};

export const useAuctionBooks = () => {
    return useQuery<AuctionBook[], Error>({
        queryKey: ["auction-books", "live"],
        queryFn: fetchAuctionBooks,
    });
};