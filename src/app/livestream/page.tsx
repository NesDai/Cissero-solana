"use client";

import { useEffect } from "react";

export default function LivestreamPage() {
  useEffect(() => {
    // Tabs functionality
    document.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        ["chat", "analyst", "results"].forEach((t) => {
          document
            .getElementById("tab-" + t)
            ?.classList.toggle("hidden", t !== tab);
          document
            .querySelector(`[data-tab="${t}"]`)
            ?.classList.toggle("bg-white", t === tab);
          document
            .querySelector(`[data-tab="${t}"]`)
            ?.classList.toggle("text-green-800", t === tab);
        });
      });
    });

    // Betting functionality
    let selected = null;
    function selectPlayer(id) {
      ["btn-player1", "btn-player2"].forEach((b) => {
        const el = document.getElementById(b);
        if (el) {
          el.classList.toggle("bg-green-500", b === id);
          el.classList.toggle("text-black", b === id);
        }
      });
      selected = id;
    }

    document
      .getElementById("btn-player1")
      ?.addEventListener("click", () => selectPlayer("btn-player1"));
    document
      .getElementById("btn-player2")
      ?.addEventListener("click", () => selectPlayer("btn-player2"));
    document.getElementById("submit-bet")?.addEventListener("click", () => {
      const amountEl = document.getElementById(
        "bet-amount"
      ) as HTMLInputElement;
      const balanceEl = document.getElementById("balance");

      if (!amountEl || !balanceEl) return;

      const amount = parseFloat(amountEl.value);
      const balance = parseFloat(balanceEl.innerText);

      if (!selected) return alert("Select a player");
      if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");
      if (amount > balance) return alert("Insufficient balance");

      alert(`Bet ${amount} SOL on ${selected.replace("btn-", "")}`);
      const submitBtn = document.getElementById(
        "submit-bet"
      ) as HTMLButtonElement;
      if (submitBtn) submitBtn.disabled = true;
    });
  }, []);

  return (
    <div className="w-[1920px] h-[1080px] bg-gradient-to-b from-black to-green-900 text-white text-[16px] overflow-hidden flex flex-col">
      {/* Navbar (64px) */}
      <header className="h-16 flex items-center">
        <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center px-0">
          <div className="text-white text-lg">Cissero</div>
          <nav className="flex items-center space-x-4">
            <a href="#" className="hover:underline">
              Home
            </a>
            <a href="#" className="hover:underline">
              Buy Tokens
            </a>
            <a href="#" className="hover:underline">
              Dashboard
            </a>
            <a href="#" className="hover:underline">
              Login
            </a>
            <button className="bg-white text-black px-3 py-1 rounded">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Content Area (1020px left for content) */}
      <div className="flex-1 flex gap-8 px-0">
        {/* Main Panel (Live + Chat) width 1200px centered, height 1020px */}
        <div className="max-w-[1200px] mx-auto w-full h-full flex flex-col space-y-8">
          {/* Top Row (Live & Chat) 720px height */}
          <div className="flex h-[720px] gap-8">
            {/* Live Stream */}
            <div className="flex-1 border border-green-500 rounded-xl overflow-hidden shadow-lg">
              <div className="w-full h-full bg-black flex items-center justify-center text-gray-300">
                Live Stream (Twitch Embed)
              </div>
            </div>
            {/* Chat/Analyst/Results */}
            <div className="w-[360px] border border-green-500 rounded-xl bg-black flex flex-col">
              <div className="flex">
                <button
                  data-tab="chat"
                  className="flex-1 py-2 text-center bg-white text-green-800 font-semibold rounded-tl-xl"
                >
                  Chat
                </button>
                <button
                  data-tab="analyst"
                  className="flex-1 py-2 text-center bg-green-800"
                >
                  Analyst
                </button>
                <button
                  data-tab="results"
                  className="flex-1 py-2 text-center bg-green-800 rounded-tr-xl"
                >
                  Results
                </button>
              </div>
              <div
                id="tab-chat"
                className="flex-1 p-4 space-y-4 overflow-y-auto"
              >
                {/* Chat messages */}
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">User A</span>
                      <span className="text-xs text-gray-400">2m ago</span>
                    </div>
                    <p className="mt-1 text-gray-200">Great match!</p>
                  </div>
                </div>
              </div>
              <div
                id="tab-analyst"
                className="hidden flex-1 p-4 space-y-4 overflow-y-auto"
              >
                {/* Analyst comments */}
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Analyst B</span>
                      <span className="text-xs text-gray-400">5m ago</span>
                    </div>
                    <p className="mt-1 text-gray-200">
                      Player 2 has a strong serve.
                    </p>
                  </div>
                </div>
              </div>
              <div
                id="tab-results"
                className="hidden flex-1 p-4 space-y-2 overflow-y-auto"
              >
                {/* Past Results list */}
                <h3 className="text-[20px] font-semibold text-center">
                  Past Results
                </h3>
                <ul className="space-y-2 text-[16px]">
                  <li>Match 1: Player 1 won</li>
                  <li>Match 2: Player 2 won</li>
                  <li>Match 3: Player 1 won</li>
                  <li>Match 4: Draw</li>
                </ul>
              </div>
              {/* Message Input */}
              <div className="p-3 border-t border-green-500">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full px-3 py-2 rounded-full bg-gray-700 text-white focus:outline-none text-[16px]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row (Bet & Ad) 280px height */}
          <div className="flex h-[280px] gap-8">
            {/* Betting Section */}
            <div className="flex-1 border border-green-500 rounded-xl bg-black p-4 space-y-3 flex flex-col justify-between">
              <h2 className="text-[20px] font-semibold">Place Your Bet</h2>
              <div className="flex items-center gap-2">
                <button
                  id="btn-player1"
                  className="flex-1 py-1 rounded-full border border-green-500 text-[16px]"
                >
                  Player 1
                </button>
                <button
                  id="btn-player2"
                  className="flex-1 py-1 rounded-full border border-green-500 text-[16px]"
                >
                  Player 2
                </button>
              </div>
              <div>
                <label className="block text-[16px] mb-1">
                  Bet Amount (SOL):
                </label>
                <input
                  id="bet-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.1"
                  className="w-full px-3 py-1 rounded-full bg-gray-700 text-white focus:outline-none text-[16px]"
                />
              </div>
              <div className="text-[14px] text-gray-400">
                Balance: <span id="balance">10.00 SOL</span>
              </div>
              <button
                id="submit-bet"
                className="bg-green-500 text-black font-semibold px-4 py-1 rounded-full w-full text-[16px]"
              >
                Submit Bet
              </button>
            </div>
            {/* Ad Placeholder */}
            <div className="w-[360px] border-dashed border-lime-400 bg-lime-200 text-black text-sm p-4 rounded flex items-center justify-center">
              Static ad (MVP placeholder)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
