import React, { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios"; // to make HTTP requests
import CandlestickChart from "./components/CandlestickChart";
import OrderBook from "./components/OrderBook";

const App = () => {
  const [candlestickData, setCandlestickData] = useState([]);
  const [orderBookData, setOrderBookData] = useState({});

  // Function to fetch the initial candlestick data from the backend
  const fetchInitialCandlestickData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/candlestick");
      const candlestickUpdate = response.data;
      const transformedData = candlestickUpdate.result.list.map((item) => ({
        timestamp: parseInt(item[0]), // timestamp in ms
        open: parseFloat(item[1]), // open price
        high: parseFloat(item[2]), // high price
        low: parseFloat(item[3]), // low price
        close: parseFloat(item[4]), // close price
        volume: parseFloat(item[5]), // volume
      }));
      setCandlestickData(transformedData);
    } catch (error) {
      console.error("Error fetching initial candlestick data:", error);
    }
  };

  useEffect(() => {
    // Fetch initial candlestick data when the component mounts
    fetchInitialCandlestickData();

    // Set up the WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    // Connect to the WebSocket
    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);

      // Subscribe to the candlestick topic for live updates
      stompClient.subscribe("/topic/candlestick", (message) => {
        const candlestickUpdate = JSON.parse(message.body);

        // Transform the incoming candlestick data to fit klinechart's structure
        const transformedData = candlestickUpdate.result.list.map((item) => ({
          timestamp: parseInt(item[0]), // timestamp in ms
          open: parseFloat(item[1]), // open price
          high: parseFloat(item[2]), // high price
          low: parseFloat(item[3]), // low price
          close: parseFloat(item[4]), // close price
          volume: parseFloat(item[5]), // volume
        }));

        // Update the candlestick data with live updates
        setCandlestickData((prevData) => [...prevData, ...transformedData]);
      });

      // Subscribe to the order book topic for live updates
      stompClient.subscribe("/topic/orderbook", (message) => {
        const orderBookUpdate = JSON.parse(message.body);
        // Update order book data
        setOrderBookData({
          bids: orderBookUpdate.result.b,
          asks: orderBookUpdate.result.a,
        });
      });
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1>SOL/USDT Trading Data</h1>
      <div>
        <h2>Candlestick Chart</h2>
        <CandlestickChart data={candlestickData} />
      </div>
      <div>
        <h2>Order Book</h2>
        <OrderBook data={orderBookData} />
      </div>
    </div>
  );
};

export default App;
