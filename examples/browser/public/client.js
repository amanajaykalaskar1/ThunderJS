import { executeSSHCommand } from '../routes/ssh'

// Usage example:
const ip ='192.168.2.90';
const port = 22; // Default SSH port
const username = 'root';
const password = '';
const command = 'ls -l'; // Replace with the command you want to execute

const  sshcall = executeSSHCommand(ip, port, username, password, command);
console.log("SSH OUTPUT: ",sshcall);


const sshResponsediv = document.getElementById('sshResponse');
const sshResponse = document.createElement('p');
sshResponse.textContent = "sshresponse- "+sshcall;
sshResponsediv.appendChild(sshResponse);



// Retrieve the string from localStorage
const dataToSend = localStorage.getItem('userInput');

// Send the data to the server using a fetch POST request
fetch('/save-string', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain', // Set the content type to plain text
  },
  body: dataToSend, // Send the retrieved data as the request body
})
  .then((response) => response.text())
  .then((result) => {
    console.log(result); // Server response
  })
  .catch((error) => {
    console.error('Error:', error);
  });


