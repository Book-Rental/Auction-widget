import { useEffect, useState } from "react";
import {
    BookOpen,
    Globe,
    Clock3,
    FileText,
    AlertCircle,
} from "lucide-react";

import {
    Rb_Image,
    Rb_Text,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import { useAuctionBookDetails } from "../hooks/useAuctionBookDetails";

interface AuctionBookInfoProps {
    bookId?: string;
}

interface RemainingTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
}

const getRemainingTime = (
    startDate?: string,
    duration?: number
): RemainingTime | null => {
    if (!startDate || !duration) return null;

    const start = new Date(startDate).getTime();
    const end = start + duration * 24 * 60 * 60 * 1000;
    const remaining = end - Date.now();

    if (remaining <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: true,
        };
    }

    return {
        days: Math.floor(
            remaining / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
            (remaining / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
            (remaining / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
            (remaining / 1000) % 60
        ),
        expired: false,
    };
};

const AuctionBookInfo = ({
    bookId,
}: AuctionBookInfoProps) => {
    const {
        data: book,
        isLoading,
        isError,
        error,
    } = useAuctionBookDetails(bookId);

    console.log("AuctionBookInfo bookId:", bookId);
    console.log("AuctionBookInfo book:", book);

    /*
     * Auction information
     */
    const auction = book?.auctionId;

    const auctionStatus =
        auction?.status?.toLowerCase() ?? "";

    /*
     * Countdown
     */
    const [remainingTime, setRemainingTime] =
        useState<RemainingTime | null>(() =>
            getRemainingTime(
                auction?.startDate,
                auction?.duration
            )
        );

    useEffect(() => {
        if (
            !auction?.startDate ||
            !auction?.duration
        ) {
            setRemainingTime(null);
            return;
        }

        const updateTime = () => {
            setRemainingTime(
                getRemainingTime(
                    auction.startDate,
                    auction.duration
                )
            );
        };

        updateTime();

        const timer = setInterval(
            updateTime,
            1000
        );

        return () => clearInterval(timer);
    }, [
        auction?.startDate,
        auction?.duration,
    ]);

    /*
     * Auction status badge
     */
    const statusConfig = {
        upcoming: {
            label: "Auction Starts Soon",
            className:
                "bg-amber-50 text-amber-700 border-amber-200",
        },

        live: {
            label: "Live Auction",
            className:
                "bg-green-50 text-green-700 border-green-200",
        },

        completed: {
            label: "Auction Completed",
            className:
                "bg-gray-100 text-gray-700 border-gray-200",
        },

        cancelled: {
            label: "Auction Cancelled",
            className:
                "bg-red-50 text-red-700 border-red-200",
        },
    };

    const status =
        statusConfig[
            auctionStatus as keyof typeof statusConfig
        ] ?? statusConfig.upcoming;

    /*
     * No book ID
     */
    if (!bookId) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <Rb_Text
                    variant="p"
                    className="text-gray-500"
                >
                    Book information is unavailable.
                </Rb_Text>
            </div>
        );
    }

    /*
     * Loading
     */
    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
                <Rb_LoadingSpinner />
            </div>
        );
    }

    /*
     * Error
     */
    if (isError || !book) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <Rb_Text
                    variant="p"
                    className="font-medium text-red-600"
                >
                    {error instanceof Error
                        ? error.message
                        : "Unable to load book information."}
                </Rb_Text>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex gap-5">
                {/* Book Image */}
                <div className="w-60 flex-shrink-0">
                    <Rb_Image
                        src={
                            book.coverImage ||
                            "/assets/images/book-placeholder.png"
                        }
                        alt={book.name}
                        shape="rounded"
                        className="h-[220px] w-[220px] border !object-contain"
                    />
                </div>

                {/* Book Information */}
                <div className="flex flex-1 flex-col">
                    {/* Title + Status */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Rb_Text
                                variant="h1"
                                className="!text-3xl !font-semibold text-[#1B1530]"
                            >
                                {book.name}
                            </Rb_Text>

                            <Rb_Text
                                variant="p"
                                className="mt-2 text-xl text-gray-600"
                            >
                                by{" "}
                                {book.author ||
                                    "Unknown Author"}
                            </Rb_Text>
                        </div>

                        {/* Status Badge */}
                        {auctionStatus && (
                            <span
                                className={`inline-flex flex-shrink-0 items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${status.className}`}
                            >
                                {status.label}
                            </span>
                        )}
                    </div>

                    {/* Category */}
                    <div className="mt-4 flex gap-3">
                        <span className="rounded-md bg-[#F6F2E9] px-3 py-1 text-sm font-medium text-[#6A4E1F]">
                            {book.categoryId || "Book"}
                        </span>
                    </div>

                    {/* Countdown */}
                    {auctionStatus === "live" &&
                        remainingTime &&
                        !remainingTime.expired && (
                            <div className="mt-5">
                                <div className="mb-3 flex items-center gap-2">
                                    <Clock3
                                        size={18}
                                        className="text-[#2454FF]"
                                    />

                                    <Rb_Text
                                        variant="p"
                                        className="font-semibold text-[#2454FF]"
                                    >
                                        Auction ends in
                                    </Rb_Text>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {/* Days */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2454FF]">
                                            {
                                                remainingTime.days
                                            }
                                        </div>

                                        <div className="text-xs text-[#2454FF]">
                                            Days
                                        </div>
                                    </div>

                                    {/* Hours */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2454FF]">
                                            {
                                                remainingTime.hours
                                            }
                                        </div>

                                        <div className="text-xs text-[#2454FF]">
                                            Hours
                                        </div>
                                    </div>

                                    {/* Minutes */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2454FF]">
                                            {
                                                remainingTime.minutes
                                            }
                                        </div>

                                        <div className="text-xs text-[#2454FF]">
                                            Minutes
                                        </div>
                                    </div>

                                    {/* Seconds */}
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-[#2454FF]">
                                            {
                                                remainingTime.seconds
                                            }
                                        </div>

                                        <div className="text-xs text-[#2454FF]">
                                            Seconds
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Auction Expired */}
                    {auctionStatus === "live" &&
                        remainingTime?.expired && (
                            <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4">
                                <AlertCircle
                                    size={18}
                                    className="text-red-500"
                                />

                                <Rb_Text
                                    variant="p"
                                    className="font-medium text-red-600"
                                >
                                    This auction has ended.
                                </Rb_Text>
                            </div>
                        )}

                    {/* Book Details */}
                    <div className="mt-5 space-y-5">
                        {/* Edition */}
                        <div className="flex items-center gap-3">
                            <BookOpen
                                size={20}
                                className="text-gray-500"
                            />

                            <div>
                                <Rb_Text
                                    variant="p"
                                    className="text-sm text-gray-500"
                                >
                                    Edition
                                </Rb_Text>

                                <Rb_Text
                                    variant="p"
                                    className="font-medium text-[#1B1530]"
                                >
                                    {book.edition ??
                                        "N/A"}
                                </Rb_Text>
                            </div>
                        </div>

                        {/* Pages */}
                        <div className="flex items-center gap-3">
                            <FileText
                                size={20}
                                className="text-gray-500"
                            />

                            <div>
                                <Rb_Text
                                    variant="p"
                                    className="text-sm text-gray-500"
                                >
                                    Pages
                                </Rb_Text>

                                <Rb_Text
                                    variant="p"
                                    className="font-medium text-[#1B1530]"
                                >
                                    {book.numberOfPages ??
                                        "N/A"}
                                </Rb_Text>
                            </div>
                        </div>

                        {/* Language */}
                        <div className="flex items-center gap-3">
                            <Globe
                                size={20}
                                className="text-gray-500"
                            />

                            <div>
                                <Rb_Text
                                    variant="p"
                                    className="text-sm text-gray-500"
                                >
                                    Language
                                </Rb_Text>

                                <Rb_Text
                                    variant="p"
                                    className="font-medium text-[#1B1530]"
                                >
                                    {book.language ??
                                        "N/A"}
                                </Rb_Text>
                            </div>
                        </div>

                        {/* Listed On */}
                        <div className="flex items-center gap-3">
                            <Clock3
                                size={20}
                                className="text-gray-500"
                            />

                            <div>
                                <Rb_Text
                                    variant="p"
                                    className="text-sm text-gray-500"
                                >
                                    Listed on
                                </Rb_Text>

                                <Rb_Text
                                    variant="p"
                                    className="font-medium text-[#1B1530]"
                                >
                                    {book.createdAt
                                        ? new Date(
                                              book.createdAt
                                          ).toLocaleDateString(
                                              undefined,
                                              {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                              }
                                          )
                                        : "N/A"}
                                </Rb_Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionBookInfo;

