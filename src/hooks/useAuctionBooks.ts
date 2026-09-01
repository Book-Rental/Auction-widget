import { useQuery } from "@tanstack/react-query";

const API_URL = "https://be-book-rental.onrender.com";

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

    /**
     * Supports:
     *
     * 1. Direct array:
     *
     * [
     *   {...},
     *   {...}
     * ]
     *
     * 2. Nested response:
     *
     * {
     *   data: {
     *     products: [...]
     *   }
     * }
     */
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