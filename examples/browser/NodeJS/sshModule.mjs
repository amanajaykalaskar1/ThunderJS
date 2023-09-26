const { Client } = require('ssh2');

function executeRemoteCommand(connectionInfo, command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      conn.exec(command, (err, stream) => {
        if (err) {
          conn.end();
          reject(err);
          return;
        }

        let output = '';
        stream.on('data', data => {
          output += data;
        });

        stream.on('close', (code, signal) => {
          conn.end();
          if (code === 0) {
            resolve(output);
          } else {
            reject(new Error(`Command exited with code ${code}`));
          }
        });
      });
    });

    conn.on('error', err => {
      reject(err);
    });

    conn.connect(connectionInfo);
  });
}

export { executeRemoteCommand }
