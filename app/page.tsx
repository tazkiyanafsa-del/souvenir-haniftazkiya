"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<
    "idle" | "success" | "claimed" | "not-found"
  >("idle");

  const [guestName, setGuestName] = useState("");

  async function handleClaim() {
    if (!code) return;

    const upperCode = code.toUpperCase();

    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("code", upperCode)
      .single();

    if (error || !data) {
      setStatus("not-found");
      return;
    }

    setGuestName(data.name);

    if (data.claimed) {
      setStatus("claimed");
      return;
    }

    await supabase
      .from("guests")
      .update({
        claimed: true,
        claimed_at: new Date(),
      })
      .eq("code", upperCode);

    setStatus("success");
  }

  return (
    <main className="min-h-screen bg-[#5B0015] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-red-900 blur-3xl opacity-40 rounded-full"></div>

      {/* CARD */}
      <div className="relative w-full max-w-sm border border-yellow-700 rounded-[40px] bg-gradient-to-b from-[#76001F] to-[#5B0015] p-8 text-center shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden">

        {/* BORDER DALAM */}
        <div className="absolute inset-3 border border-yellow-700 rounded-[32px] opacity-40"></div>

        {/* ORNAMEN */}
        <div className="absolute top-4 left-4 text-yellow-700 text-4xl opacity-30">
          ❁
        </div>

        <div className="absolute top-4 right-4 text-yellow-700 text-4xl opacity-30">
          ❁
        </div>

        <div className="absolute bottom-4 left-4 text-yellow-700 text-4xl opacity-30">
          ❁
        </div>

        <div className="absolute bottom-4 right-4 text-yellow-700 text-4xl opacity-30">
          ❁
        </div>

        {/* CONTENT */}
        <div className="relative z-10">

          {/* SUCCESS */}
          {status === "success" && (
            <>
              <div className="text-yellow-500 text-7xl mb-6">
                ✓
              </div>

              <h1 className="text-[#F8F3EA] text-4xl mb-4 italic">
                Halo {guestName}
              </h1>

              <p className="text-[#F8F3EA] text-xl leading-relaxed mb-8">
                Terimakasih sudah menyempatkan hadir
              </p>

              <div className="text-7xl mb-8">
                🎁
              </div>

              <h2 className="text-[#F8F3EA] text-4xl leading-tight">
                SILAHKAN AMBIL
                <br />
                SOUVENIR ANDA
              </h2>
            </>
          )}

          {/* CLAIMED */}
          {status === "claimed" && (
            <>
              <div className="text-red-400 text-7xl mb-6">
                ✕
              </div>

              <h1 className="text-[#F8F3EA] text-4xl mb-6">
                Souvenir Sudah
                <br />
                Pernah Diambil
              </h1>

              <p className="text-red-200 text-xl">
                Kode ini sudah digunakan.
              </p>
            </>
          )}

          {/* FORM */}
          {(status === "idle" || status === "not-found") && (
            <>
              {/* LOGO */}
              <div className="w-44 h-44 mx-auto rounded-full border border-yellow-600 flex items-center justify-center mb-10">
                <h1 className="text-yellow-500 text-5xl font-light tracking-[1px]">
                  H&nbsp;&nbsp;|&nbsp;&nbsp;T
                </h1>
              </div>

              {/* TITLE */}
              <p className="text-yellow-500 tracking-[8px] text-sm mb-8">
                THE WEDDING OF
              </p>

              {/* NAMA */}
              <h1 className="text-[#F8F3EA] text-[52px] leading-none mb-10 whitespace-nowrap font-[family-name:var(--font-great-vibes)]">
                Hanif & Tazkiya
              </h1>

              {/* TANGGAL */}
              <div className="flex items-center justify-center gap-2 mb-10">
                <div className="w-16 h-[1px] bg-yellow-500"></div>

                <p className="text-yellow-500 tracking-[2px] text-lg whitespace-nowrap">
                  02 AGUSTUS 2026
                </p>

                <div className="w-16 h-[1px] bg-yellow-500"></div>
              </div>

              {/* ICON */}
              <div className="text-yellow-500 text-3xl mb-10">
                ✦
              </div>

              {/* TEXT */}
              <p className="text-[#F8F3EA] text-2xl mb-8">
                Masukkan Kode Unik Anda
              </p>

              {/* INPUT */}
              <input
                type="text"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.toUpperCase())
                }
                placeholder="KODE UNIK"
                className="w-full bg-[#F5F0E8] text-black text-2xl text-center rounded-3xl p-5 mb-8 outline-none uppercase"
              />

              {/* BUTTON */}
              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-black text-2xl font-bold rounded-3xl p-5 hover:opacity-90 transition-all"
              >
                Klaim Suvenir
              </button>

              {/* ERROR */}
              {status === "not-found" && (
                <div className="mt-8 text-center">
                  <p className="text-red-200 text-xl leading-relaxed">
                    ✕ Kode tidak ditemukan
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}