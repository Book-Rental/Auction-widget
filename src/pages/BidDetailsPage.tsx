import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
    userId: string;
    name: string;
    email: string;
    phone: string;
}

interface Bid {
    _id: string;
    rank: number;
    user: User;
    bidPrice: number;
}

interface Auction {
    _id: string;
    bookId: string;
    bidPrice: number;
    buyNowPrice: number;
    duration: number;
    startDate: string;
    currentBidPrice: number;
}

interface Book {
    _id: string;
    name: string;
    description: string;
    author: string;
    coverImage: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface BidDetailsData {
    auction: Auction;
    book: Book;
    bids: Bid[];
    pagination: Pagination;
}

const BidDetailsPage = () => {
    const auctionId = window.location.pathname.split("/").pop();

    const [data, setData] = useState<BidDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        const fetchBidDetails = async () => {
            if (!auctionId) {
                setError("Auction ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/auction/${auctionId}/bids`,
                    {
                        credentials: "include",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.message || "Failed to fetch bid details"
                    );
                }

                setData(result.data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBidDetails();
    }, [auctionId]);

    const handleBookClick = (bookId: string) => {
        window.location.href = `/books-details?bookId=${bookId}`;
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-sm text-gray-500">
                        Loading bid details...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                        !
                    </div>

                    <h2 className="text-lg font-semibold text-red-800">
                        Unable to load bids
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    No bid details found.
                </p>
            </div>
        );
    }

    const { auction, book, bids, pagination } = data;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Bid Details
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                View auction information and bidder rankings
                            </p>
                        </div>

                    </div>
                </div>

                {/* Book + Auction */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Book Details */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:col-span-2">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                                📚
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Book Details
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Auctioned book information
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 sm:flex-row">
                            {/* Cover image - clickable */}
                            <button
                                type="button"
                                onClick={() => handleBookClick(auction.bookId)}
                                className="group relative shrink-0 self-start overflow-hidden rounded-xl ring-1 ring-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                aria-label={`View details for ${book.name}`}
                            >
                                {!imgLoaded && (
                                    <div className="absolute inset-0 animate-pulse bg-gray-100" />
                                )}

                                <img
                                    src={book.coverImage}
                                    alt={book.name}
                                    onLoad={() => setImgLoaded(true)}
                                    className="h-44 w-32 object-cover transition duration-300 ease-out group-hover:scale-105 group-hover:brightness-90 sm:h-48 sm:w-36"
                                />

                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                                    <span className="translate-y-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 opacity-0 shadow transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                                        View Book
                                    </span>
                                </div>
                            </button>

                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {book.name}
                                </h3>

                                <p className="mt-1 text-sm font-medium text-blue-600">
                                    By {book.author}
                                </p>

                                <p className="mt-4 text-sm leading-6 text-gray-600">
                                    {book.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Auction Summary */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                                🔨
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Auction
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Current status
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Starting Bid
                                </span>

                                <span className="font-semibold text-gray-900">
                                    ₹{auction.bidPrice}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Current Bid
                                </span>

                                <span className="text-xl font-bold text-green-600">
                                    ₹{auction.currentBidPrice}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Buy Now
                                </span>

                                <span className="font-semibold text-gray-900">
                                    ₹{auction.buyNowPrice}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Duration
                                </span>

                                <span className="font-medium text-gray-700">
                                    {auction.duration} days
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-400">
                                    Start Date
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-700">
                                    {new Date(
                                        auction.startDate
                                    ).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bid Statistics */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm text-gray-500">
                            Total Bids
                        </p>

                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {pagination.total}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm text-gray-500">
                            Highest Bid
                        </p>

                        <p className="mt-1 text-2xl font-bold text-green-600">
                            ₹{auction.currentBidPrice}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm text-gray-500">
                            Top Bidder
                        </p>

                        <p className="mt-1 truncate text-lg font-bold text-gray-900">
                            {bids[0]?.user?.name || "No bidder"}
                        </p>
                    </div>
                </div>

                {/* Bids Table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                    <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Bidder Rankings
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Bids are ranked from highest to lowest
                            </p>
                        </div>

                        <div className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                            {pagination.total}{" "}
                            {pagination.total === 1
                                ? "Bid"
                                : "Bids"}
                        </div>
                    </div>

                    {bids.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                                🔨
                            </div>

                            <h3 className="font-semibold text-gray-900">
                                No bids yet
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                There are currently no bids for this
                                auction.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Rank
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Bidder
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Email
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Phone
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Bid Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {bids.map((bid) => (
                                            <tr
                                                key={bid._id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <div
                                                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                                            bid.rank === 1
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : bid.rank === 2
                                                                ? "bg-gray-200 text-gray-700"
                                                                : bid.rank === 3
                                                                ? "bg-orange-100 text-orange-700"
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}
                                                    >
                                                        {bid.rank}
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                                            {bid.user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    bid
                                                                        .user
                                                                        .name
                                                                }
                                                            </p>

                                                            {bid.rank ===
                                                                1 && (
                                                                <span className="text-xs font-medium text-green-600">
                                                                    Highest
                                                                    bidder
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {bid.user.email}
                                                </td>

                                                <td className="px-6 py-5 text-sm text-gray-600">
                                                    {bid.user.phone}
                                                </td>

                                                <td className="px-6 py-5 text-right">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₹
                                                        {bid.bidPrice.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="space-y-3 p-4 md:hidden">
                                {bids.map((bid) => (
                                    <div
                                        key={bid._id}
                                        className="rounded-xl border border-gray-200 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                                        bid.rank === 1
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : bid.rank === 2
                                                            ? "bg-gray-200 text-gray-700"
                                                            : bid.rank === 3
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-gray-100 text-gray-500"
                                                    }`}
                                                >
                                                    {bid.rank}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {bid.user.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {
                                                            bid.user
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="font-bold text-green-600">
                                                ₹
                                                {bid.bidPrice.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        </div>

                                        <div className="mt-3 border-t border-gray-100 pt-3">
                                            <p className="text-xs text-gray-500">
                                                Phone
                                            </p>

                                            <p className="mt-1 text-sm text-gray-700">
                                                {bid.user.phone}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Pagination */}
                    {pagination.total > 0 && (
                        <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                            <span>
                                Showing page{" "}
                                <strong className="text-gray-900">
                                    {pagination.page}
                                </strong>{" "}
                                of{" "}
                                <strong className="text-gray-900">
                                    {pagination.totalPages}
                                </strong>
                            </span>

                            <span>
                                {pagination.total} total bids
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BidDetailsPage;