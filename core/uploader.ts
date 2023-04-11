import multer from 'multer';

export const uploader = multer({
    storage: multer.diskStorage({
        destination: function (_, __, cb) {
            cb(null, 'static');
        },
        filename: function (_, file, cb) {
            cb(null, file.fieldname + '-' + (Math.random() + 1).toString(36).substring(7) + '.' + file.originalname.split('.')[1]);
        },
    }),
});
