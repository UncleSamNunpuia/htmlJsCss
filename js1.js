const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbykciAVn3ETnkuay1H5KGO7B7BVi0Xk93-vY3qNPCdkD7IjKdTYuqqFCO1KTPkpXrRJ/exec";

const receiptInput =
document.getElementById("receiptNo");

const searchBtn =
document.getElementById("searchBtn");

searchBtn.addEventListener(
  "click",
  fetchReceiptData
);

receiptInput.addEventListener(
  "keypress",
  function(event){

    if(event.key === "Enter"){

      fetchReceiptData();
    }
  }
);

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

    const response = await fetch(
      `${WEB_APP_URL}?receiptNo=${encodeURIComponent(receiptNo)}`
    );

    const data =
      await response.json();
document.getElementById("debug").innerText =
JSON.stringify(data, null, 2);
    if(data.found){

      document.getElementById("fileNo").value =
        data.fileNo || "";

      document.getElementById("pucDate").value =
        data.pucDate || "";

      document.getElementById("receiptDate").value =
        data.receiptDate || "";

      document.getElementById("pucDescription").value =
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

function clearFields(){

  document.getElementById("fileNo").value = "";

  document.getElementById("pucDate").value = "";

  document.getElementById("receiptDate").value = "";

  document.getElementById("pucDescription").value = "";
}

function setStatus(message, className){

  const status =
    document.getElementById("status");

  status.innerHTML = message;

  status.className =
    `status ${className}`;
}