import { Search, Gavel, Gift } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Find a Book",
    description: "Browse books you've loved and add to your watchlist.",
  },
  {
    id: 2,
    icon: Gavel,
    title: "Place a Bid",
    description: "Bid competitively to win the book.",
  },
  {
    id: 3,
    icon: Gift,
    title: "Win & Enjoy",
    description: "If you win, make the payment and enjoy!",
  },
];

const AuctionWorks = () => {
  return (
    <section className="mx-auto mt-10 max-w-7xl rounded-2xl border border-gray-200 bg-white px-8 py-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-[#1B1530]">
        How Auctions Work?
      </h2>

      <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="flex items-start gap-4 px-6 py-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Icon
                  size={22}
                  className="text-[#4F7CF3]"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1B1530]">
                  {step.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AuctionWorks;