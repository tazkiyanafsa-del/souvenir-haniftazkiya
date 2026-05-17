"use client";

import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import { supabase } from "../lib/supabase";

export default function ScannerPage() {

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleScan(
    code: string
  ) {

    if (loading) return;

    setLoading(true);

    const { data, error } =
      await supabase
        .from("guests")
        .select("*")
        .eq(
          "code",
          code.toUpperCase()
        )
        .single();

    if (error || !data) {

      setMessage(
        "❌ Kode tidak ditemukan"
      );

      setTimeout(() => {
        setLoading(false);
      }, 2000);

      return;
    }

    if (data.claimed) {

      setMessage(
        `⚠️ ${data.name} sudah claim souvenir`
      );

      setTimeout(() => {
        setLoading(false);
      }, 2000);

      return;
    }

    await supabase
      .from("guests")
      .update({
        claimed: true,
        claimed_at:
          new Date().toISOString(),
      })
      .eq(
        "code",
        code.toUpperCase()
      );

    setMessage(
      `✅ ${data.name} berhasil claim souvenir`
    );

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  return (

    <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md bg-[#8B0020] border border-yellow-700 rounded-[40px] p-6 text-center shadow-2xl relative overflow-hidden">

        {/* ORNAMEN */}
        <div className="absolute top-4 left-4 text-yellow-700 text-2xl opacity-40">
          ❀
        </div>

        <div className="absolute top-4 right-4 text-yellow-700 text-2xl opacity-40">
          ❀
        </div>

        <div className="absolute bottom-4 left-4 text-yellow-700 text-2xl opacity-40">
          ❀
        </div>

        <div className="absolute bottom-4 right-4 text-yellow-700 text-2xl opacity-40">
          ❀
        </div>

        {/* BORDER */}
        <div className="absolute inset-3 border border-yellow-700 rounded-[32px] pointer-events-none"></div>

        {/* TITLE */}
        <p className="text-yellow-500 tracking-[8px] text-sm mb-4 mt-4">

          SCAN BARCODE

        </p>

        <h1 className="text-[34px] text-white leading-[1.25] mb-10 px-2 font-semibold">

          <div>Wedding</div>

          <div>Souvenir</div>

        </h1>

        {/* SCANNER */}
        <div className="overflow-hidden rounded-[28px] border-4 border-yellow-700 mb-6">

          <BarcodeScanner
            width={500}
            height={500}
            onUpdate={(err, result) => {

              if (result) {

                handleScan(
                  result.getText()
                );

              }
            }}
          />

        </div>

        {/* MESSAGE */}
        {message && (

          <div className="bg-[#76001F] border border-yellow-600 rounded-[24px] p-5 mt-4">

            <p className="text-white text-lg leading-relaxed">

              {message}

            </p>

          </div>

        )}

        <p className="text-yellow-500 text-sm mt-6 opacity-80">

          Hanif & Tazkiya

        </p>

      </div>

    </main>
  );
}