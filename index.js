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

// createTables()

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

// insertData()

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
      SET NamaProyek = 'Buat Portofolio', IDKaryawanPenanggung = 3
      WHERE NamaProyek = 'Proyek A'
    `);

    await db.run(`
      UPDATE Pekerjaan
      SET NamaPekerjaan = 'Buat website',IDProyek = 3, IDKaryawan = 3
      WHERE NamaPekerjaan = 'Pekerjaan 1'
    `);

    await db.exec("COMMIT");
    console.log("Berhasil memperbarui data");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Gagal memperbarui data :", error.message);
  }
};

// updateData()

const deleteData = async () => {
  try {
    await db.exec("BEGIN");

    await db.run(`
      DELETE FROM Karyawan
      WHERE IDKaryawan = 2
    `);

    await db.run(`
      DELETE FROM Proyek
      WHERE IDKaryawanPenanggung = 2
    `);

    await db.run(`
      DELETE FROM Pekerjaan
      WHERE IDKaryawan = 2
    `);

    await db.exec("COMMIT");
    console.log("Berhasil menghapus data");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.log("Gagal menghapus data :", error.message);
  }
};

// deleteData()

const displayData = async () => {
  try {
    await db.all("SELECT * FROM Karyawan", (err, data) => {
      if(err) {
        return console.error(err);
      } else {
        console.log("Data karyawan :");
        console.table(data);
      }
    });
    await db.all("SELECT * FROM Proyek", (err, data) => {
      if(err) {
        return console.error(err);
      } else {
        console.log("Data Proyek :");
        console.table(data);
      }
    });
    await db.all("SELECT * FROM Pekerjaan", (err, data) => {
      if(err) {
        return console.error(err);
      } else {
        console.log("Data Pekerjaan :");
        console.table(data);
      }
    });
  } catch (error) {
    console.log("Gagal mengambil data :", error.message);
  }
};

displayData()

const displayEmployeeProjectAndTask = async() => {
  try {
    await db.all(`
      SELECT Karyawan.Nama, Proyek.NamaProyek, Pekerjaan.NamaPekerjaan
      FROM Karyawan
      JOIN Proyek ON Karyawan.IDKaryawan = Proyek.IDKaryawanPenanggung 
      JOIN Pekerjaan ON Proyek.IDProyek = Pekerjaan.IDProyek
    `, (err, data) => {
      if(err) {
        return console.error(err);
      } else {
        console.log("Data Karyawan, Proyek, dan Pekerjaan");
        console.table(data);
      }
    });

  } catch (error) {
    console.log("Gagal Menampilkan Data :", error.message);
  }
}

// displayEmployeeProjectAndTask()


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

// deleteAllData()

const closeDatabase = async () => {
  try {
    await db.close();
    console.log("Koneksi ke database ditutup");
  } catch (error) {
    console.log("Gagal menutup koneksi :", error.message);
  }
};
// closeDatabase()

