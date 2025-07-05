import express from 'express';
import axios  from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { uv: null, error: null });
});

app.post('/check', async (req, res) => {
  const { lat, lng } = req.body;

  try {
    const response = await axios.get('https://api.openuv.io/api/v1/uv', {
      headers: { 'x-access-token': process.env.UV_API_KEY },
      params: { lat, lng }
    });

    const uv = response.data.result.uv;
    res.render('index', {
      uv,
      error: null,
      advice: uv >= 3 ? 'Yes, wear sunscreen today!' : 'You’re good! No need for sunscreen.'
    });
  } catch (error) {
    res.render('index', { uv: null, error: 'Unable to retrieve UV data. Try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));