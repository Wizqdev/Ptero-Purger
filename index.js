const express = require('express');
const app = require('./Src/Api/purger');
const settings = require('./settings.json');
const axios = require('axios');
const PORT = settings.web.port;

app.enable('trust proxy');
app.set('views', './Src/View');
app.set('view engine', 'ejs');
app.use('/assets', express.static('./Src/Assets'));

const fetchData = async (url, errorMessage) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.pterodactyl.key}`
      }
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error(errorMessage);
    }

    return response.data.data.length;
  } catch (error) {
    console.error(`Error while fetching data: ${error}`);
    throw new Error('Internal Server Error');
  }
};

app.get('/api/users', async (req, res) => {
  try {
    const url = `${settings.pterodactyl.domain}/api/application/users`;
    const totalUsers = await fetchData(url, 'Failed to fetch users');
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/servers', async (req, res) => {
  try {
    const url = `${settings.pterodactyl.domain}/api/application/nodes?include=servers`;
    const totalServers = await fetchData(url, 'Failed to fetch servers');
    res.json({ totalServers });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.render('purge.ejs', { settings: settings });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
