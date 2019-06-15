import { createReducer } from "redux-starter-kit";

import {
  receiveDownloadElement,
  endDownloadRequest
} from "../../_actions/jobs";

const initialState = {};

const downloads = createReducer(initialState, {
  [receiveDownloadElement]: (state, action) => {
    const data = action.payload.downloads;

    data.forEach(task => {
      task.files.forEach(file => {
        state[file.md5] = file;
      });
    });
  }

  //   [receiveJobs]: (state, action) => {
  //     // const data = action.payload.data;
  //     const data = action.payload;
  //     const newJobs = Array.isArray(data) ? data : data ? [data] : [];
  //     newJobs.forEach(job => {
  //       state.push(job);
  //     });
  //   }
});

export default downloads;

// "downloads": [
//     {
//         "download_id": 4811825004675072,
//         "files": [
//             {
//                 "job_id": "00913",
//                 "md5": "VXaFmbaAkofQxhjtYMyrmA==",
//                 "output_dir": "/Users/julian/projects/fish/clarisse/renders",
//                 "relative_path": "render1/image1.00119.exr",
//                 "size": 685956,
//                 "task_id": "018",
//                 "url": "https://storage.googleapis.com/eloquent-vector-104019/accounts/5175325533143040/hashstore/55768599b6809287d0c618ed60ccab98?Expires=1563155108&GoogleAccessId=eloquent-vector-104019%40appspot.gserviceaccount.com&Signature=W1aIoNqNgintoJUCHsh5ecNIU%2Be2Hmz8ZnBw1WBrzH0L6OcoeRonyOEqo0yRpYlqpFDgtYcfAvT2PY7mxerWJ403vFSUw94OTsjMpn%2FoQ%2Fe0MxKGW2OaEA7xX2D6NWuVm68tTyn7K36hKqW%2FY%2Fu5B61pOp0wMx6pbJBG48gZFV47UbqjwPGkkVGzpyAoc%2FGQzC7anDhk%2FUuWHFMEw7j%2BwIypylVqqc%2BbTto4ifZsOtG8X4nIlXjY3WAtPgvbW%2FR%2FcZMepgJlWCgK6ViiQpIFWiGwmctzImDzYqHt3fW8xq3PUqG6tZGRFaU1v6WN9GCYjJmZh%2B%2B3TMrplqv7TjHmLA%3D%3D"
//             },
//             {
//                 "job_id": "00913",
//                 "md5": "+2ee0kvPKVdZVQGLSAamng==",
//                 "output_dir": "/Users/julian/projects/fish/clarisse/renders",
//                 "relative_path": "render2/image2.00119.exr",
//                 "size": 594965,
//                 "task_id": "018",
//                 "url": "https://storage.googleapis.com/eloquent-vector-104019/accounts/5175325533143040/hashstore/fb679ed24bcf29575955018b4806a69e?Expires=1563155108&GoogleAccessId=eloquent-vector-104019%40appspot.gserviceaccount.com&Signature=j7idL24iTBVYg%2Fvs6znGr3%2BwVAGke6tWvGSaYr1Y8eNxlNEOJefQzV80wVnM3uoKxTm2VgEZ8bjuQU89G%2F0FC5riBkaohSvq%2F%2FdXe9JLU83RfJQpyxkuB8u9zkoZtQFGTvy7ouJGiF8CuB2%2FZCGG%2Bms0LQEnjkRR%2FlfZUi3lq10fFSQsb0IGVxpbZQsv%2Fjs36sqv6Wy2Bj1SpkoSHckvLlnfmeGQmpPRR9kqJ9DuNuod7FPdd92T%2BcixohouhyRnWinYzQcfB7ugbpxsXPdSVA7xfBRYHhJhIkf6rmZI3hbwakV1Pr5aNESQ%2FJqup1Hzq9nhPNWyTI1JbvG3QTtmnA%3D%3D"
//             }
//         ],
//         "job_id": "00913",
//         "output_dir": "/Users/julian/projects/fish/clarisse/renders",
//         "size": 1280921,
//         "task_id": "018"
//     },
