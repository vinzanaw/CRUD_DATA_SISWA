"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Student = {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  alamat: string;
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  async function getStudents() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setStudents(data || []);
    setLoading(false);
  }

  useEffect(() => {
    getStudents();
  }, []);

  async function deleteStudent(id: string) {
    const yakin = confirm("Apakah Anda yakin ingin menghapus data ini?");

    if (!yakin) {
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus data");
      console.error(error);
      return;
    }

    alert("Data berhasil dihapus");

    getStudents();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Data Siswa</h1>

            <p className="mt-1 text-gray-600">CRUD Next.js + Supabase</p>
          </div>

          <Link
            href="/tambah"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            + Tambah Siswa
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : students.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Belum ada data siswa
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">NIS</th>

                  <th className="p-4 text-left">Nama</th>

                  <th className="p-4 text-left">Kelas</th>

                  <th className="p-4 text-left">Alamat</th>

                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t">
                    <td className="p-4">{student.nis}</td>

                    <td className="p-4">{student.nama}</td>

                    <td className="p-4">{student.kelas}</td>

                    <td className="p-4">{student.alamat}</td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/edit/${student.id}`}
                          className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
