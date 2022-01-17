const express = require('express');
const router = express.Router();
const peminjamanController = require('../apps/controllers/PeminjamanController');
const auth = require('../apps/middlewares/auth');
const AuthHelp = require('../apps/helpers/AuthHelper');
const { check } = require('express-validator');
const { route } = require('.');

router.post('/pinjam', 
    auth.isAuth, 
    peminjamanController.pinjam
);
router.put('/:id/update',
    auth.isAuth,
    peminjamanController.update
);
router.delete('/:id/delete',
    auth.isAuth,
    peminjamanController.delete
)
router.get('/:id/data',
    auth.isAuth,
    peminjamanController.viewPeminjaman    
);
router.get('/data',
    auth.isAuth,
    peminjamanController.viewPeminjamans
);
router.put('/:id/kembali',
    auth.isAuth,
    peminjamanController.pengembalian
)

module.exports = router
