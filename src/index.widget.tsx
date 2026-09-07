import { createRoot, Root } from "react-dom/client";
import App from "./App";
import "./index.css";

export interface AuctionWidgetOptions {
  containerElementId: string;
view: "auction" | "bidding" | "bid-success" | "my-bids" |"bids-details";
}

declare global {
  interface Window {
    renderReactWidget: (config: string) => void;
    unmountReactWidget: (containerId: string) => void;
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    HOST_USER_INFO: any;
  }
}

const roots: Record<string, Root> = {};
window.renderReactWidget = (config: string) => {
  let options: AuctionWidgetOptions;

  try {
    options = JSON.parse(config);
  } catch {
    return;
  }

  const container = document.getElementById(options.containerElementId);

  if (!container) {
    return;
  }

  if (roots[options.containerElementId]) {
    roots[options.containerElementId].unmount();
  }

  const root = createRoot(container);

  root.render(
        <App view={options.view}/>
  );

  roots[options.containerElementId] = root;
};

window.unmountReactWidget = (containerId: string) => {
  roots[containerId]?.unmount();
  delete roots[containerId];
};
