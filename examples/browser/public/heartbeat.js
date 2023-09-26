
var thunderJS
var defaultHost = localStorage.getItem('host')
var host;

localStorage.setItem('host', host)
thunderJS = ThunderJS({
  host: '192.168.2.248',
  port: 9998,
})

function myFunction() {
  thunderJS.on('connect', () => {
    console.log('Device Connected!!!')
  })
  console.log('Function executed at', new Date());
}

self.onmessage = function (e) {
  if (e.data === 'execute') {
    myFunction();
    postMessage('executed');
  }
};




