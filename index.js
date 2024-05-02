const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database_karyawan.db");

const createTables = async () => {
  try {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Karyawan (
          IDKaryawan INTEGER PRIMARY KEY,
          Nama TEXT NOT NULL,
          Usia INTEGER,
          Jabatan TEXT 
        );
      `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Proyek (
          IDProyek INTEGER PRIMARY KEY,
          NamaProyek TEXT NOT NULL,
          IDKaryawanPenanggung INTEGER,
          FOREIGN KEY(IDKaryawanPenanggung) REFERENCES Karyawan(IDKaryawan) ON DELETE CASCADE
        );
      `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Pekerjaan (
          IDPekerjaan INTEGER PRIMARY KEY,
          NamaPekerjaan TEXT NOT NULL,
          IDProyek INTEGER,
          IDKaryawan INTEGER,
          FOREIGN KEY(IDProyek) REFERENCES Proyek(IDProyek) ON DELETE CASCADE,
          FOREIGN KEY(IDKaryawan) REFERENCES Karyawan(IDKaryawan) ON DELETE CASCADE
        );
      `);

    console.log("Tabel berhasil dibuat");
  } catch (error) {
    console.log("Gagal membuat tabel :", error.message);
  }
};

const insertData = async () => {
  try {
    await db.exec("BEGIN");

    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["John Doe", 30, "Manager"]
    );
    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["Jane Smith", 25, "Programmer"]
    );
    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["Bob Johnson", 35, "Sales"]
    );
    await db.run(
      "INSERT INTO Karyawan (Nama, Usia, Jabatan) VALUES (?, ?, ?)",
      ["Alice Brown", 28, "Designer"]
    );

    await db.run(
      "INSERT INTO Proyek (NamaProyek, IDKaryawanPenanggung) VALUES (?, ?)",
      ["Proyek A", 2]
    );
    await db.run(
      "INSERT INTO Proyek (NamaProyek, IDKaryawanPenanggung) VALUES (?, ?)",
      ["Proyek B", 4]
    );
    await db.run(
      "INSERT INTO Proyek (NamaProyek, IDKaryawanPenanggung) VALUES (?, ?)",
      ["Proyek C", 1]
    );

    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 1", 1, 2]
    );
    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 2", 1, 2]
    );
    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 3", 1, 4]
    );
    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 4", 2, 4]
    );
    await db.run(
      "INSERT INTO Pekerjaan (NamaPekerjaan, IDProyek, IDKaryawan) VALUES (?, ?, ?)",
      ["Pekerjaan 5", 3, 1]
    );

    await db.exec("COMMIT");
    console.log("Data berhasil dimasukkan");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Gagal memasukkan data :", error.message);
  }
};

const updateData = async () => {
  try {
    await db.exec("BEGIN");

    await db.run(`
      UPDATE Karyawan
      SET Nama = 'Nyoman', Usia = 20, Jabatan = 'Programmer'
      WHERE Nama = 'Jane Smith'
    `);

    await db.run(`
      UPDATE Proyek
      SET NamaProyek = 'Buat Portofolio', IDKaryawanPenanggung = 2
      WHERE NamaProyek = 'Proyek A'
    `);

    await db.run(`
      UPDATE Pekerjaan
      SET NamaPekerjaan = 'Buat website',IDProyek = 1, IDKaryawan = 2
      WHERE NamaPekerjaan = 'Pekerjaan 1'
    `);

    await db.exec("COMMIT");
    console.log("Berhasil memperbarui data");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Gagal memperbarui data :", error.message);
  }
};

const deleteData = async () => {
  try {
    await db.exec("BEGIN");

    await db.run(`
      DELETE FROM Karyawan
      WHERE IDKaryawan = 2
    `);

    await db.run(`
      DELETE FROM Proyek
      WHERE IDProyek = 2
    `);

    await db.run(`
      DELETE FROM Pekerjaan
      WHERE IDPekerjaan = 2
    `);

    await db.exec("COMMIT");
    console.log("Berhasil menghapus data");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Gagal menghapus data :", error.message);
  }
};

const displayData = async () => {
  try {
    const karyawanRows = await db.all("SELECT * FROM Karyawan");
    console.log("Data karyawan :");
    console.table(karyawanRows);

    const proyekRows = await db.all("SELECT * FROM Proyek");
    console.log("Data proyek :");
    console.table(proyekRows);

    const pekerjaanRows = await db.all("SELECT * FROM Pekerjaan");
    console.log("Data pekerjaan :");
    console.table(pekerjaanRows);
  } catch (error) {
    console.log("Gagal mengambil data :", error.message);
  }
};

const deleteAllData = async () => {
  try {
    await db.exec("BEGIN");
    await db.run("DELETE FROM Karyawan");
    await db.run("DELETE FROM Proyek");
    await db.run("DELETE FROM Pekerjaan");
    await db.exec("COMMIT");
    console.log("Berhasil menghapus semua data");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Gagal menghapus semua data :", error.message);
  }
};

const closeDatabase = async () => {
  try {
    await db.close();
    console.log("Koneksi ke database ditutup");
  } catch (error) {
    console.log("Gagal menutup koneksi :", error.message);
  }
};

