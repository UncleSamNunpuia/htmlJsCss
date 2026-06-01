window.onload = function(){

alert("JS Loaded");

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbykciAVn3ETnkuay1H5KGO7B7BVi0Xk93-vY3qNPCdkD7IjKdTYuqqFCO1KTPkpXrRJ/exec";
/* =========================
   ELEMENTS
========================= */

const receiptInput =
document.getElementById("receiptNo");

const searchBtn =
document.getElementById("searchBtn");

const submitBtn =
document.getElementById("submitBtn");

console.log(receiptInput);
console.log(searchBtn);
console.log(submitBtn);

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

  alert("Search button clicked");

  const receiptNo =
    receiptInput.value.trim();

  clearFields();

  if(receiptNo === ""){
    setStatus(
      "Please enter receipt number",
      "danger"
    );
    return;
  }

  setStatus(
    "Searching...",
    "warning"
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
        "danger"
      );
    }

  }catch(error){
    console.log(error);
    alert(error);
    setStatus(
      "Error connecting to server",
      "danger"
    );
  }
}

/* =========================
   SUBMIT DATA
========================= */
// async function submitData(){
//   alert("Submit button clicked");
// }
/* =========================
   CLEAR FIELDS
========================= */

function clearFields(){

  document.getElementById(
    "fileNo"
  ).value = "";

  document.getElementById(
    "pucDate"
  ).value = "";

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
function setStatus(message, type){

  const status =
    document.getElementById("status");

  status.style.display = "block";

  status.innerHTML =
    message;

  status.className =
    `alert alert-${type} mt-4`;
}
}