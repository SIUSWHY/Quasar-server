import { s3 } from './storage';
import path from 'path';
import fs from 'fs';

export async function loggerLogic() {
  const date = new Date();
  const lastWeek = 7 * 24 * 60 * 60 * 1000;

  const offSetDate = new Date(date.valueOf() - lastWeek);
  const dayOfDate = date.getDate().toString().length !== 2 ? '0' + date.getDate() : date.getDate();
  const monthOfDate = (date.getMonth() + 1).toString().length !== 2 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;

  const formatDate = [dayOfDate, monthOfDate, date.getFullYear()].join('-');

  const logsPref = ['error.log', 'combined.log'];

  if (process.env.NODE_ENV !== 'development') {
    logsPref.forEach(async (key: string) => {
      // console.log(path.join(__dirname, '/../logs/', formatDate + '.' + key));
      await s3.Upload(
        {
          path: path.join(__dirname, '/../logs/', formatDate + '.' + key),
          save_name: true,
        },
        '/logs/'
      );
    });
  }

  const directory = path.join(__dirname, '/../logs/');

  fs.readdir(directory, async (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const { birthtime } = fs.statSync(directory + file);

      if (birthtime < offSetDate) {
        fs.unlink(path.join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
  });
}
