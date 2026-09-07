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

export interface MyBid {
  auction: MyBidAuction;
  book: MyBidBook;
  bid: {
    bidId: string;
    bidPrice: number;
  };
}

const fetchMyBids = async (
  userId: string
): Promise<MyBid[]> => {
  const response = await fetch(
    `${API_URL}/api/auction/user/${userId}/bids`,
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

  console.log("My bids API response:", data);

  return Array.isArray(data)
    ? data
    : data?.data || [];
};

export const useMyBids = (userId: string) => {
  return useQuery({
    queryKey: ["my-bids", userId],
    queryFn: () => fetchMyBids(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
};