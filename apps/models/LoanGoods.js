const { DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const Menu = sequelize.define('loan_goods', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false
    },
    nopegawai: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    kode_barang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama_barang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggal_pinjam: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    waktu_pinjam: {
        type: DataTypes.TIME,
        allowNull: false
    },
    tanggal_kembali: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    waktu_kembali: {
        type: DataTypes.TIME,
        allowNull: true
    }
});

module.exports = Menu;