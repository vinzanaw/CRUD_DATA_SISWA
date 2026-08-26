"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TambahSiswa() {
  const router = useRouter();

  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [alamat, setAlamat] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!nis || !nama || !kelas || !alamat) {
      alert("Semua data harus diisi");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.from("students").insert({
      nis,
      nama,
      kelas,
      alamat,
    });

    if (error) {
      console.error(error);
      alert("Gagal menambahkan data");
      setLoading(false);
      return;
    }

    alert("Data berhasil ditambahkan");

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Kembali
          </Link>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold">Tambah Siswa</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">NIS</label>

              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan NIS"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Nama</label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama siswa"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Kelas</label>

              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: XI RPL 1"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Alamat</label>

              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan alamat siswa"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
