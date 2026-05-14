"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  async function handleClaim() {
    if (!code) {
      setMessage("Masukkan kode unik terlebih dahulu");
      return;
    }

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("code", code.toUpperCase())
      .single();

    if (error || !data) {
      setMessage("Kode tidak ditemukan");
      return;
    }

    if (data.claimed) {
      setMessage("Souvenir sudah pernah diambil");
      return;
    }

    await supabase
      .from("guests")
      .update({
        claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .eq("code", code.toUpperCase());

    setMessage(`Terima kasih ${data.name}, souvenir berhasil di-claim ❤️`);

    setCode("");
  }

  return (
    <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-[#8B0020] border border-yellow-600 rounded-[40px] p-6 text-center shadow-2xl">

        {/* INISIAL */}
        <div className="w-36 h-36 mx-auto border border-yellow-600 rounded-full flex items-center justify-center mb-8">
          <div className="text-yellow-500 text-5xl font-light leading-tight">
            <div className="flex justify-center gap-3">
              <span>H</span>
              <span>T</span>
            </div>
          </div>
        </div>

        {/* TITLE */}
        <p className="text-yellow-500 tracking-[8px] text-sm mb-5">
          THE WEDDING OF
        </p>

        {/* NAMA */}
        <h1 className="text-3xl md:text-4xl italic text-white px-4 mb-6 leading-tight">
          Hanif & Tazkiya
        </h1>

        {/* GARIS */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-[1px] bg-yellow-500"></div>

          <div>
            <p className="text-yellow-500 tracking-[4px] text-lg">
              02 AGUSTUS
            </p>

            <p className="text-yellow-500 text-xl mt-1">
              2026
            </p>
          </div>

          <div className="w-12 h-[1px] bg-yellow-500"></div>
        </div>

        {/* FORM */}
        <div className="mt-10">
          <p className="text-white mb-4 text-sm">
            Masukkan Kode Unik Anda
          </p>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="KODE UNIK"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full p-4 rounded-2xl text-center text-black outline-none mb-4 uppercase"
          />

          <button
            onClick={handleClaim}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition"
          >
            Klaim Souvenir
          </button>

          {message && (
            <p className="text-white mt-5 text-sm">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}