const multer = require('multer');




// CONFIGURE STORE //

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Courses/Lessons');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }
});




// MIDDLEWARE UPLOAD FUNCTION //

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100, fieldNameSize: 100 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf" || file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            return cb(new Error('Only PDF and video formats are allowed!'));
        }
    }
}).fields([
    { name: 'lesson-video', maxCount: 1 },
    { name: 'lesson-document', maxCount: 1 }
]);




module.exports = {
    upload,
    storage
};