import { Bell } from "lucide-react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";

type MyBidRowProps = {
  image: string;
  title: string;
  author: string;
  label: string;
  value: string;
  date: string;
  buttonText: string;
  buttonVariant?: "primary" | "secondary" | "success";
  showBell?: boolean;
};

const MyBidRow = ({
  image,
  title,
  author,
  label,
  value,
  date,
  buttonText,
  buttonVariant = "secondary",
  showBell = false,
}: MyBidRowProps) => {
  return (
    <div className="grid grid-cols-12 items-center border-b py-5 last:border-none">
      <div className="col-span-5 flex items-center gap-4">
        <img
          src={image}
          alt={title}
          className="h-20 w-14 rounded border object-cover"
        />

        <div>
          <h3 className="font-semibold text-[#1B1530]">{title}</h3>

          <p className="mt-1 text-sm text-gray-500">
            by {author}
          </p>
        </div>
      </div>

      <div className="col-span-2">
        <p className="text-xs text-gray-500">{label}</p>

        <p className="mt-1 text-xl font-semibold">
          {value}
        </p>
      </div>

      <div className="col-span-2">
        <p className="text-xs text-gray-500">
          {label.includes("Won") ? "Won on" : "Ends in"}
        </p>

        <p className="mt-1 font-medium">{date}</p>
      </div>

      <div className="col-span-3 flex items-center justify-end gap-4">
        <Rb_Button
          variant={
            buttonVariant === "success"
              ? "primary"
              : "secondary"
          }
          className={
            buttonVariant === "success"
              ? "!bg-green-100 !text-green-700 !border-green-300"
              : ""
          }
        >
          {buttonText}
        </Rb_Button>

        {showBell && (
          <Bell
            size={18}
            className="cursor-pointer text-gray-500"
          />
        )}
      </div>
    </div>
  );
};

export default MyBidRow;