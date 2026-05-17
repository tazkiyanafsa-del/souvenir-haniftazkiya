"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import * as XLSX from "xlsx";

export default function Home() {
  const [guests, setGuests] = useState<any[]>([]);

  async function fetchGuests() {
    const { data } = await supabase
      .from("guests")
      .select("*")
      .order("id", { ascending: true });

    if (data) {
      setGuests(data);
    }
  }

  useEffect(() => {
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
  }, []);

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

  async function deleteGuest(id: number) {
    await supabase
      .from("guests")
      .delete()
      .eq("id", id);

    fetchGuests();
  }

  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      guests.map((g) => ({
        Nama: g.name,
        Kode: g.code,
        SudahAmbil: g.claimed
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

  async function importExcel(
    e: any
  ) {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = async (
      evt: any
    ) => {

      try {

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
          json
            .filter(
              (item) =>
                item.Nama &&
                item.Kode
            )
            .map((item) => ({
              name: String(
                item.Nama
              ).trim(),

              code: String(
                item.Kode
              )
                .trim()
                .toUpperCase(),

              claimed: false,
            }));

        if (
          formatted.length === 0
        ) {
          alert(
            "Format Excel salah 😭"
          );
          return;
        }

        const { error } =
          await supabase
            .from("guests")
            .insert(formatted);

        if (error) {
          console.error(error);

          alert(
            "Import gagal 😭"
          );

          return;
        }

        alert(
          "Import berhasil 😎🔥"
        );

        fetchGuests();

      } catch (err) {

        console.error(err);

        alert(
          "Terjadi error saat import 😭"
        );
      }
    };

    reader.readAsArrayBuffer(
      file
    );
  }

  return (
    <main className="min-h-screen bg-[#7A0019] p-6 text-white">

      <h1 className="text-5xl mb-2 font-light">
        Admin Dashboard
      </h1>

      <p className="text-yellow-500 text-2xl mb-10">
        Wedding Souvenir
      </p>

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