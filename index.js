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
          FOREIGN KEY(IDKaryawanPenanggung) REFERENCES Karyawan(IDKaryawan)
        );
      `);

      await db.exec(`
        CREATE TABLE IF NOT EXISTS Pekerjaan (
          IDPekerjaan INTEGER PRIMARY KEY,
          NamaPekerjaan TEXT NOT NULL,
          IDProyek INTEGER,
          IDKaryawan INTEGER,
          FOREIGN KEY(IDProyek) REFERENCES Proyek(IDProyek),
          FOREIGN KEY(IDKaryawan) REFERENCES Karyawan(IDKaryawan)
        );
      `);

      console.log("table berhasil dibuat");
    } catch (error) {
      console.log("gagal membuat table :", error.message);
    }
  }

  createTables();