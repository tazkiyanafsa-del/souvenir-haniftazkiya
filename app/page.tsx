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

          <div className="text-yellow-500 text-6xl tracking-[12px] font-light flex items-center gap-5">

            <span>H</span>

            <span>|</span>

            <span>T</span>

          </div>

        </div>

        {/* SUBTITLE */}
        <p className="text-yellow-500 tracking-[8px] text-sm mb-5">
          THE WEDDING OF
        </p>

        {/* NAMA */}
        <h1
          className="text-[34px] md:text-[48px] text-white leading-none mb-10 opacity-95"
          style={{
            fontFamily: "cursive",
          }}
        >
          Hanif & Tazkiya
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

        {/* INPUT TITLE */}
        <p
          className="text-white text-[20px] mb-6"
          style={{
            fontFamily: "serif",
          }}
        >
          Masukkan Kode Unik Anda
        </p>

        {/* INPUT */}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="KODE UNIK"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="w-full bg-[#F5F0E8] text-[#6B0018] tracking-[6px] text-xl text-center rounded-[28px] p-5 outline-none uppercase mb-6"
        />

        {/* BUTTON */}
        <button
          onClick={handleClaim}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-[#6B0018] font-semibold text-2xl py-5 rounded-[28px] hover:opacity-90 transition"
          style={{
            fontFamily: "serif",
          }}
        >
          Klaim Souvenir
        </button>

        {/* ORNAMEN BAWAH */}
        <div className="flex items-center justify-center gap-3 mt-10 mb-2">

          <div className="w-20 h-[1px] bg-yellow-600"></div>

          <div className="text-yellow-500 text-2xl">
            ❀
          </div>

          <div className="w-20 h-[1px] bg-yellow-600"></div>

        </div>

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