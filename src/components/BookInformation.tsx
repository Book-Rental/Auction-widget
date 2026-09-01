import React from "react";
import {
  Rb_Input,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";
import { BookFormData } from "../pages/BookDetailsPage";


interface BookInformationProps {
  bookData: BookFormData;
  onChange: (
    field: keyof BookFormData,
    value: string
  ) => void;
}

const BookInformation: React.FC<
  BookInformationProps
> = ({ bookData, onChange }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">

      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[#6841D8]">
          ▣
        </span>

        <Rb_Text
          variant="h4"
          className="text-lg font-semibold text-[#1B1530]"
        >
          Book Information
        </Rb_Text>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">

        {/* Book Title */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            Book Title *
          </label>

          <Rb_Input
            value={bookData.title}
            onChange={(e) =>
              onChange("title", e.target.value)
            }
            placeholder="Enter book title"
            className="w-full"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            Category *
          </label>

          <select
            value={bookData.category}
            onChange={(e) =>
              onChange("category", e.target.value)
            }
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#6841D8]"
          >
            <option value="">
              Select category
            </option>

            <option value="Self Help">
              Self Help
            </option>

            <option value="Fiction">
              Fiction
            </option>

            <option value="Business">
              Business
            </option>

            <option value="Biography">
              Biography
            </option>

            <option value="Science">
              Science
            </option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            Author *
          </label>

          <Rb_Input
            value={bookData.author}
            onChange={(e) =>
              onChange("author", e.target.value)
            }
            placeholder="Enter author name"
            className="w-full"
          />
        </div>

        {/* Edition */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            Edition{" "}
            <span className="font-normal text-gray-500">
              (Optional)
            </span>
          </label>

          <Rb_Input
            value={bookData.edition}
            onChange={(e) =>
              onChange("edition", e.target.value)
            }
            placeholder="e.g. 2nd Edition"
            className="w-full"
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="mb-1 block text-xs font-medium">
            ISBN{" "}
            <span className="font-normal text-gray-500">
              (Optional)
            </span>
          </label>

          <Rb_Input
            value={bookData.isbn}
            onChange={(e) =>
              onChange("isbn", e.target.value)
            }
            placeholder="Enter ISBN number"
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
};

export default BookInformation;