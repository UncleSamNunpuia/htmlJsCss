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



  console.log(formData);



  if(formData.receiptNo === ""){

    setStatus(
      "Please search receipt first",
      "danger"
    );

    return;
  }



  if(formData.actionTaken === ""){

    setStatus(
      "Please enter action taken",
      "danger"
    );

    return;
  }



  setStatus(
    "Submitting data...",
    "warning"
  );



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

        body:
          JSON.stringify(formData)

      }

    );



    setStatus(
      "Data submitted successfully",
      "success"
    );



    document.getElementById(
      "actionTaken"
    ).value = "";



    console.log(
      "Submitted successfully"
    );



  }catch(error){

    console.log(error);

    setStatus(
      "Submission failed",
      "danger"
    );
  }
}