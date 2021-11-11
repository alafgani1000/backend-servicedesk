const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const { validationResult } = require('express-validator');
const dbconfig = require('../configs/db.config');
const Peminjaman = dbconfig.loanGoods;

exports.pinjam = async (req, res) => {
    const nopegawai = req.body.nopegawai;
    const kodeBarang = req.body.kode_barang;
    const namaBarang = req.body.nama_barang;
    const tanggalPinjam = moment().format('YYYY-MM-DD');
    const jamPinjam = moment().format('HH:mm:ss');

    const insert = await Peminjaman.create({
        nopegawi:nopegawai,
        kode_barang:kodeBarang,
        nama_barang:namaBarang,
        tanggal_pinjam:tanggalPinjam,
        jam_pinjam:jamPinjam
    }).then(data => {
        
    }).catch(data => {

    })
}