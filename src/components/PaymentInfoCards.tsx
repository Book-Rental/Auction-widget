import React from "react";
import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import {
  Receipt,
  CalendarDays,
  CreditCard,
} from "lucide-react";

const PaymentInfoCards: React.FC = () => {
  const cards = [
    {
      icon: Receipt,
      title: "Order ID",
      value: "RBK12345678",
      subText: "Placed on 20 May 2024, 10:30 AM",
      iconClass: "bg-blue-50 text-blue-600",
      valueClass: "text-blue-600",
    },
    {
      icon: CalendarDays,
      title: "Estimated Delivery",
      value: "27 May – 30 May 2024",
      subText: "Bengaluru, Karnataka",
      iconClass: "bg-green-50 text-green-600",
      valueClass: "text-green-600",
    },
    {
      icon: CreditCard,
      title: "Payment Method",
      value: "Paid in full",
      subText: "UPI / Card ending 2048",
      iconClass: "bg-purple-50 text-purple-600",
      valueClass: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="flex items-center gap-4 rounded-lg border border-[#E5E7EB] bg-white p-4"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconClass}`}
            >
              <Icon size={22} />
            </div>

            <div>
              <Rb_Text
                
                className="text-[10px] text-gray-500"
              >
                {card.title}
              </Rb_Text>

              <Rb_Text
                
                className={`mt-1 font-semibold ${card.valueClass}`}
              >
                {card.value}
              </Rb_Text>

              <Rb_Text
                
                className="mt-1 text-[9px] text-gray-500"
              >
                {card.subText}
              </Rb_Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentInfoCards;