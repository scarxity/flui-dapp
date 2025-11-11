"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";

import { useNetworkVariable } from "@/app/networkConfig";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

type FormState = {
  name: string;
  target: string;
  desc: string;
  token: string;
};

const initialFormState: FormState = {
  name: "",
  target: "",
  desc: "",
  token: "SUI",
};

const COIN_TYPE_MAP: Record<string, string> = {
  SUI: "0x2::sui::SUI",
};

const MIST_PER_SUI = BigInt(1_000_000_000);
const MAX_TARGET_SUI = BigInt(1000000);
const MAX_TARGET_MIST = MIST_PER_SUI * MAX_TARGET_SUI;

function parseSuiAmount(value: string): {
  amount: bigint | null;
  error?: string;
} {
  const trimmed = value.trim();
  if (!trimmed) {
    return { amount: null, error: "Target fund is required." };
  }

  if (!/^\d+(?:\.\d+)?$/.test(trimmed)) {
    return {
      amount: null,
      error: "Target fund must be a valid number in SUI.",
    };
  }

  const [wholePart, fractionPartRaw = ""] = trimmed.split(".");

  if (fractionPartRaw.length > 9) {
    return {
      amount: null,
      error: "Target fund supports up to 9 decimal places (1 SUI = 10^9 MIST).",
    };
  }

  const whole = BigInt(wholePart);
  const fraction =
    fractionPartRaw.length > 0
      ? BigInt(fractionPartRaw.padEnd(9, "0"))
      : BigInt(0);

  const amount = whole * MIST_PER_SUI + fraction;

  return { amount };
}

export default function CreateEvent() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const crowdfundingPackageId = useNetworkVariable("crowdfundingPackageId");
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute, isPending } =
    useSignAndExecuteTransaction();

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showErrorToast("Image size must be less than 5MB.");
      event.target.value = ""; // Reset input
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setImage(file);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImagePreview(null);
  };

  const uploadImageToIPFS = async () => {
    try {
      if (!image) {
        showErrorToast("No file selected");
        return null;
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = image.name.split(".").pop();
      const uniqueFilename = `event-${timestamp}-${randomString}.${fileExtension}`;

      const renamedFile = new File([image], uniqueFilename, {
        type: image.type,
      });

      const data = new FormData();
      data.set("image", renamedFile);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      return signedUrl;
    } catch (e) {
      console.log(e);
      showErrorToast("Trouble uploading file to IPFS");
      return null;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.target.trim() || !form.desc.trim()) {
      showErrorToast("Please fill in all required fields.");
      return;
    }

    if (!crowdfundingPackageId) {
      showErrorToast(
        "Crowdfunding package ID is not configured for this network.",
      );
      return;
    }

    const coinType = COIN_TYPE_MAP[form.token];
    if (!coinType) {
      showErrorToast("Selected token is not supported yet.");
      return;
    }

    const { amount: targetAmount, error: amountError } = parseSuiAmount(
      form.target,
    );

    if (targetAmount === null) {
      showErrorToast(amountError ?? "Invalid target fund amount.");
      return;
    }

    if (targetAmount <= BigInt(0)) {
      showErrorToast("Target fund must be greater than zero.");
      return;
    }

    if (targetAmount > MAX_TARGET_MIST) {
      showErrorToast(
        `Target fund cannot exceed ${MAX_TARGET_SUI.toString()} SUI.`,
      );
      return;
    }

    const uploadedUrl = await uploadImageToIPFS();
    if (!uploadedUrl) {
      showErrorToast("Failed to upload image. Please try again.");
      return;
    }

    const tx = new Transaction();
    tx.moveCall({
      target: `${crowdfundingPackageId}::crowdfunding::create`,
      typeArguments: [coinType],
      arguments: [
        tx.pure.string(form.name.trim()),
        tx.pure.string(form.desc.trim()),
        tx.pure.string(uploadedUrl),
        tx.pure.u64(targetAmount),
      ],
    });

    try {
      const executionResult = await signAndExecute({ transaction: tx });
      const { digest } = executionResult;

      await suiClient.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });

      showSuccessToast(`Event "${form.name}" created successfully!`);
      resetForm();
      router.push("/explore");
    } catch (error) {
      console.error("Failed to create event", error);
      showErrorToast("Failed to create event. Please try again.");
    }
  };

  const submitLabel = useMemo(() => {
    if (isPending) {
      return "Submitting...";
    }
    return "Submit Event";
  }, [isPending]);

  return (
    <section className="min-h-screen bg-black text-white px-6 md:px-20 py-28 lg:py-24 relative overflow-hidden">
      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-white mb-6 flex items-center space-x-2"
        type="button"
      >
        <span className="text-xl">←</span>
        <span>Back</span>
      </button>

      <div className="flex flex-col lg:flex-row items-start justify-between gap-10 relative">
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="text-5xl font-bold mb-4">Create Event</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Event Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event name..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Target Fund</label>
              <input
                type="number"
                name="target"
                value={form.target}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter target fund amount (in SUI, max 1,000,000)..."
                min="0"
                max="1000000"
                step="0.000000001"
                inputMode="decimal"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">
                Event Description
              </label>
              <textarea
                name="desc"
                rows={3}
                value={form.desc}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a short event description..."
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Event Image</label>
              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative w-auto h-64 bg-gray-800 rounded-md overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <label className="block">
                  <span className="sr-only">Choose image file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-600 file:text-white
                      hover:file:bg-blue-700
                      file:cursor-pointer cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Token</label>
              <select
                name="token"
                value={form.token}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SUI">SUI</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-md text-white font-medium transition-all shadow-md shadow-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
