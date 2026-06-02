window.onload = function(){

const WEB_APP_URL =
"https://script.google.com/macros/s/AKfycbykciAVn3ETnkuay1H5KGO7B7BVi0Xk93-vY3qNPCdkD7IjKdTYuqqFCO1KTPkpXrRJ/exec";

/* =========================
   ELEMENTS
========================= */
const receiptInput = document.getElementById("receiptNo");
const searchBtn = document.getElementById("searchBtn");
const submitBtn = document.getElementById("submitBtn");
const paperPhoto = document.getElementById("paperPhoto");
/* =========================
   EVENT LISTENERS
========================= */
searchBtn.addEventListener("click", fetchReceiptData);
submitBtn.addEventListener("click",submitData);
paperPhoto.addEventListener("change",runOCR);

receiptInput.addEventListener("keypress",
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
  const receiptNo = receiptInput.value.trim();
  clearFields();

  if(receiptNo === ""){
    setStatus("Please enter receipt number","danger");
    return;
  }
  setStatus("Searching...","warning");

  try{
    const response =
      await fetch(`${WEB_APP_URL}?receiptNo=${encodeURIComponent(receiptNo)}`);

    const data = await response.json();

    document.getElementById("debug").innerText = JSON.stringify(data, null, 2);

    if(data.found){
      document.getElementById("fileNo").value = data.fileNo || "";
      document.getElementById("pucDate").value = data.pucDate ? formatDate(data.pucDate) : "";
      document.getElementById("receiptDate").value = data.receiptDate ? formatDate(data.receiptDate)  : "";
      document.getElementById("pucDescription").value = data.pucDescription || "";
      setStatus("Record found","success");
    }else{
      setStatus("Receipt number not found","danger");
    }

  }catch(error){
    console.log(error);
    setStatus("Error connecting to server","danger");
  }
}
/* =========================
   SUBMIT DATA
========================= */
async function submitData(){

  const formData = {
    receiptNo:document.getElementById("receiptNo").value,
    fileNo:document.getElementById("fileNo").value,
    pucDate:document.getElementById("pucDate").value,
    receiptDate:document.getElementById("receiptDate").value,
    pucDescription:document.getElementById("pucDescription").value,
    actionTaken:document.getElementById("actionTaken").value
  };

  if(formData.receiptNo === ""){
    setStatus(
      "Please search receipt first",
      "danger"
    );
    return;
  }

  if(formData.actionTaken === ""){
    setStatus("Please enter action taken","danger");
    return;
  }

  setStatus("Submitting data...","warning");
  try{
    await fetch(
      WEB_APP_URL,
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type":
            "text/plain"
        },
        body:JSON.stringify(formData)
      }
    );

    setStatus("Data submitted successfully","success");

    document.getElementById("actionTaken").value = "";

  }catch(error){
    console.log(error);
    setStatus("Submission failed","danger");
  }
}
/* =========================
   OCR FUNCTION
========================= */
async function runOCR(){

  const file = paperPhoto.files[0];
  if(!file){
    return;
  }
  setStatus("Reading document...","warning");
  try{
    const result =await Tesseract.recognize(file, "eng");
    const extractedText = result.data.text;
    console.log(extractedText);

    document.getElementById("ocrText").innerText = extractedText;
   // autofill description
    document.getElementById("pucDescription").value = extractedText;
    setStatus("OCR completed","success");

  }catch(error){
    console.log(error);
    setStatus("OCR failed","danger");
  }
}
/* =========================
   CLEAR FIELDS
========================= */
function clearFields(){
  document.getElementById("fileNo").value = "";
  document.getElementById("pucDate").value = "";
  document.getElementById("receiptDate").value = "";
  document.getElementById("pucDescription").value = "";
}
/* =========================
   STATUS FUNCTION
========================= */
function setStatus(message, type){
  const status = document.getElementById("status");
  status.style.display = "block";
  status.innerHTML = message;
  status.className = `alert alert-${type} mt-4`;
}
}