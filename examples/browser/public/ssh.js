const { Client } = require('ssh2');

function executeSSHCommand(ip, port, username, password, command) {
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
const ip = '192.168.2.184';
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


// const Client = require('ssh2').Client;

// function runTestsOnDUT() {
//   const conn = new Client();

//   // SSH Configuration
//   const sshConfig = {
//     host: '192.168.2.184', // Replace with the DUT's IP address
//     port: 22, // SSH default port
//     username: 'root', // Replace with your SSH username
//     password: '', // Replace with your SSH password
//   };

//   conn.on('ready', () => {
//     conn.shell((err, stream) => {
//       if (err) {
//         conn.end();
//         console.error(err);
//         return;
//       }

//       // STEP-1: Execute "curl ifconfig.me" command
//       stream.write('ifconfig.me\n');
//       stream.on('data', (data) => {
//         const output = data.toString();
//         console.log(output);

//         if (output.includes('Your Public IP Address')) {
//           // STEP-1 Success
//           console.log('Test Step 1: SUCCESS');
//         } else {
//           // STEP-1 Failure
//           console.log('Test Step 1: FAILURE');
//         }

//         // STEP-2: Get public IP using org.rdk.System.2.getPlatformConfiguration
//         stream.write('org.rdk.System.2.getPlatformConfiguration\n'); // Replace with the actual command
//       });

//       // Handle the response for org.rdk.System.2.getPlatformConfiguration
//       const step2Stream = conn.shell();
//       step2Stream.on('data', (data) => {
//         const response = data.toString();
//         console.log(response);

//         // Compare the response with the IP from Step-1
//         if (response.trim() === '192.168.2.184') { // Replace with the IP from Step-1
//           // STEP-2 Success
//           console.log('Test Step 2: SUCCESS');
//         } else {
//           // STEP-2 Failure
//           console.log('Test Step 2: FAILURE');
//         }

//         // Close the SSH connection
//         conn.end();
//       });
//     });
//   });

//   conn.on('error', (err) => {
//     console.error(err);
//   });

//   conn.connect(sshConfig);
// }

// // Call the function to run the tests
// runTestsOnDUT();
