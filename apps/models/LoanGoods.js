const { DataTypes } = require('sequelize');
const sequelize = require('../configs/connection');

const LoanGood = sequelize.define('loan_goods', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    nopegawai: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    kodeBarang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    namaBarang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggalPinjam: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    waktuPinjam: {
        type: DataTypes.TIME,
        allowNull: false
    },
    tanggalKembali: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    waktukembali: {
        type: DataTypes.TIME,
        allowNull: true
    }
});

module.exports = LoanGood;