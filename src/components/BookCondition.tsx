import React from "react";
import {
  Rb_Radio,
  Rb_Text,
} from "@rentbook/rentbook-ui-lib";

interface BookConditionProps {
  condition: string;
  description: string;
  onConditionChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const conditions = [
  {
    value: "new",
    title: "New",
    description: "Just like new",
  },
  {
    value: "like-new",
    title: "Like New",
    description: "Minimal signs of use",
  },
  {
    value: "good",
    title: "Good",
    description: "Some signs of use",
  },
  {
    value: "fair",
    title: "Fair",
    description: "Noticeable wear",
  },
  {
    value: "poor",
    title: "Poor",
    description: "Heavily used",
  },
];

const BookCondition: React.FC<
  BookConditionProps
> = ({
  condition,
  description,
  onConditionChange,
  onDescriptionChange,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">

      <div className="mb-4 flex items-center gap-2">
        <span className="text-[#6841D8]">
          ♢
        </span>

        <Rb_Text
          variant="h4"
          className="text-lg font-semibold text-[#1B1530]"
        >
          Condition of the Book
        </Rb_Text>
      </div>

      <div className="grid grid-cols-5 gap-3">

        {conditions.map((item) => {
          const selected =
            condition === item.value;

          return (
            <label
              key={item.value}
              className={`cursor-pointer rounded-lg border p-3 ${
                selected
                  ? "border-[#6841D8] bg-purple-50"
                  : "border-gray-200"
              }`}
            >
              <Rb_Radio
                name="condition"
                value={item.value}
                checked={selected}
                onChange={() =>
                  onConditionChange(item.value)
                }
                radioSize="sm"
              />

              <div className="mt-2">
                <p className="text-xs font-semibold">
                  {item.title}
                </p>

                <p className="mt-1 text-[10px] text-gray-500">
                  {item.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium">
          Condition Description{" "}
          <span className="font-normal text-gray-500">
            (Optional)
          </span>
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            onDescriptionChange(e.target.value)
          }
          className="h-20 w-full resize-none rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-[#6841D8]"
          placeholder="Describe the condition of your book..."
          maxLength={300}
        />

        <div className="text-right text-[10px] text-gray-400">
          {description.length}/300
        </div>
      </div>
    </div>
  );
};

export default BookCondition;