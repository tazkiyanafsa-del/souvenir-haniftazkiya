"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [success, setSuccess] = useState(false);

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
      return setMessage("USED");
    }

    await supabase
      .from("guests")
      .update({
        claimed: true,
        claimed_at: new Date().toISOString(),
      })
      .eq("code", code.toUpperCase());

    setGuestName(data.name);

    setSuccess(true);

    setCode("");
  }

  // =========================
  // SUCCESS PAGE
  // =========================
  if (success) {
    return (
      <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4 py-6">

        <div className="w-full max-w-sm bg-[#8B0020] border border-[#C9A227] rounded-[42px] p-8 text-center shadow-2xl relative overflow-hidden">

          {/* BORDER DALAM */}
          <div className="absolute inset-3 border border-[#C9A227]/70 rounded-[34px] pointer-events-none"></div>

          {/* CHECK ICON */}
          <div className="w-28 h-28 mx-auto rounded-full border border-[#D4AF37] flex items-center justify-center mb-8 mt-2">

            <div className="text-[#E7C65A] text-6xl leading-none">
              ✓
            </div>

          </div>

          {/* SAPAAN */}
          <h1
            className="text-white text-[48px] leading-tight mb-5"
            style={{
              fontFamily: "Times New Roman",
            }}
          >
            Halo{" "}
            <span className="text-[#E7C65A]">
              {guestName}
            </span>
          </h1>

          {/* TERIMAKASIH */}
          <p
            className="text-white/90 text-[22px] leading-relaxed mb-10"
            style={{
              fontFamily: "serif",
            }}
          >
            Terimakasih sudah menyempatkan hadir
          </p>

          {/* ICON HADIAH */}
          <div className="text-[92px] mb-8 drop-shadow-lg">
            🎁
          </div>

          {/* ORNAMEN GARIS */}
          <div className="flex items-center justify-center gap-3 mb-8">

            <div className="w-16 h-[1px] bg-[#D4AF37] opacity-70"></div>

            <div className="text-[#E7C65A] text-sm">
              ✦
            </div>

            <div className="w-16 h-[1px] bg-[#D4AF37] opacity-70"></div>

          </div>

          {/* TEXT BESAR */}
          <h2
            className="text-white text-[20px] leading-[1.45] tracking-[2px] font-semibold"
            style={{
              fontFamily: "Times New Roman",
            }}
          >
            <div>SILAHKAN AMBIL</div>

            <div>SOUVENIR ANDA</div>
          </h2>

        </div>

      </main>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================
  return (
    <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4 py-6">

      {/* USED PAGE */}
      {message === "USED" && (

        <div className="fixed inset-0 bg-[#7A0019] flex items-center justify-center px-4 z-50">

          <div className="w-full max-w-[280px] bg-[#8B0020] border border-[#B8860B] rounded-[30px] p-8 text-center relative shadow-2xl">

            <div className="absolute inset-3 border border-[#B8860B] rounded-[22px] opacity-40"></div>

            <div className="text-white text-6xl mb-5 opacity-80">
              ✕
            </div>

            <h2 className="text-white text-[30px] leading-tight font-semibold mb-4">
              Souvenir Sudah
              <br />
              Pernah Diambil
            </h2>

            <p className="text-white/70 text-sm">
              Kode ini sudah digunakan.
            </p>

          </div>

        </div>

      )}

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

          <div
            className="text-yellow-500 text-5xl flex items-center gap-4"
            style={{
              fontFamily: "Times New Roman",
            }}
          >

            <span>H</span>

            <span className="opacity-80">|</span>

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

          <p className="text-yellow-500 tracking-[2px] text-[16px] whitespace-nowrap opacity-90">
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

      </div>
    </main>
  );
}