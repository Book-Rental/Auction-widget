import {
    BookOpen,
    Globe,
    Clock3,
    FileText,
} from "lucide-react";

import {
    Rb_Image,
    Rb_Text,
    Rb_Icon,
    Rb_LoadingSpinner,
} from "@rentbook/rentbook-ui-lib";

import { useAuctionBookDetails } from "../hooks/useAuctionBookDetails";

interface AuctionBookInfoProps {
    bookId?: string;
}

const AuctionBookInfo = ({
    bookId,
}: AuctionBookInfoProps) => {
    const {
        data: book,
        isLoading,
        isError,
        error,
    } = useAuctionBookDetails(bookId);

    console.log(
        "AuctionBookInfo bookId:",
        bookId
    );

    console.log(
        "AuctionBookInfo book:",
        book
    );

    if (!bookId) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                Book ID is missing.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <Rb_LoadingSpinner />
            </div>
        );
    }

    if (isError || !book) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-500">
                <p>
                    Failed to load book information.
                </p>

                {error?.message && (
                    <p className="mt-2 text-sm">
                        {error.message}
                    </p>
                )}
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

                {/* Book Details */}

                <div className="flex flex-1 flex-col">

                    {/* Header */}

                    <div className="flex items-start">
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
                    </div>

                    {/* Tags */}

                    <div className="mt-4 flex gap-3">
                        <span className="rounded-md bg-[#F6F2E9] px-3 py-1 text-sm font-medium text-[#6A4E1F]">
                            {book.categoryId ||
                                "Book"}
                        </span>
                    </div>

                    {/* Details */}

                    <div className="mt-3 space-y-5">

                        {/* Edition */}

                        <div className="flex items-center gap-2">
                            <Rb_Icon
                                icon={BookOpen}
                                size={20}
                                color="#2454FF"
                            />

                            <Rb_Text
                                variant="p"
                                className="font-medium text-[#1B1530]"
                            >
                                Edition:
                            </Rb_Text>

                            <Rb_Text
                                variant="p"
                                className="text-gray-600"
                            >
                                {book.edition ??
                                    "N/A"}
                            </Rb_Text>
                        </div>

                        {/* Pages */}

                        <div className="flex items-center gap-2">
                            <Rb_Icon
                                icon={FileText}
                                size={20}
                                color="#2454FF"
                            />

                            <Rb_Text
                                variant="p"
                                className="font-medium text-[#1B1530]"
                            >
                                Pages:
                            </Rb_Text>

                            <Rb_Text
                                variant="p"
                                className="text-gray-600"
                            >
                                {book.numberOfPages ??
                                    "N/A"}
                            </Rb_Text>
                        </div>

                        {/* Language */}

                        <div className="flex items-center gap-2">
                            <Rb_Icon
                                icon={Globe}
                                size={20}
                                color="#2454FF"
                            />

                            <Rb_Text
                                variant="p"
                                className="font-medium text-[#1B1530]"
                            >
                                Language:
                            </Rb_Text>

                            <Rb_Text
                                variant="p"
                                className="text-gray-600"
                            >
                                {book.language ??
                                    "N/A"}
                            </Rb_Text>
                        </div>

                        {/* Listed On */}

                        <div className="flex items-center gap-2">
                            <Rb_Icon
                                icon={Clock3}
                                size={20}
                                color="#2454FF"
                            />

                            <Rb_Text
                                variant="p"
                                className="font-medium text-[#1B1530]"
                            >
                                Listed on:
                            </Rb_Text>

                            <Rb_Text
                                variant="p"
                                className="text-gray-600"
                            >
                                {book.createdAt
                                    ? new Date(
                                          book.createdAt
                                      ).toLocaleString(
                                          "en-IN",
                                          {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          }
                                      )
                                    : "N/A"}
                            </Rb_Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionBookInfo;