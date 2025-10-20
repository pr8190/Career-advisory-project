import fetch from "node-fetch";
import fs from "fs";
import { Content } from "openai/resources/containers/files.mjs";

// Load JSON files
const employees = JSON.parse(fs.readFileSync("./backend/employees.json", "utf-8"));
const Reskills = JSON.parse(fs.readFileSync("./backend/reskill.json", "utf-8"));


// OpenAI embedding function
async function getEmbedding(text) {
  //console.log(text);
  const response = await fetch(
    "https://psacodesprint2025.azure-api.net/text-embedding-3-small/openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "52dbccc9fe35400da314e3770f756e2d"
      },
      body: JSON.stringify({
        model:"text-embedding-3-small",
        input:text
    })
  });
  const data = await response.json();
  //console.log(data.data[0].embedding);
  return data.data[0].embedding;
}

// Cosine similarity
function cosineSimilarity(vecA, vecB) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Generate reskill plan

async function generateReskillPlan(name, department) {
  const comp = Reskills[department];
  // Compute leadership embeddings once 
  const reskillEmbeddings = [];
  const reSkills = [];
  //console.log(comp);
  for (let job of comp) {
    const embedding = await getEmbedding(job.skill);
    reSkills.push([job.role, job.skill]);
    reskillEmbeddings.push(embedding);
  }

    const employeeText = employees.find(e=> e.personal_info.name == name).skills.map(x=>x.skill_name).join(", ");
    const employeeEmbedding = await getEmbedding(employeeText);

    const gaps = [];
    for (let i = 0; i < reskillEmbeddings.length; i++) {
      const sim = Number(cosineSimilarity(employeeEmbedding, reskillEmbeddings[i]));
      
      if (sim > 0.5) { //
        gaps.push([reSkills[i], sim]);
      }
    }
    gaps.sort((a,b)=>b[1]-a[1]);
    //console.log(gaps);
    // Build timeline plan
    let startYear = 0;
    let c = 1;
    let plan = "";
    for (let i = 0; i < gaps.length; i++) {
      const x = gaps[i][0][0];
      const y = gaps[i][0][1];
      const emp = employees.find(e=>e.personal_info.name == name);
      //console.log(emp);
      if (x == emp.employment_info.job_title) continue;
      const endYear = startYear + 1;
      plan += `${c}. ${x} (${startYear} - ${endYear} years)\n  Skills Required:\n ${y}\n `;
      if (i!=gaps.length-1) plan+= `  ↓ \n`;
      c++;
      startYear = endYear;
    }

    //console.log(plan);
    return plan;
  
}

export default generateReskillPlan;