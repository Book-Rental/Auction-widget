import {
    Modal,
    Rb_Button,
    Rb_Text,
} from "@rentbook/rentbook-ui-lib";

interface ConfirmBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;

    bidAmount: number;
    bookTitle: string;
    currentHighestBid: number;
    auctionEndsIn?: string;

    isSubmitting?: boolean;
}

const ConfirmBidModal = ({
    isOpen,
    onClose,
    onConfirm,
    bidAmount,
    bookTitle,
    currentHighestBid,
    auctionEndsIn = "2d 14h 20m 45s",
    isSubmitting = false,
}: ConfirmBidModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                if (!isSubmitting) {
                    onClose();
                }
            }}
            className="max-w-[520px] rounded-2xl"
        >
            {/* Top */}
            <div className="px-8 pb-4 pt-8 text-center">
                <Rb_Text
                    variant="h2"
                    className="mt-5 font-bold text-[#1B1530]"
                >
                    Confirm Your Bid
                </Rb_Text>

                <Rb_Text
                    variant="p"
                    className="mt-3 text-gray-500"
                >
                    You are about to place a
                    bid of
                </Rb_Text>

                {/* Bid Amount */}
                <Rb_Text
                    variant="h1"
                    className="mt-3 !text-3xl font-semibold text-[#2454FF]"
                >
                    ₹
                    {bidAmount.toFixed(2)}
                </Rb_Text>

                {/* Book */}
                <Rb_Text
                    variant="h5"
                    className="mt-3 font-semibold text-[#1B1530]"
                >
                    on {bookTitle}
                </Rb_Text>
            </div>

            <hr />

            {/* Details */}
            <div className="space-y-4 px-8 py-6">
                <div className="flex justify-between">
                    <Rb_Text
                        variant="p"
                        className="text-gray-500"
                    >
                        Current Highest Bid
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="font-semibold"
                    >
                        ₹
                        {currentHighestBid.toFixed(
                            2
                        )}
                    </Rb_Text>
                </div>

                <div className="flex justify-between">
                    <Rb_Text
                        variant="p"
                        className="text-gray-500"
                    >
                        Auction Ends In
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="font-semibold"
                    >
                        {auctionEndsIn}
                    </Rb_Text>
                </div>
            </div>

            <hr />

            {/* Footer */}
            <div className="m-6 flex gap-4">
                <Rb_Button
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    Cancel
                </Rb_Button>

                <Rb_Button
                    variant="primary"
                    className="flex-1"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Placing Bid..."
                        : "Confirm Bid"}
                </Rb_Button>
            </div>
        </Modal>
    );
};

export default ConfirmBidModal;