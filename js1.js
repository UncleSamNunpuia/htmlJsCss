const WEB_APP_URL =
"https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSXMYzbQ8uriM-VRyEBfmiYmKtZbEM6EL8Jje0VJxVW2x4OQO6PSpa7Bl-ETzzDn9O3v36ElWl67FYnz5D-tgeP4XWjh01Wkt-Mr-sXZ4F7sOCLT1A5E2apV6o_4N0Vn42YVcoXKjO-1t6rzFpVaCYsxtPi5K4ls7o32iozsruO1t2YJ5GxtIqdL9ncSMWEwWkXS-lySRLNRP1P2lWxixPlqrufjvf40CFqr0kxa1TuU0JRVqfUecg5SPnykAE1uNTJHbohIKcvPSM3jUVJB068v_uD4Q&lib=MgNIQUt0RtEgtWhxuTOFKV_Q-sqP20Ani";

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