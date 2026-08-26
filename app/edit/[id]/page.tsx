"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Student = {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  alamat: string;
};

export default function EditSiswa() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);

  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [alamat, setAlamat] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getStudent();
    }
  }, [id]);

  async function getStudent() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error mengambil data:", error);
      setLoading(false);
      return;
    }

    setStudent(data);
    setNis(data.nis);
    setNama(data.nama);
    setKelas(data.kelas);
    setAlamat(data.alamat);

    setLoading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!nis || !nama || !kelas || !alamat) {
      alert("Semua data harus diisi");
      return;
    }

    setSaving(true);

    const supabase = createClient();

    const { error } = await supabase
      .from("students")
      .update({
        nis,
        nama,
        kelas,
        alamat,
      })
      .eq("id", id);

    if (error) {
      console.error("Error update:", error);
      alert("Gagal mengubah data");
      setSaving(false);
      return;
    }

    alert("Data berhasil diubah");

    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl bg-white p-6 shadow">
            <p>Memuat data...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
        <div className="mx-auto max-w-xl">
          <div className="rounded-xl bg-white p-6 text-center shadow">
            <h1 className="mb-2 text-2xl font-bold">Data Tidak Ditemukan</h1>

            <p className="mb-6 text-gray-600">
              Data siswa yang ingin diedit tidak ditemukan.
            </p>

            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Kembali
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Kembali
          </Link>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="mb-6 text-2xl font-bold">Edit Siswa</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                NIS
              </label>

              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Masukkan NIS"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Nama
              </label>

              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Masukkan nama siswa"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Kelas
              </label>

              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Contoh: XI RPL 1"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Alamat
              </label>

              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Masukkan alamat siswa"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-600 p-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
