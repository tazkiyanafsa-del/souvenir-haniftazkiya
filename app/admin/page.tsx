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

    <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-sm bg-[#8B0020] border border-yellow-600 rounded-[40px] p-6 text-center shadow-2xl relative overflow-hidden">

        {/* ORNAMEN */}
        <div className="absolute top-4 left-4 text-yellow-700 text-3xl opacity-50">
          ❀
        </div>

        <div className="absolute top-4 right-4 text-yellow-700 text-3xl opacity-50">
          ❀
        </div>

        <div className="absolute bottom-4 left-4 text-yellow-700 text-3xl opacity-50">
          ❀
        </div>

        <div className="absolute bottom-4 right-4 text-yellow-700 text-3xl opacity-50">
          ❀
        </div>

        {/* BORDER */}
        <div className="absolute inset-4 border border-yellow-700 rounded-[30px] pointer-events-none"></div>

        {/* INISIAL */}
        <div className="w-52 h-52 mx-auto border border-yellow-600 rounded-full flex items-center justify-center mt-8 mb-12">

          <div className="text-yellow-500 text-7xl font-light tracking-[18px]">
            H | T
          </div>

        </div>

        {/* TITLE */}
        <p className="text-yellow-500 tracking-[10px] text-lg mb-8">

          THE WEDDING OF

        </p>

        {/* NAMA */}
        <h1 className="text-[44px] md:text-6xl italic text-white px-4 mb-10 leading-[1.3]">

          Hanif & Tazkiya

        </h1>

        {/* GARIS */}
        <div className="flex items-center justify-center gap-4 mb-12">

          <div className="w-16 h-[1px] bg-yellow-500"></div>

          <div>

            <p className="text-yellow-500 tracking-[4px] text-2xl">
              02 AGUSTUS 2026
            </p>

          </div>

          <div className="w-16 h-[1px] bg-yellow-500"></div>

        </div>

        {/* ORNAMEN */}
        <div className="text-yellow-500 text-5xl mb-10">
          ✦
        </div>

        {/* FORM */}
        <div className="mt-6">

          <p className="text-white mb-8 text-2xl">

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
            className="w-full p-6 rounded-[30px] text-center text-black text-3xl outline-none mb-6 uppercase"
          />

          <button
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 hover:opacity-90 text-black font-bold py-6 rounded-[30px] transition text-2xl"
          >

            Klaim Souvenir

          </button>

          {message && (

            <div className="mt-8 bg-[#76001F] border border-yellow-600 rounded-[30px] p-6">

              <p className="text-white text-xl leading-relaxed">

                {message}

              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}