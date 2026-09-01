import {
  ProductCard,
  Rb_Anchor,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

const auctions = [
  {
    id: 1,
    title: "Deep Work",
    author: "Cal Newport",
    image: "https://m.media-amazon.com/images/I/81JJ7fyyKyS.jpg",
    bid: 280,
    timeLeft: "2d 6h left",
    bids: 14,
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    image: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg",
    bid: 150,
    timeLeft: "3d 10h left",
    bids: 8,
  },
  {
    id: 3,
    title: "Think Again",
    author: "Adam Grant",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    bid: 165,
    timeLeft: "1d 6h left",
    bids: 11,
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    image: "https://m.media-amazon.com/images/I/713jIoMO3UL.jpg",
    bid: 275,
    timeLeft: "2d 1h left",
    bids: 19,
  },
  {
    id: 5,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    bid: 210,
    timeLeft: "1d 8h left",
    bids: 16,
  },
];

const OtherLiveAuctions = () => {
  return (
    <div className="rounded-2xl bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Rb_Text
          variant="h3"
          className="font-semibold text-[#1B1530]"
        >
          Other Live Auctions You May Like
        </Rb_Text>

        <Rb_Anchor
          className="font-medium text-[#2454FF] hover:underline"
        >
          View All
        </Rb_Anchor>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {auctions.map((book) => (
          <ProductCard
            key={book.id}
            imageUrl={book.image}
            title={book.title}
            author={book.author}
            priceText={`Current Bid ₹${book.bid}`}
            cardWidth="100%"
            cardMaxWidth="100%"
            cardMinWidth="0"
            imageHeight={180}
            className="cursor-pointer"
          >
            <div className="space-y-1">
              <Rb_Text
                variant="p"
                className="font-semibold text-red-600"
              >
                {book.timeLeft}
              </Rb_Text>

              <Rb_Text
                variant="p"
                className="text-sm text-[#2454FF]"
              >
                {book.bids} bids
              </Rb_Text>
            </div>
          </ProductCard>
        ))}
      </div>
    </div>
  );
};

export default OtherLiveAuctions;