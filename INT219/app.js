const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 7000; // Use the dynamic port assigned by Heroku or default to 3000

app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/images', express.static('images'));
app.use(express.static('INT219'));

// Function to load pre-defined values from JSON file
function loadPreDefinedValues() {
  try {
    return JSON.parse(fs.readFileSync('C:\\Fancy-Garments/preDefinedValues.json', 'utf8'));
  } catch (err) {
    console.error('Error loading pre-defined values:', err);
    return {}; // Return empty object in case of error
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to serve the HTML form 
app.get('/ProfilePage', (req, res) => {
  // Load pre-defined values
  const preDefinedValues = loadPreDefinedValues();
  
  // Read the HTML file and serve it as response
  fs.readFile('C:\\Fancy-Garments/Profile.html', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    // Replace placeholders with pre-defined values
    data = data.replace('<%= preDefinedValues.name %>', preDefinedValues.name || '')
               .replace('<%= preDefinedValues.email %>', preDefinedValues.email || '')
               .replace('<%= preDefinedValues.password %>', preDefinedValues.password || '')
               .replace('<%= preDefinedValues.gender %>', preDefinedValues.gender || '');

    // Check if shipmentInfo exists in pre-defined values
    if (preDefinedValues.shipmentInfo) {
      data = data.replace('<%= preDefinedValues.shipmentInfo.billingAddress %>', preDefinedValues.shipmentInfo.billingAddress || '')
                 .replace('<%= preDefinedValues.shipmentInfo.pincode %>', preDefinedValues.shipmentInfo.pincode || '')
                 .replace('<%= preDefinedValues.shipmentInfo.lastOrderShippedOn %>', preDefinedValues.shipmentInfo.lastOrderShippedOn || '')
                 .replace('<%= preDefinedValues.shipmentInfo.redeemCard %>', preDefinedValues.shipmentInfo.redeemCard || '');
                }
    // Send the HTML content as response
    res.send(data);
  });
});

// Route to handle profile update
app.post('/updateProfile', (req, res) => {
  const { name, email, password, gender } = req.body;

  // Load pre-defined values
  let preDefinedValues = loadPreDefinedValues();

  // Update only the profile details
  preDefinedValues = {
    ...preDefinedValues,
    name,
    email,
    password,
    gender
  };

  // Save updated values to JSON file
  fs.writeFileSync('C:\\Fancy-Garments/preDefinedValues.json', JSON.stringify(preDefinedValues, null, 2));

  // Redirect to the form page after successful submission
  res.redirect('/ProfilePage');
});

// Route to handle shipment information update
app.post('/updateShipmentInfo', (req, res) => {
  const { billingAddress, pincode, lastOrderShippedOn, redeemCard } = req.body;

  // Load pre-defined values
  let preDefinedValues = loadPreDefinedValues();

  // Update shipment information
  preDefinedValues = {
    ...preDefinedValues,
    shipmentInfo: {
      billingAddress,
      pincode,
      lastOrderShippedOn,
      redeemCard
    }
  };

  // Save updated values to JSON file
  fs.writeFileSync('C:\\Fancy-Garments/preDefinedValues.json', JSON.stringify(preDefinedValues, null, 2));

  // Redirect to the form page after successful submission
  res.redirect('/ProfilePage');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
