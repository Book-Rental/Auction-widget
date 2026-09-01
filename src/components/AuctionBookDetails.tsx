import {
  UserCircle,
  BookOpen,
  FileText,
  Library,
} from "lucide-react";

const AuctionBookDetails = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Section */}
        <div className="lg:col-span-8">
          <h2 className="text-xl font-semibold text-[#1B1530]">
            About the Book
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            No matter your goals, <strong>Atomic Habits</strong> offers a
            proven framework for improving every day. James Clear, one of the
            world's leading experts on habit formation, reveals practical
            strategies that will teach you exactly how to form good habits,
            break bad ones, and master the tiny behaviors that lead to
            remarkable results.
          </p>

          <button className="mt-6 font-medium text-[#2454FF] hover:underline">
            Read more
          </button>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-200"></div>

        {/* Right Section */}
        <div className="space-y-6 lg:col-span-3">
          <div className="flex items-center gap-2 mt-1">
            <UserCircle size={20} className="text-[#2454FF]" />
            <span className="w-24 font-medium text-[#1B1530]">
              Author
            </span>
            <span className="text-gray-600">James Clear</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Library size={20} className="text-[#2454FF]" />
            <span className="w-24 font-medium text-[#1B1530]">
              Publisher
            </span>
            <span className="text-gray-600">
              Penguin Random House
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <FileText size={20} className="text-[#2454FF]" />
            <span className="w-24 font-medium text-[#1B1530]">
              Pages
            </span>
            <span className="text-gray-600">320 pages</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <BookOpen size={20} className="text-[#2454FF]" />
            <span className="w-24 font-medium text-[#1B1530]">
              Genre
            </span>
            <span className="text-gray-600">Self Help</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionBookDetails;