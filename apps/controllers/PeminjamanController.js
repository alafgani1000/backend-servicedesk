const moment = require('moment');
const { v4:uuidv4 } =  require('uuid');
const { validationResult } = require('express-validator');
const dbconfig = require('../configs/db.config');
const Peminjaman = dbconfig.loanGoods;

/**
 * menampilkan peminjaman
 * @param {*} req 
 * @param {*} res 
 */
 exports.viewPeminjamans = async (req, res) => {
    var condition = null;
    await Peminjaman.findAll({ 
            where: condition 
        })
        .then(data => {
            res.json({
                "message":"Success",
                "data":data
            });
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });
}

/**
 * menampilkan peminjaman per id
 * @param {*} req 
 * @param {*} res 
 */
exports.viewPeminjaman = (req, res) => {
    try{
        const id = req.params.id;
        Peminjaman.findOne({ where: {id:id }
        })
        .then(data => {
            res.json({
                "message":"Success",
                "data":data
            });
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Error someting"
            });
        });
    }catch(err){
        res.json({
            "message":"Error",
            "error":err
        }); 
        res.end();
    }
}

/**
 * input data peminjaman
 * @param {*} req 
 * @param {*} res 
 */
exports.pinjam = async (req, res) => {
    const nopegawai = req.body.nopegawai;
    const kodeBarang = req.body.kode_barang;
    const namaBarang = req.body.nama_barang;
    const tanggalPinjam = moment().format('YYYY-MM-DD');
    const jamPinjam = moment().format('HH:mm:ss');

    try {
        const insert = await Peminjaman.create({
            nopegawai:nopegawai,
            kode_barang:kodeBarang,
            nama_barang:namaBarang,
            tanggal_pinjam:tanggalPinjam,
            jam_pinjam:jamPinjam
        }).then(data => {
            return res.status(200).json({
                status: 'success',
                message: 'Peminjaman barang berhasil dilakukan'
            })
        }).catch(data => {
            return res.json({
                status: 'error',
                message: 'Peminjaman gagal'.data
            })
        })
    } catch(err) {
        return res.json({
            status: 'error',
            message: 'error:'. err 
        });
    }
    
}

/**
 * pengembalian barang yang telah dipinjam
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.pengembalian =  async (req, res) => {
    const dataId = req.params.id;
    const tanggalKembali = moment().format('YYYY-MM-DD');
    const jamKembali = moment().format('HH:mm:ss');
    try {
        const update = await Peminjaman.update({
            tanggal_kembali:tanggalKembali,
            waktu_kembali:jamKembali
        }, { 
            where:{
                id:dataId
            } 
        }).then(data => {
            return res.status(200).json({
                status: 'success',
                message: 'Barang berhasil dikembalikan'
            });
        }).catch(data => {
            return res.json({
                status: 'error',
                message: 'Error:'.err
            });
        })
    } catch (err) {
        return res.json({
            status: 'error',
            message: 'error:'.err
        });
    }
}