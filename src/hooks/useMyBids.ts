import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export interface MyBidAuction {
  _id: string;
  bookId: string;
  bidPrice: number;
  buyNowPrice: number;
  duration: number;
  startDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  currentBidPrice?: number;
}

export interface MyBidBook {
  _id: string;
  name: string;
  coverImage: string;
  author?: string;
}

export interface MyBidOrder {
  _id: string;
  orderNumber?: string;
  orderType?: string;
  userId?: string;
  items?: {
    bookId: string;
    sellerId?: string;
    quantity?: number;
    itemStatus?: string;
    rental?: unknown;
    deposit?: unknown;
    shipmentDetails?: unknown[];
    _id?: string;
  }[];
  orderStatus?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MyBid {
  auction: MyBidAuction;

  book: MyBidBook;

  bid: {
    bidId: string;
    bidPrice: number;
    bidStatus?: string;
  };

  // API returns "order", not "orderData"
  order?: MyBidOrder | null;
}

const fetchMyBids = async (
  userId: string,
   status: "live" | "won" | "lost" | "cancelled"
): Promise<MyBid[]> => {
  const response = await fetch(
    `${API_URL}/api/auction/user/${userId}/bids?status=${status}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Failed to fetch your bids"
    );
  }

  const data = await response.json();

  console.log(`My ${status} bids API response:`, data);

  return Array.isArray(data)
    ? data
    : data?.data || [];
};

export const useMyBids = (
  userId: string,
  status: "live" | "won" | "lost" | "cancelled"
) => {
  return useQuery({
    queryKey: ["my-bids", userId, status],
    queryFn: () => fetchMyBids(userId, status),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
};