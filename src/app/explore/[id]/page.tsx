"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { Transaction } from "@mysten/sui/transactions";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { suiClient } from "@/lib/suiClient";
import { useNetworkVariable } from "@/app/networkConfig";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

const MIST_PER_SUI = BigInt(1_000_000_000);

function formatSuiAmount(mist: string | number): string {
  try {
    const amount = BigInt(mist);
    const sui = Number(amount) / Number(MIST_PER_SUI);
    return sui.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch {
    return "0.00";
  }
}

function parseSuiAmount(value: string): bigint | null {
  try {
    const trimmed = value.trim();
    if (!trimmed || !/^\d+(?:\.\d+)?$/.test(trimmed)) return null;

    const [wholePart, fractionPartRaw = ""] = trimmed.split(".");
    if (fractionPartRaw.length > 9) return null;

    const whole = BigInt(wholePart);
    const fraction =
      fractionPartRaw.length > 0
        ? BigInt(fractionPartRaw.padEnd(9, "0"))
        : BigInt(0);

    return whole * MIST_PER_SUI + fraction;
  } catch {
    return null;
  }
}

interface EventData {
  owner: string;
  name: string;
  description: string;
  image_ref: string;
  current_amount: string;
  target_amount: string;
  isOpen: boolean;
}

export default function EventDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [hasWithdrawn, setHasWithdrawn] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const crowdfundingPackageId = useNetworkVariable("crowdfundingPackageId");
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute, isPending } =
    useSignAndExecuteTransaction();

  const isOwner = useMemo(() => {
    if (!currentAccount || !event) return false;
    return currentAccount.address === event.owner;
  }, [currentAccount, event]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventObject = await suiClient.getObject({
          id,
          options: {
            showContent: true,
          },
        });

        if (eventObject.data?.content?.dataType === "moveObject") {
          const fields = eventObject.data.content
            .fields as unknown as EventData;
          setEvent(fields);
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        showErrorToast("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    const checkWithdrawalStatus = async () => {
      if (!crowdfundingPackageId) return;

      try {
        const withdrawEvents = await suiClient.queryEvents({
          query: {
            MoveEventType: `${crowdfundingPackageId}::crowdfunding::FundsWithdrawn<0x2::sui::SUI>`,
          },
        });

        // Check if there's a withdrawal event for this specific event ID
        const hasWithdrawalForThisEvent = withdrawEvents.data.some((evt) => {
          const parsedJson = evt.parsedJson as { event_id: string };
          return parsedJson.event_id === id;
        });

        setHasWithdrawn(hasWithdrawalForThisEvent);
      } catch (error) {
        console.error("Failed to check withdrawal status:", error);
      }
    };

    checkWithdrawalStatus();
  }, [id, crowdfundingPackageId, suiClient]);

  const progress = useMemo(() => {
    if (!event) return 0;
    const current = Number(event.current_amount);
    const target = Number(event.target_amount);
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  }, [event]);

  const handleContribute = async () => {
    if (!event) {
      showErrorToast("Event not loaded.");
      return;
    }

    if (!event.isOpen) {
      showErrorToast("This event is closed for donations.");
      return;
    }

    const donationAmount = parseSuiAmount(amount);
    if (!donationAmount || donationAmount <= BigInt(0)) {
      showErrorToast("Please enter a valid donation amount in SUI.");
      return;
    }

    if (!crowdfundingPackageId) {
      showErrorToast("Package ID not configured.");
      return;
    }

    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(donationAmount)]);

      tx.moveCall({
        target: `${crowdfundingPackageId}::crowdfunding::donate`,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [coin, tx.object(id)],
      });

      const result = await signAndExecute({ transaction: tx });
      await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true },
      });

      showSuccessToast(`Successfully donated ${amount} SUI to ${event.name}!`);
      setAmount("");

      // Refresh event data
      const updatedEvent = await suiClient.getObject({
        id,
        options: { showContent: true },
      });
      if (updatedEvent.data?.content?.dataType === "moveObject") {
        setEvent(updatedEvent.data.content.fields as unknown as EventData);
      }
    } catch (error) {
      console.error("Donation failed:", error);
      showErrorToast("Failed to process donation. Please try again.");
    }
  };

  // executeClose runs the transaction to close the campaign (opened by modal)
  const executeClose = async () => {
    setShowCloseModal(false);

    if (!crowdfundingPackageId) {
      showErrorToast("Package ID not configured.");
      return;
    }

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${crowdfundingPackageId}::crowdfunding::close`,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [tx.object(id)],
      });

      const result = await signAndExecute({ transaction: tx });
      await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true },
      });

      showSuccessToast("Campaign closed successfully!");

      // Refresh event data
      const updatedEvent = await suiClient.getObject({
        id,
        options: { showContent: true },
      });
      if (updatedEvent.data?.content?.dataType === "moveObject") {
        setEvent(updatedEvent.data.content.fields as unknown as EventData);
      }
    } catch (error) {
      console.error("Close failed:", error);
      showErrorToast("Failed to close campaign. Please try again.");
    }
  };

  // executeWithdraw runs the withdraw transaction (opened by modal)
  const executeWithdraw = async () => {
    setShowWithdrawModal(false);

    if (!crowdfundingPackageId) {
      showErrorToast("Package ID not configured.");
      return;
    }

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${crowdfundingPackageId}::crowdfunding::withdraw`,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [tx.object(id)],
      });

      const result = await signAndExecute({ transaction: tx });
      await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true },
      });

      showSuccessToast("Funds withdrawn successfully!");
      setHasWithdrawn(true);

      // Refresh event data
      const updatedEvent = await suiClient.getObject({
        id,
        options: { showContent: true },
      });
      if (updatedEvent.data?.content?.dataType === "moveObject") {
        setEvent(updatedEvent.data.content.fields as unknown as EventData);
      }
    } catch (error) {
      console.error("Withdraw failed:", error);
      showErrorToast("Failed to withdraw funds. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Event not found.
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-20 py-24">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-white mb-6 flex items-center space-x-2"
      >
        <span className="text-xl">←</span>
        <span>Back</span>
      </button>

      {/* Layout utama */}
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10 max-w-full">
        {/* Gambar kiri */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[400px]">
            <Image
              src={event.image_ref || "/images/shape.png"}
              alt={event.name}
              fill
              className="rounded-xl object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Konten kanan */}
        <div className="flex-1 space-y-6 w-full lg:w-auto">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 break-words">
              {event.name}
            </h1>
            <p className="text-gray-400 text-base sm:text-lg break-all">
              By {event.owner.slice(0, 6)}...{event.owner.slice(-4)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Status:{" "}
              <span
                className={event.isOpen ? "text-green-400" : "text-red-400"}
              >
                {event.isOpen ? "Open" : "Closed"}
              </span>
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-300 text-sm">Progress</p>
              <p className="text-sm text-gray-400">
                {formatSuiAmount(event.current_amount)} /{" "}
                {formatSuiAmount(event.target_amount)} SUI
              </p>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-5">
              <div
                className="bg-gradient-to-r from-sky-500 to-indigo-600 h-5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {progress.toFixed(1)}% funded
            </p>
          </div>

          {/* Deskripsi */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Event Description
            </h2>
            <p className="text-gray-400 leading-relaxed break-words">
              {event.description}
            </p>
          </div>

          {/* Owner Controls */}
          {isOwner && (
            <div className="pt-4 border-t border-gray-800 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-yellow-400">
                Campaign Owner Controls
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setShowCloseModal(true)}
                  disabled={!event.isOpen || isPending}
                  className="w-full sm:w-auto px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Processing..." : "Close Campaign"}
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={event.isOpen || isPending || hasWithdrawn}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending
                    ? "Processing..."
                    : hasWithdrawn
                      ? "Already Withdrawn"
                      : "Withdraw Funds"}
                </button>
              </div>
              <p className="text-sm text-gray-400">
                {hasWithdrawn
                  ? "✅ Funds have already been withdrawn from this campaign."
                  : event.isOpen
                    ? "Close the campaign first to enable withdrawals."
                    : "Campaign is closed. You can now withdraw funds."}
              </p>
            </div>
          )}

          {/* Form Donasi */}
          <div className="pt-4 space-y-4 w-full">
            <h3 className="text-lg sm:text-xl font-semibold">
              Contribute to this project
            </h3>

            {/* Jumlah Donasi */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Amount (SUI)
              </label>
              <input
                type="number"
                placeholder="Enter amount in SUI..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.000000001"
                disabled={!event.isOpen || isPending}
                className="bg-gray-800 border border-gray-700 text-gray-200 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Tombol Contribute */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                onClick={handleContribute}
                disabled={!event.isOpen || isPending}
                className="w-full sm:w-auto px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md font-medium transition-all shadow-md shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Processing..." : "Contribute"}
              </button>
              <button
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-2 border border-gray-600 hover:border-blue-500 rounded-md font-medium transition-all text-gray-300 hover:text-blue-400"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modals */}
      <ConfirmModal
        isOpen={showCloseModal}
        title="Close Campaign"
        description="Are you sure you want to close this campaign? Closing will prevent further donations."
        confirmText="Close"
        cancelText="Cancel"
        onConfirm={executeClose}
        onCancel={() => setShowCloseModal(false)}
        loading={isPending}
      />

      <ConfirmModal
        isOpen={showWithdrawModal}
        title="Withdraw Funds"
        description="Withdraw all funds from this campaign to your account. This action cannot be undone."
        confirmText="Withdraw"
        cancelText="Cancel"
        onConfirm={executeWithdraw}
        onCancel={() => setShowWithdrawModal(false)}
        loading={isPending}
      />
    </section>
  );
}
