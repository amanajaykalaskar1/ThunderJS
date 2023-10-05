const { Client } = require('ssh2');

export function executeSSHCommand(ip, port, username, password, command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return conn.end();
        }

        let output = '';

        stream
          .on('data', (data) => {
            output += data.toString();
          })
          .on('close', (code, signal) => {
            conn.end();
            if (code === 0) {
              resolve(output);
            } else {
              reject(`Command exited with code ${code}`);
            }
          });
      });
    });

    conn.on('error', (err) => {
      reject(err);
    });

    conn.connect({
      host: ip, // Use the provided IP address as the connection target
      port,
      username,
      password,
    });
  });
}

// Usage example:
const ip = '192.168.2.90';
const port = 22; // Default SSH port
const username = 'root';
const password = '';
const command = 'ls -l'; // Replace with the command you want to execute

executeSSHCommand(ip, port, username, password, command)
  .then((output) => {
    console.log('Command output:');
    console.log(output);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


  module.exports = {
    executeSSHCommand
  };
