"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import * as XLSX from "xlsx";

export default function AdminPage() {

  const [guests, setGuests] =
    useState<any[]>([]);

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLogin, setIsLogin] =
    useState(false);

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  // =========================
  // FETCH DATA
  // =========================
  async function fetchGuests() {

    const { data } =
      await supabase
        .from("guests")
        .select("*")
        .order("id", {
          ascending: true,
        });

    if (data) {
      setGuests(data);
    }
  }

  // =========================
  // REALTIME
  // =========================
  useEffect(() => {

    if (isLogin) {

      fetchGuests();

      const channel = supabase

        .channel("guest-changes")

        .on(
          "postgres_changes",

          {
            event: "*",
            schema: "public",
            table: "guests",
          },

          () => {
            fetchGuests();
          }
        )

        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

  }, [isLogin]);

  // =========================
  // LOGIN
  // =========================
  function handleLogin() {

    if (password === "haniftazkiya") {

      setIsLogin(true);

    } else {

      alert("Password salah 😭");

    }
  }

  // =========================
  // TAMBAH TAMU
  // =========================
  async function addGuest() {

    if (!name || !code) {

      alert("Isi semua data 😭");

      return;
    }

    const { error } =
      await supabase
        .from("guests")
        .insert([
          {
            name,
            code:
              code.toUpperCase(),
            claimed: false,
          },
        ]);

    if (error) {

      alert(
        "Gagal tambah tamu 😭"
      );

      return;
    }

    setName("");
    setCode("");

    fetchGuests();
  }

  // =========================
  // RESET CLAIM
  // =========================
  async function resetClaim(id: number) {

    await supabase
      .from("guests")
      .update({
        claimed: false,
        claimed_at: null,
      })
      .eq("id", id);

    fetchGuests();
  }

  // =========================
  // DELETE TAMU
  // =========================
  async function deleteGuest(id: number) {

    await supabase
      .from("guests")
      .delete()
      .eq("id", id);

    fetchGuests();
  }

  // =========================
  // EXPORT EXCEL
  // =========================
  function exportExcel() {

    const worksheet =
      XLSX.utils.json_to_sheet(

        guests.map((g) => ({

          Nama: g.name,

          Kode: g.code,

          SudahAmbil:
            g.claimed
              ? "Ya"
              : "Belum",

        }))
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Tamu"
    );

    XLSX.writeFile(
      workbook,
      "daftar_tamu.xlsx"
    );
  }

  // =========================
  // IMPORT EXCEL
  // =========================
  async function importExcel(e: any) {

    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = async (
      evt: any
    ) => {

      const data =
        new Uint8Array(
          evt.target.result
        );

      const workbook =
        XLSX.read(data, {
          type: "array",
        });

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const json: any[] =
        XLSX.utils.sheet_to_json(
          sheet
        );

      const formatted =
        json.map((item) => ({

          name: item.Nama,

          code: String(
            item.Kode
          ).toUpperCase(),

          claimed: false,

        }));

      await supabase
        .from("guests")
        .insert(formatted);

      fetchGuests();

      alert(
        "Import berhasil 😎🔥"
      );
    };

    reader.readAsArrayBuffer(file);
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (!isLogin) {

    return (

      <main className="min-h-screen bg-[#7A0019] flex items-center justify-center px-4">

        <div className="w-full max-w-sm bg-[#8B0020] border border-yellow-700 rounded-[40px] p-8 shadow-2xl relative overflow-hidden text-center">

          <div className="absolute inset-3 border border-yellow-700 rounded-[32px] pointer-events-none"></div>

          <h1 className="text-white text-4xl mb-8">

            Admin Login

          </h1>

          <div className="relative mb-6">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

              placeholder="Password"

              className="w-full bg-white text-black rounded-[24px] px-5 py-4 outline-none text-lg"
            />

            <button
              type="button"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

              className="absolute right-4 top-1/2 -translate-y-1/2 text-black"
            >

              {showPassword
                ? "🙈"
                : "👁️"}

            </button>

          </div>

          <button
            onClick={handleLogin}

            className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-bold py-4 rounded-[24px] text-xl"
          >

            Masuk

          </button>

        </div>

      </main>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  return (

    <main className="min-h-screen bg-[#7A0019] p-6 text-white">

      <h1 className="text-5xl mb-2 font-light">

        Admin Dashboard

      </h1>

      <p className="text-yellow-500 text-2xl mb-10">

        Wedding Souvenir

      </p>

      {/* CARD */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-[#8B0020] border border-yellow-700 rounded-[30px] p-10">

          <p className="text-yellow-500 text-2xl mb-4">

            Total Tamu

          </p>

          <h2 className="text-6xl font-bold">

            {guests.length}

          </h2>

        </div>

        <div className="bg-[#8B0020] border border-yellow-700 rounded-[30px] p-10">

          <p className="text-yellow-500 text-2xl mb-4">

            Sudah Ambil

          </p>

          <h2 className="text-6xl font-bold">

            {
              guests.filter(
                (g) => g.claimed
              ).length
            }

          </h2>

        </div>

      </div>

      {/* TAMBAH DATA */}
      <div className="bg-[#8B0020] border border-yellow-700 rounded-[30px] p-6 mb-10">

        <h2 className="text-3xl mb-6">

          Tambah Data Tamu

        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"

            placeholder="Nama Tamu"

            value={name}

            onChange={(e) =>
              setName(
                e.target.value
              )
            }

            className="bg-white text-black rounded-[20px] px-5 py-4 outline-none"
          />

          <input
            type="text"

            placeholder="Kode"

            value={code}

            onChange={(e) =>
              setCode(
                e.target.value
              )
            }

            className="bg-white text-black rounded-[20px] px-5 py-4 outline-none uppercase"
          />

          <button
            onClick={addGuest}

            className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-bold rounded-[20px] px-5 py-4"
          >

            Tambah

          </button>

        </div>

      </div>

      {/* BUTTON */}
      <div className="flex gap-4 mb-10 flex-wrap">

        <button
          onClick={exportExcel}

          className="bg-green-700 hover:bg-green-600 px-8 py-4 rounded-[20px] text-xl font-semibold"
        >

          Export Excel

        </button>

        <label className="bg-blue-900 hover:bg-blue-800 px-8 py-4 rounded-[20px] text-xl font-semibold cursor-pointer">

          Import Excel

          <input
            type="file"

            accept=".xlsx,.xls"

            className="hidden"

            onChange={importExcel}
          />

        </label>

      </div>

      {/* TABLE */}
      <div className="bg-[#8B0020] border border-yellow-700 rounded-[30px] p-6 overflow-auto">

        <table className="w-full text-left">

          <thead>

            <tr className="border-b border-yellow-700">

              <th className="p-4">
                Nama
              </th>

              <th className="p-4">
                Kode
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {guests.map((guest) => (

              <tr
                key={guest.id}

                className="border-b border-[#A00028]"
              >

                <td className="p-4">

                  {guest.name}

                </td>

                <td className="p-4">

                  {guest.code}

                </td>

                <td className="p-4">

                  {guest.claimed
                    ? "✅ Sudah"
                    : "❌ Belum"}

                </td>

                <td className="p-4 flex gap-2 flex-wrap">

                  <button
                    onClick={() =>
                      resetClaim(
                        guest.id
                      )
                    }

                    className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl"
                  >

                    Reset

                  </button>

                  <button
                    onClick={() =>
                      deleteGuest(
                        guest.id
                      )
                    }

                    className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-xl"
                  >

                    Hapus

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}