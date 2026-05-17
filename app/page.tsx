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

    setMessage(
      `Terima kasih ${data.name}, souvenir berhasil di-claim ❤️`
    );

    setCode("");
  }

  return (
    <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-sm bg-[#8B0020] border border-yellow-700 rounded-[40px] p-5 text-center shadow-2xl relative overflow-hidden">

        {/* BORDER DALAM */}
        <div className="absolute inset-3 border border-yellow-700 rounded-[32px] pointer-events-none"></div>

        {/* ORNAMEN */}
        <div className="absolute top-5 left-5 text-yellow-700 opacity-40 text-2xl">
          ❀
        </div>

        <div className="absolute top-5 right-5 text-yellow-700 opacity-40 text-2xl">
          ❀
        </div>

        {/* LOGO */}
        <div className="w-44 h-44 mx-auto border border-yellow-600 rounded-full flex items-center justify-center mt-8 mb-10">

          <div className="text-yellow-500 text-6xl tracking-[12px] font-light">
            H | T
          </div>

        </div>

        {/* SUBTITLE */}
        <p className="text-yellow-500 tracking-[8px] text-sm mb-5">
          THE WEDDING OF
        </p>

        {/* NAMA */}
        <h1 className="text-[20px] md:text-3xl italic text-white leading-[1.2] mb-8 opacity-80">

          <div>Hanif &</div>

          <div>Tazkiya</div>

        </h1>

        {/* TANGGAL */}
        <div className="flex items-center justify-center gap-3 mb-10">

          <div className="w-14 h-[1px] bg-yellow-500"></div>

          <p className="text-yellow-500 tracking-[3px] text-lg">
            02 AGUSTUS 2026
          </p>

          <div className="w-14 h-[1px] bg-yellow-500"></div>

        </div>

        {/* ORNAMEN */}
        <div className="text-yellow-500 text-4xl mb-8">
          ✦
        </div>

        {/* INPUT */}
        <p className="text-white text-2xl mb-6">
          Masukkan Kode Unik Anda
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="KODE UNIK"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="w-full bg-[#F5F0E8] text-black text-2xl text-center rounded-[28px] p-5 outline-none uppercase mb-5"
        />

        {/* BUTTON */}
        <button
          onClick={handleClaim}
          className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-bold text-xl py-5 rounded-[28px] hover:opacity-90 transition"
        >
          Klaim Souvenir
        </button>

        {/* MESSAGE */}
        {message && (
          <div className="mt-6 bg-[#76001F] border border-yellow-600 rounded-[24px] p-4">

            <p className="text-white text-lg">
              {message}
            </p>

          </div>
        )}
      </div>
    </main>
  );
}