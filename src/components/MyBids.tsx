import { useState } from "react";
import { Info, Bell } from "lucide-react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

const tabs = ["Active Bids", "Won", "Lost"];

const books = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
    label: "Current Bid",
    value: "₹380.00",
    date: "2d 14h",
    button: "View",
    bell: true,
    status: "active",
  },
  {
    id: "2",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    label: "Highest Bid",
    value: "₹210.00",
    date: "1d 8h",
    button: "View",
    bell: true,
    status: "active",
  },
  {
    id: "3",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
    label: "Highest Bid",
    value: "₹210.00",
    date: "20 May 2024",
    button: "View",
    bell: true,
    status: "active",
  },
  {
    id: "4",
    title: "Deep Work",
    author: "Cal Newport",
    image: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
    label: "Current Bid",
    value: "₹260.00",
    date: "2d 6h",
    button: "View",
    bell: true,
    status: "active",
  },
  {
    id: "5",
    title: "Think Again",
    author: "Adam Grant",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    label: "Won",
    value: "15 May 2024",
    date: "15 May 2024",
    button: "Pay Now",
    bell: false,
    status: "won",
  },
  {
    id: "6",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg",
    label: "Won",
    value: "10 May 2024",
    date: "10 May 2024",
    button: "Pay Now",
    bell: false,
    status: "won",
  },
];

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

  const filteredBooks = books.filter((book) => {
    if (activeTab === "Active Bids") {
      return book.status === "active";
    }

    if (activeTab === "Won") {
      return book.status === "won";
    }

    if (activeTab === "Lost") {
      return book.status === "lost";
    }

    return false;
  });

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
              onClick={() => handleTabChange(tab)}
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

        {/* Bids */}
        <div>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="grid grid-cols-12 items-center border-b border-gray-200 py-5 last:border-none"
              >
                {/* Book */}
                <div className="col-span-5 flex items-center gap-4">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-20 w-14 rounded border object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-[#1B1530]">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      by {book.author}
                    </p>
                  </div>
                </div>

                {/* Bid */}
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">
                    {book.label}
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      book.status === "won"
                        ? "text-[#1B1530]"
                        : "text-[#1B1530]"
                    }`}
                  >
                    {book.value}
                  </p>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">
                    {book.status === "won"
                      ? "Won on"
                      : "Ends in"}
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#1B1530]">
                    {book.date}
                  </p>
                </div>

                {/* Action */}
                <div className="col-span-3 flex items-center justify-end gap-4">
                  {book.status === "won" ? (
                    <Rb_Button
                      variant="secondary"
                      className="!border-green-300 !bg-green-50 !text-green-700"
                    >
                      Pay Now
                    </Rb_Button>
                  ) : (
                    <Rb_Button
                      variant="secondary"
                      className="!border-[#4F7CF3] !text-[#2454FF]"
                    >
                      View
                    </Rb_Button>
                  )}

                  {book.bell && (
                    <Bell
                      size={18}
                      className="cursor-pointer text-gray-500"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              No bids found.
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-5 flex items-center gap-2 border-t border-gray-200 pt-5">
          <Info
            size={16}
            className="text-[#2454FF]"
          />

          <p className="text-sm text-gray-500">
            You will be notified if you are outbid on any
            auction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyBids;