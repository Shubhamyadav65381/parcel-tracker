const PDFDocument = require('pdfkit');

function generatePDF(parcel, res) {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=parcel-receipt.pdf');

  doc.pipe(res);

  // Header
  doc
    .fontSize(24)
    .fillColor('#007bff')
    .text('Parcel Receipt', { align: 'center' })
    .moveDown();

  // Horizontal Line
  doc
    .moveTo(50, 100)
    .lineTo(550, 100)
    .stroke('#ccc')
    .moveDown();

  // Parcel Information
  doc
    .fontSize(12)
    .fillColor('black')
    .moveDown(1);

  const lineGap = 10;
  const info = [
    { label: 'Tracking ID', value: parcel.trackingId },
    { label: 'Sender', value: parcel.sender },
    { label: 'Receiver', value: parcel.receiver },
    { label: 'Description', value: parcel.description },
    { label: 'Destination', value: parcel.destination },
    { label: 'Status', value: parcel.status },
    { label: 'Created At', value: new Date(parcel.createdAt).toLocaleString() }
  ];

  info.forEach(item => {
    doc
      .font('Helvetica-Bold')
      .text(`${item.label}: `, { continued: true })
      .font('Helvetica')
      .text(item.value)
      .moveDown(0.5);
  });

  // Footer
  doc
    .moveDown(2)
    .fontSize(10)
    .fillColor('gray')
    .text('Thank you for using Parcel Tracker!', { align: 'center' });

  doc.end();
}

module.exports = generatePDF;
