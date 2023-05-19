const express = require('express');
const axios = require('axios');

const app = express();
const settings = require("../../settings.json");
const apiUrl = `${settings.pterodactyl.domain}/api/application`;

app.post('/api/purge', async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/servers`, {
      headers: {
        'Authorization': `Bearer ${settings.pterodactyl.key}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.pterodactyl.v1+json',
      }
    });

    const data = response.data;
    const servers = data.data;
    const purgeKeyword = settings.purge.keyword;
    const inactiveServers = servers.filter(server => !server.attributes.name.includes(purgeKeyword));

    for (const server of inactiveServers) {
      await axios.delete(`${apiUrl}/servers/${server.attributes.identifier}`, {
        headers: {
          'Authorization': `Bearer ${settings.pterodactyl.key}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.pterodactyl.v1+json',
        }
      });

      console.log(`Deleted server ${server.attributes.name}`);
    }

    console.log('Purge complete!');
    res.sendStatus(200);
  } catch (error) {
    console.error(`Failed To Perform Purge: ${error}`);
    res.sendStatus(500);
  }
});

module.exports = app;