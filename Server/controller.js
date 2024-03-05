var values_plc1 = [];
var values_plc2 = [];
var values_plc3 = [];
var values_plc4 = [];
var values_plc5 = [];
function valuesReadyPLC1(anythingBad, newValues) {
  if (anythingBad) {
    console.log("Read Error PLC_1");
  }
  values_plc1 = newValues;
}
function valuesReadyPLC2(anythingBad, newValues) {
  if (anythingBad) {
    console.log("Read Error PLC_2");
  }
  values_plc2 = newValues;
}

function valuesReadyPLC3(anythingBad, newValues) {
  if (anythingBad) {
    console.log("Read Error PLC_3");
  }
  values_plc3 = newValues;
}

function valuesReadyPLC4(anythingBad, newValues) {
  if (anythingBad) {
    console.log("Read Error PLC_4");
  }
  values_plc4 = newValues;
}

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
  dataController(plc1, plc2, plc3, plc4, plc5, res, req) {
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
    //
    const readPLC2 = new Promise((resolve, reject) => {
      plc2.readAllItems((error, newValues) => {
        if (error) {
          reject(error);
        } else {
          valuesReadyPLC2(null, newValues);
          resolve();
        }
      });
    });
    //
    const readPLC3 = new Promise((resolve, reject) => {
      plc3.readAllItems((error, newValues) => {
        if (error) {
          reject(error);
        } else {
          valuesReadyPLC3(null, newValues);
          resolve();
        }
      });
    });
    //
    const readPLC4 = new Promise((resolve, reject) => {
      plc4.readAllItems((error, newValues) => {
        if (error) {
          reject(error);
        } else {
          valuesReadyPLC4(null, newValues);
          resolve();
        }
      });
    });
    //
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

    Promise.all([readPLC1, readPLC2, readPLC3, readPLC4, readPLC5])
      .then(() => {
        const jsonString = JSON.stringify(
          { ...values_plc1, ...values_plc2, ...values_plc3, ...values_plc4, ...values_plc5 },
          (key, value) => {
            if (value === "true" || value === "false") {
              return value === "true";
            } else if (typeof value === "number") {
              // Round the number to 3 decimal places
              return parseFloat(value.toFixed(3));
            }
            
            return value;
          }
        );
        console.log(jsonString);
       // res.send(jsonString);
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
  plc2_controller(plc2, req, res) {
    const data = req.body;
    console.log(Object.keys(data), Object.values(data));
    writeDataToPLC(plc2, data, (error) => {
      if (error) {
        console.log("Error Write PLC2", error);
        res.status(500).send("Error writing data to PLC");
      } else {
        console.log("Done writing PLC2.");
        res.send(data);
      }
    });
  },
  plc3_controller(plc3, req, res) {
    const data = req.body;
    console.log(Object.keys(data), Object.values(data));
    writeDataToPLC(plc3, data, (error) => {
      if (error) {
        console.log("Error Write PLC3", error);
        res.status(500).send("Error writing data to PLC");
      } else {
        console.log("Done writing PLC3.");
        res.send(data);
      }
    });
  },
  plc4_controller(plc4, req, res) {
    const data = req.body;
    console.log(Object.keys(data), Object.values(data));
    writeDataToPLC(plc4, data, (error) => {
      if (error) {
        console.log("Error Write PLC4", error);
        res.status(500).send("Error writing data to PLC");
      } else {
        console.log("Done writing PLC4.");
        res.send(data);
      }
    });
  },
  plc5_controller(plc5, req, res) {
    const data = req.body;
    console.log(Object.keys(data), Object.values(data));
    writeDataToPLC(plc5, data, (error) => {
      if (error) {
        console.log("Error Write PLC5", error);
        res.status(500).send("Error writing data to PLC");
      } else {
        console.log("Done writing PLC5.");
        res.send(data);
      }
    });
  },
};
