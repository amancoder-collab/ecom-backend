// import { BadRequestException } from '@nestjs/common';
// import * as multer from 'multer';
// import * as multerSftp from 'multer-sftp';

// export const sftpStorage = multerSftp({
//     sftp: {
//         host: process.env.SMTP_HOSTNAME_IMG,
//         port: process.env.SMTP_PORT_IMG,
//         username: process.env.SMTP_USERNAME_IMG,
//         password: process.env.SMTP_PASSWORD_IMG,
//     },
//     destination: function (req, file, cb) {
//         cb(
//             null,
//             'domains/thingslinker.com/public_html/upload_images/ring_images',
//         );
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });

// export const fileFilter = (req, file, callback) => {
//     const allowedTypes = /jpeg|jpg|png|heic|heif/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         return callback(null, true);
//     } else {
//         console.error('File rejected:', file.originalname, file.mimetype);
//         callback(
//             new BadRequestException(
//                 'Only JPEG, JPG, PNG, HEIC, and HEIF files are allowed!',
//             ),
//             false,
//         );
//     }
// };

// export const localStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log('Setting local destination for file:', file.originalname);
//         cb(null, './uploads');
//     },
//     filename: (req, file, cb) => {
//         console.log('Setting local filename for file:', file.originalname);
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// export const upload = multer({
//     storage: sftpStorage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 10 * 1024 * 1024 },
// });
