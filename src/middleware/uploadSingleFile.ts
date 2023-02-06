import multer from 'multer';
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

const multerMiddleware = (fileName: string) => upload.single(fileName);

export default multerMiddleware;
