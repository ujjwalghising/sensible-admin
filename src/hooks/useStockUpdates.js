// src/hooks/useStockUpdates.js

import { useEffect } from "react";

const useStockUpdates = (onStockUpdate) => {
  useEffect(() => {
    const eventSource = new EventSource("/api/products/sse/stock-updates");

    eventSource.onmessage = (event) => {
      const updatedProduct = JSON.parse(event.data);
      onStockUpdate(updatedProduct);  // Trigger callback to update UI
    };

    // Close the connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [onStockUpdate]);
};

export default useStockUpdates;
