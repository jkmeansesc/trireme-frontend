import React from "react";
import { OrderBook as LabOrderBook } from "@lab49/react-order-book";
import "../OrderBook.css";

const OrderBook = ({ data }) => {
  // Ensure bids and asks are defined
  const bids = (data?.bids || []).filter((bid) => bid && bid.length === 2);
  const asks = (data?.asks || []).filter((ask) => ask && ask.length === 2);

  // for troubleshooting
  console.log("Bids:", bids);
  console.log("Asks:", asks);

  const book = {
    asks: asks.map((ask) => [parseFloat(ask[0]), parseFloat(ask[1])]),
    bids: bids.map((bid) => [parseFloat(bid[0]), parseFloat(bid[1])]),
  };

  return (
    <div>
      {bids.length === 0 && asks.length === 0 ? (
        <p>No order book data available.</p>
      ) : (
        <LabOrderBook
          book={book}
          applyBackgroundColor={false}
          fullOpacity={false}
          listLength={10}
          showHeaders={false}
          showSpread={false}
        />
      )}
    </div>
  );
};

export default OrderBook;
