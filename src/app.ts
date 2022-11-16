import express from 'express';
import cors from 'cors';
import {productRouter} from "./products";

const app = express();
const port =  process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use('/product/',productRouter);
app.listen(port, () =>
{
    const runningMessage = `Server running at http://localhost:${port}`;
    console.log(runningMessage);
})
