const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbykciAVn3ETnkuay1H5KGO7B7BVi0Xk93-vY3qNPCdkD7IjKdTYuqqFCO1KTPkpXrRJ/exec";

const receiptInput =
document.getElementById("receiptNo");

const searchBtn =
document.getElementById("searchBtn");

const submitBtn =
document.getElementById("submitBtn");
/* =========================
   EVENT LISTENERS
========================= */
searchBtn.addEventListener(
  "click",
  fetchReceiptData
);

submitBtn.addEventListener(
  "click",
  submitData
);

receiptInput.addEventListener(
  "keypress",
  function(event){

    if(event.key === "Enter"){

      fetchReceiptData();
    }
  }
);
/* =========================
   DATE FORMAT FUNCTION
========================= */
function formatDate(dateString){

  const date =
    new Date(dateString);

  return date.toLocaleString(
    "en-GB",
    {

      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      hour12: false
    }
  );
}
/* =========================
   FETCH RECEIPT DATA
========================= */

async function fetchReceiptData(){

  const receiptNo =
    receiptInput.value.trim();

  clearFields();

  if(receiptNo === ""){

    setStatus(
      "Please enter receipt number",
      "error"
    );

    return;
  }

  setStatus(
    "Searching...",
    "loading"
  );

  try{

    const response =
      await fetch(

        `${WEB_APP_URL}?receiptNo=${encodeURIComponent(receiptNo)}`

      );

    const data =
      await response.json();

    document.getElementById(
      "debug"
    ).innerText =
      JSON.stringify(data, null, 2);

    if(data.found){

      document.getElementById(
        "fileNo"
      ).value =

        data.fileNo || "";

      document.getElementById(
        "pucDate"
      ).value =

        data.pucDate
          ? formatDate(data.pucDate)
          : "";

      document.getElementById(
        "receiptDate"
      ).value =

        data.receiptDate
          ? formatDate(data.receiptDate)
          : "";

      document.getElementById(
        "pucDescription"
      ).value =

        data.pucDescription || "";

      setStatus(
        "Record found",
        "success"
      );

    }else{

      setStatus(
        "Receipt number not found",
        "error"
      );
    }

  }catch(error){

    console.log(error);

    setStatus(
      "Error connecting to server",
      "error"
    );
  }
}
/* =========================
   SUBMIT DATA
========================= */
async function submitData(){

  const formData = {

    receiptNo:
      document.getElementById("receiptNo").value,

    fileNo:
      document.getElementById("fileNo").value,

    pucDate:
      document.getElementById("pucDate").value,

    receiptDate:
      document.getElementById("receiptDate").value,

    pucDescription:
      document.getElementById("pucDescription").value,

    actionTaken:
      document.getElementById("actionTaken").value

  };

  if(formData.receiptNo === ""){

    setStatus(
      "Please search receipt first",
      "error"
    );

    return;
  }

  if(formData.actionTaken === ""){

    setStatus(
      "Please enter action taken",
      "error"
    );

    return;
  }

  setStatus(
    "Submitting data...",
    "loading"
  );

  try{

    const response =
      await fetch(

        WEB_APP_URL,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify(formData)
        }
      );

    const result =
      await response.text();

    console.log(result);

    setStatus(
      "Data submitted successfully",
      "success"
    );

    document.getElementById(
      "actionTaken"
    ).value = "";

  }catch(error){
    console.log(error);
    setStatus(
      "Submission failed",
      "error"
    );
  }
}
/* =========================
   CLEAR FIELDS
========================= */
function clearFields(){
  document.getElementById("fileNo").value = "";

  document.getElementById("pucDate").value = "";

  document.getElementById(
    "receiptDate"
  ).value = "";

  document.getElementById(
    "pucDescription"
  ).value = "";
}



/* =========================
   STATUS FUNCTION
========================= */

function setStatus(
  message,
  className
){

  const status =
    document.getElementById("status");

  status.innerHTML =
    message;

  status.className =
    `status ${className}`;
}

// const WEB_APP_URL =
// "https://script.google.com/macros/s/AKfycbykciAVn3ETnkuay1H5KGO7B7BVi0Xk93-vY3qNPCdkD7IjKdTYuqqFCO1KTPkpXrRJ/exec";

// const receiptInput =
// document.getElementById("receiptNo");

// const searchBtn =
// document.getElementById("searchBtn");

// searchBtn.addEventListener(
//   "click",
//   fetchReceiptData
// );

// receiptInput.addEventListener(
//   "keypress",
//   function(event){

//     if(event.key === "Enter"){

//       fetchReceiptData();
//     }
//   }
// );

// async function fetchReceiptData(){

//   const receiptNo =
//     receiptInput.value.trim();

//   clearFields();

//   if(receiptNo === ""){

//     setStatus(
//       "Please enter receipt number",
//       "error"
//     );

//     return;
//   }

//   setStatus(
//     "Searching...",
//     "loading"
//   );

//   try{

//     const response = await fetch(
//       `${WEB_APP_URL}?receiptNo=${encodeURIComponent(receiptNo)}`
//     );

//     function formatDate(dateString){

//     const date = new Date(dateString);

//     return date.toLocaleString("en-GB", {

//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false
//         });
//     }
//     const data =
//       await response.json();
//     document.getElementById("debug").innerText =JSON.stringify(data, null, 2);
//     if(data.found){

//       document.getElementById("fileNo").value =
//         data.fileNo || "";

//       document.getElementById("pucDate").value =
//         data.pucDate?formatDate(data.pucDate): "";
//         // data.pucDate || "";
//         // formatDate(data.pucDate);

//       document.getElementById("receiptDate").value =
//       data.receiptDate?formatDate(data.receiptDate): "";
//         // data.receiptDate || "";

//       document.getElementById("pucDescription").value =
//         data.pucDescription || "";

//       setStatus(
//         "Record found",
//         "success"
//       );

//     }else{

//       setStatus(
//         "Receipt number not found",
//         "error"
//       );
//     }

//   }catch(error){

//     console.log(error);

//     setStatus(
//       "Error connecting to server",
//       "error"
//     );
//   }
// }

// function clearFields(){

//   document.getElementById("fileNo").value = "";

//   document.getElementById("pucDate").value = "";

//   document.getElementById("receiptDate").value = "";

//   document.getElementById("pucDescription").value = "";
// }

// function setStatus(message, className){

//   const status =
//     document.getElementById("status");

//   status.innerHTML = message;

//   status.className =
//     `status ${className}`;
// }