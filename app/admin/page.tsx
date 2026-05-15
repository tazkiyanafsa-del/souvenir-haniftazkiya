"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function AdminPage() {

  // LOGIN
  const ADMIN_PASSWORD = "haniftazkiya";

  const [isLogin, setIsLogin] =
    useState(false);

  const [password, setPassword] =
    useState("");

  // SHOW PASSWORD
  const [showPassword, setShowPassword] =
    useState(false);

  // DATA
  const [guests, setGuests] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  // LOGIN
  function handleLogin() {

    if (
      password === ADMIN_PASSWORD
    ) {

      setIsLogin(true);

    } else {

      alert("Password salah 😭");

    }
  }

  // FETCH DATA
  async function fetchGuests() {

    const { data } = await supabase
      .from("guests")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (data) {
      setGuests(data);
    }
  }

  // AUTO REFRESH DATA
  useEffect(() => {

    fetchGuests();

    const interval =
      setInterval(() => {

        fetchGuests();

      }, 2000);

    return () =>
      clearInterval(interval);

  }, []);

  // ADD GUEST
  async function addGuest() {

    if (!name || !code) return;

    await supabase
      .from("guests")
      .insert([
        {
          name,
          code: code.toUpperCase(),
        },
      ]);

    setName("");
    setCode("");

    fetchGuests();
  }

  // DELETE
  async function deleteGuest(id: number) {

    await supabase
      .from("guests")
      .delete()
      .eq("id", id);

    fetchGuests();
  }

  // RESET CLAIM
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

  // IMPORT EXCEL
  async function importExcel(
    event: any
  ) {

    const file =
      event.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = async (
      e: any
    ) => {

      const data =
        new Uint8Array(
          e.target.result
        );

      const workbook =
        XLSX.read(data, {
          type: "array",
        });

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const jsonData: any[] =
        XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: "",
          }
        );

      const formattedData =
        jsonData
          .filter(
            (item) =>
              item.Nama &&
              item.Kode
          )
          .map((item) => ({
            name: String(item.Nama),
            code: String(
              item.Kode
            ).toUpperCase(),
          }));

      if (
        formattedData.length === 0
      ) {

        alert(
          "Format excel salah 😭"
        );

        return;
      }

      const { error } =
        await supabase
          .from("guests")
          .insert(formattedData);

      if (error) {

        console.log(error);

        alert(
          "Import gagal 😭"
        );

        return;
      }

      fetchGuests();

      alert(
        "Import berhasil 😎"
      );
    };

    reader.readAsArrayBuffer(file);
  }

  // EXPORT EXCEL
  function exportExcel() {

    const dataExport =
      guests.map((guest) => ({
        Nama: guest.name,

        Kode: guest.code,

        Status: guest.claimed
          ? "Sudah Ambil"
          : "Belum Ambil",

        Waktu_Ambil:
          guest.claimed_at
            ? new Date(
                new Date(
                  guest.claimed_at
                ).getTime() +
                7 *
                  60 *
                  60 *
                  1000
              ).toLocaleString(
                "id-ID"
              )
            : "-",
      }));

    const worksheet =
      XLSX.utils.json_to_sheet(
        dataExport
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Daftar Tamu"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(
      fileData,
      "daftar-tamu.xlsx"
    );
  }

  // LOGIN PAGE
  if (!isLogin) {

    return (

      <main className="min-h-screen bg-[#5B0015] flex items-center justify-center p-6">

        <div className="bg-[#76001F] border border-yellow-700 rounded-3xl p-10 w-full max-w-md">

          <h1 className="text-4xl text-[#F8F3EA] mb-8 text-center">
            Admin Login
          </h1>

          {/* PASSWORD */}
          <div className="relative mb-6">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password Admin"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-[#F5F0E8] text-black rounded-2xl p-4 pr-16 outline-none"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-xl"
            >

              {showPassword
                ? "🙈"
                : "👁️"}

            </button>

          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-yellow-700 to-yellow-500 text-black rounded-2xl p-4 font-bold"
          >
            Login
          </button>

        </div>

      </main>
    );
  }

  // ADMIN PAGE
  return (

    <main className="min-h-screen bg-[#5B0015] p-6">

      {/* TITLE */}
      <div className="mb-10">

        <h1 className="text-5xl text-[#F8F3EA] mb-3">
          Admin Dashboard
        </h1>

        <p className="text-yellow-500 text-xl">
          Wedding Souvenir
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-10">

        <div className="bg-[#76001F] border border-yellow-700 rounded-3xl p-6">

          <h2 className="text-yellow-500 text-lg mb-2">
            Total Tamu
          </h2>

          <p className="text-[#F8F3EA] text-4xl font-bold">
            {guests.length}
          </p>

        </div>

        <div className="bg-[#76001F] border border-yellow-700 rounded-3xl p-6">

          <h2 className="text-yellow-500 text-lg mb-2">
            Sudah Ambil
          </h2>

          <p className="text-[#F8F3EA] text-4xl font-bold">

            {
              guests.filter(
                (g) =>
                  g.claimed
              ).length
            }

          </p>

        </div>

      </div>

      {/* IMPORT EXPORT */}
      <div className="mb-6 flex gap-4">

        <button
          onClick={exportExcel}
          className="bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
        >
          Export Excel
        </button>

        <label className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold cursor-pointer">

          Import Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={importExcel}
          />

        </label>

      </div>

      {/* ADD GUEST */}
      <div className="bg-[#76001F] border border-yellow-700 rounded-3xl p-6 mb-10">

        <h2 className="text-[#F8F3EA] text-3xl mb-6">
          Tambah Tamu
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
            className="bg-[#F5F0E8] text-black rounded-2xl p-4 outline-none"
          />

          <input
            type="text"
            placeholder="KODE UNIK"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value.toUpperCase()
              )
            }
            className="bg-[#F5F0E8] text-black rounded-2xl p-4 outline-none uppercase"
          />

          <button
            onClick={addGuest}
            className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-black rounded-2xl p-4 font-bold"
          >
            Tambah
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-[#76001F] border border-yellow-700 rounded-3xl overflow-hidden overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#8A0023]">

            <tr>

              <th className="text-left p-4 text-yellow-500">
                Nama
              </th>

              <th className="text-left p-4 text-yellow-500">
                Kode
              </th>

              <th className="text-left p-4 text-yellow-500">
                Status
              </th>

              <th className="text-left p-4 text-yellow-500">
                Waktu Ambil
              </th>

              <th className="text-left p-4 text-yellow-500">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {guests.map(
              (guest) => (

                <tr
                  key={guest.id}
                  className="border-t border-yellow-900"
                >

                  <td className="p-4 text-[#F8F3EA]">
                    {guest.name}
                  </td>

                  <td className="p-4 text-[#F8F3EA]">
                    {guest.code}
                  </td>

                  <td className="p-4">

                    {guest.claimed ? (

                      <span className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">
                        Sudah Ambil
                      </span>

                    ) : (

                      <span className="bg-red-700 text-white px-4 py-2 rounded-full text-sm">
                        Belum Ambil
                      </span>

                    )}

                  </td>

                  <td className="p-4 text-[#F8F3EA] whitespace-nowrap">

                    {guest.claimed_at
                      ? new Date(
                          new Date(
                            guest.claimed_at
                          ).getTime() +
                          7 *
                            60 *
                            60 *
                            1000
                        ).toLocaleString(
                          "id-ID"
                        )
                      : "-"}

                  </td>

                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() =>
                        resetClaim(
                          guest.id
                        )
                      }
                      className="bg-yellow-600 text-black px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      Reset
                    </button>

                    <button
                      onClick={() =>
                        deleteGuest(
                          guest.id
                        )
                      }
                      className="bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </main>
  );
}