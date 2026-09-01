import React from "react";
import {
  Rb_Button,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

interface OutBidBookDetailsProps {
  book: {
    title: string;
    author: string;
  };
}

const OutBidBookDetails: React.FC<
  OutBidBookDetailsProps
> = ({ book }) => {

  const handleSave = () => {
    console.log(
      "Saved book:",
      book.title
    );
  };

  return (
    <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-white p-4">

      <div className="grid grid-cols-[1fr_290px] gap-5">

        {/* About Book */}
        <div className="border-r border-[#E5E7EB] pr-5">

          <Rb_Text
            variant="h3"
            className="mb-3 font-semibold text-[#17152B]"
          >
            About the Book
          </Rb_Text>

          <Rb_Text
            className="text-[9px] leading-5 text-gray-600"
          >
            No matter your goals, {book.title} offers a
            proven framework for improving—every day.
            {book.author}, one of the world's leading
            experts on habit formation, reveals practical
            strategies that teach you exactly how to form
            good habits, break bad ones, and master the tiny
            behaviors that lead to remarkable results.
          </Rb_Text>

          <Rb_Button
            variant="primary"
            className="mt-2 !bg-transparent !p-0 !text-[9px] !text-[#1455E6] hover:!bg-transparent"
          >
            Read more
          </Rb_Button>

        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-3">

          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            👤 &nbsp; Author
          </Rb_Text>

          <Rb_Text

            className="text-[9px]"
          >
            {book.author}
          </Rb_Text>


          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            📖 &nbsp; Edition
          </Rb_Text>

          <Rb_Text

            className="text-[9px]"
          >
            1st Edition
          </Rb_Text>


          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            🌐 &nbsp; Language
          </Rb_Text>

          <Rb_Text

            className="text-[9px]"
          >
            English
          </Rb_Text>


          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            ◷ &nbsp; Listed on
          </Rb_Text>

          <Rb_Text

            className="text-[9px]"
          >
            20 May 2024, 10:30 AM
          </Rb_Text>


          <Rb_Text

            className="text-[9px] text-gray-500"
          >
            ◉ &nbsp; Category
          </Rb_Text>

          <Rb_Text

            className="text-[9px]"
          >
            Self Help
          </Rb_Text>

          <div />

          <Rb_Button
            variant="secondary"
            className="h-7 text-[9px]"
            onClick={handleSave}
          >
            ♡ Save
          </Rb_Button>

        </div>

      </div>

    </div>
  );
};

export default OutBidBookDetails;