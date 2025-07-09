document.addEventListener("DOMContentLoaded",()=>{
  const homeForm=document.getElementById("homeForm");
  if(homeForm){
    homeForm.addEventListener("submit",e=>{
      e.preventDefault();
      const cibil=+document.getElementById("cibil").value;
      if(cibil>=700){
        localStorage.setItem("loanData",JSON.stringify({
          name:document.getElementById("name").value,
          email:document.getElementById("email").value,
          gender:document.getElementById("gender").value,
          phone:document.getElementById("phone").value,
          loanType:document.getElementById("loanType").value,
          cibil
        }));
        window.location="profile.html";
      } else alert("Not eligible: CIBIL ≥700");
    });
  }
  const profileForm=document.getElementById("profileForm");
  if(profileForm){
    profileForm.addEventListener("submit",e=>{
      e.preventDefault();
      const data=JSON.parse(localStorage.getItem("loanData"));
      const salary=+document.getElementById("salary").value;
      const loanAmount=+document.getElementById("loanAmount").value;
      const tenure=+document.getElementById("tenure").value;
      data.salary=salary; data.loanAmount=loanAmount; data.tenure=tenure;
      data.sanctioned=Math.min(salary*10,loanAmount,data.cibil*100);
      localStorage.setItem("loanData",JSON.stringify(data));
      const banks=["HDFC (9.5%)","ICICI (10.2%)","SBI (8.7%)"];
      const list=document.getElementById("banksList");
      document.getElementById("bankOptions").classList.remove("hidden");
      list.innerHTML="";
      banks.forEach(bank=>{
        const btn=document.createElement("button");
        btn.textContent=`Apply: ${bank}`;
        btn.onclick=()=>document.getElementById("bankDetails").classList.remove("hidden");
        list.appendChild(btn);
      });
    });
  }
  document.getElementById("submitBank")?.addEventListener("click",e=>{
    e.preventDefault();
    ["bankName","accountNumber","ifsc","branch","accountHolder"].forEach(id=>{if(!document.getElementById(id).value)throw alert("Fill all bank fields");});
    document.getElementById("bankDetails").classList.add("hidden");
    document.getElementById("docUpload").classList.remove("hidden");
  });
  document.getElementById("submitDocs")?.addEventListener("click",e=>{
    e.preventDefault();
    ["aadhaar","panFront","panBack","bankStmt"].forEach(id=>{if(!document.getElementById(id).files.length)throw alert("Upload all docs");});
    const data=JSON.parse(localStorage.getItem("loanData"));
    document.getElementById("appliedLoanType").textContent=data.loanType;
    document.getElementById("docUpload").classList.add("hidden");
    document.getElementById("thankyouMsg").classList.remove("hidden");
  });
  if(location.pathname.includes("emi.html")){
    const {sanctioned,tenure}=JSON.parse(localStorage.getItem("loanData"));
    const months=tenure*12,monthly=(sanctioned/months).toFixed(2),today=new Date();
    const emiDiv=document.getElementById("emiSchedule");
    for(let i=1;i<=months;i++){
      const dt=new Date(today.getFullYear(),today.getMonth()+i,today.getDate());
      const line=document.createElement("div");
      line.textContent=`${dt.getDate()}/${dt.getMonth()+1}/${dt.getFullYear()}: ₹${monthly}`;
      emiDiv.appendChild(line);
    }
  }
});
