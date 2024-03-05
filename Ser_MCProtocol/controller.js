var values_plc1 = [];
function valuesReadyPLC1(anythingBad, newValues) {
  if (anythingBad) {
    console.log("Read Error PLC_1");
  }
  values_plc1 = newValues;
}
var values_plc5 = [];
function valuesReadyPLC5(anythingBad, newValues) {
  if (anythingBad) {
    console.log("Read Error PLC_5");
  }
  values_plc5 = newValues;
}
function writeDataToPLC(plc, data, callback, retryCount = 3) {
  plc.writeItems(Object.keys(data), Object.values(data), (error) => {
    if (error) {
      console.log("Error writing to PLC", error);
      if (retryCount > 0) {
        console.log("Retrying...");
        setTimeout(() => {
          writeDataToPLC(plc, data, callback, retryCount - 1);
        }, 100); // Retry after 100 milisecond
      } else {
        callback("Max retry exceeded. Failed to write data to PLC.");
      }
    } else {
      // Successful write
      callback(null);
    }
  });
}
module.exports = {
  dataController(plc1, plc5,res, req) {
    // Read data from both PLCs asynchronously
    const readPLC1 = new Promise((resolve, reject) => {
      plc1.readAllItems((error, newValues) => {
        if (error) {
          reject(error);
        } else {
          valuesReadyPLC1(null, newValues);
          resolve();
        }
      });
    });
    const readPLC5 = new Promise((resolve, reject) => {
      plc5.readAllItems((error, newValues) => {
        if (error) {
          reject(error);
        } else {
          valuesReadyPLC5(null, newValues);
          resolve();
        }
      });
    });
    //
    Promise.all([readPLC1])
      .then(() => {
        const jsonString = JSON.stringify(
          { ...values_plc1,...values_plc5},
          (key, value) => {
            if (value === "true" || value === "false") {
              return value === "true";
            } else if (typeof value === "number") {
              return parseFloat(value.toFixed(3));
            }
            return value;
          }
        );
        res.send(jsonString);
      })
      .catch((error) => {
        console.log("Error reading data from PLCs", error);
        res.status(500).send("Error reading data from PLCs");
      });
  },
  plc1_controller(plc1, req, res) {
    const data = req.body;
    console.log(Object.keys(data), Object.values(data));
    writeDataToPLC(plc1, data, (error) => {
      if (error) {
        console.log("Error Write PLC1", error);
        res.status(500).send("Error writing data to PLC");
      } else {
        console.log("Done writing PLC1.");
        res.send(data);
      }
    });
  },
  
};
