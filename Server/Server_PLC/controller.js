let values_plc = [];

function valuesReadyplc(error, newValues) {
  if (error) {
    console.log("Read Error PLC_1", error);
  } else {
    values_plc = newValues;
  }
}

function writeDataToPLC(plc, data, callback, retryCount = 3) {
  plc.writeItems(Object.keys(data), Object.values(data), (error) => {
    if (error) {
      console.log("Error writing to PLC", error);
      if (retryCount > 0) {
        console.log("Retrying...");
        setTimeout(() => {
          writeDataToPLC(plc, data, callback, retryCount - 1);
        }, 100); // Retry after 100 milliseconds
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
  async dataController(plc) {
    try {
      const newValues = await new Promise((resolve, reject) => {
        plc.readAllItems((error, values) => {
          if (error) {
            reject(error);
          } else {
            resolve(values);
          }
        });
      });

      valuesReadyplc(null, newValues);
      return values_plc;
    } catch (error) {
      console.log("Error reading data from PLCs", error);
      throw error;
    }
  },

  plc_controller(plc, data) {
    console.log(Object.keys(data), Object.values(data));
    writeDataToPLC(plc, data, (error) => {
      if (error) {
        console.log("Error Write PLC 1", error);
      } else {
        console.log("Done writing.");
      }
    });
  },
};
