function printDiv(divId) {
  uncollapse();
  var content = document.getElementById(divId);
  var printWindow = window.open('', '');

  printWindow.document.open();
  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write(content.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  // Specify print settings to save as PDF
  printWindow.print();
  // printWindow.document.execCommand('SaveAs', true, 'filename.pdf'); // Specify the desired filename

  printWindow.close();
}


//function to un-collapse the report sections
function uncollapse() {
  console.log("uncollapsing report...")
  const rc = document.querySelectorAll('.reportContent')
  const mc = document.querySelectorAll('.moduleContent')

  // Loop through the elements and change their display to "block"
  for (var i = 0; i < rc.length; i++) {
    rc[i].style.display = 'block';
  }
  // Loop through the elements and change their display to "block"
  for (var i = 0; i < mc.length; i++) {
    mc[i].style.display = 'block';
  }
}
