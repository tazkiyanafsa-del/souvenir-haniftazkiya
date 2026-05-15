"use client";

import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {

  const [code, setCode] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function handleClaim() {

    if (!code) {

      setMessage(
        "Masukkan kode unik terlebih dahulu"
      );

      return;
    }

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
        "Kode tidak ditemukan"
      );

      return;
    }

    if (data.claimed) {

      setMessage(
        "Souvenir sudah pernah diambil"
      );

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
      `Terima kasih ${data.name}, souvenir berhasil di-claim ❤️`
    );

    setCode("");
  }

  return (

    <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-3 py-6 overflow-hidden">

      <div className="w-full max-w-sm bg-[#8B0020] border border-yellow-700 rounded-[40px] p-5 text-center shadow-2xl relative overflow-hidden">

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

        {/* LOGO */}
        <div className="w-44 h-44 mx-auto border border-yellow-600 rounded-full flex items-center justify-center mt-6 mb-10">

          <div className="text-yellow-500 text-6xl font-light tracking-[12px]">

            H | T

          </div>

        </div>

        {/* TITLE */}
        <p className="text-yellow-500 tracking-[8px] text-sm mb-6">

          THE WEDDING OF

        </p>

        {/* NAMA */}
        <h1 className="text-4xl italic text-white leading-tight mb-10 px-2">

          Hanif & Tazkiya

        </h1>

        {/* TANGGAL */}
        <div className="flex items-center justify-center gap-3 mb-10">

          <div className="w-12 h-[1px] bg-yellow-500"></div>

          <p className="text-yellow-500 tracking-[3px] text-xl">

            02 AGUSTUS 2026

          </p>

          <div className="w-12 h-[1px] bg-yellow-500"></div>

        </div>

        {/* ORNAMEN */}
        <div className="text-yellow-500 text-4xl mb-8">

          ✦

        </div>

        {/* FORM */}
        <div>

          <p className="text-white text-xl mb-6">

            Masukkan Kode Unik Anda

          </p>

          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            placeholder="KODE UNIK"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            inputMode="text"
            className="w-full rounded-[28px] bg-[#F5F0E8] text-black text-2xl text-center p-5 outline-none uppercase mb-5"
          />

          <button
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-bold text-xl py-5 rounded-[28px] transition hover:opacity-90"
          >

            Klaim Souvenir

          </button>

          {message && (

            <div className="mt-6 bg-[#76001F] border border-yellow-600 rounded-[24px] p-5">

              <p className="text-white text-lg leading-relaxed">

                {message}

              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}