import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.PORT || 3000);
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const tutorRules = `You are The Boissss, a warm, patient AI learning coach for students, parents, and teachers.
For students, never simply dump a final homework answer. Teach Socratically: explain the concept, give one hint or one step, ask the learner to try, then kindly respond to their attempt. If they are stuck, scaffold with a similar example and return to their question. Do not withhold all help; prioritize understanding over answer-dumping. For new topics, teach in small chunks and ask a quick check-for-understanding question. For parents, suggest supportive questions and simple explanations. For teachers, help draft lesson plans, practice activities, and differentiated examples. Be accurate and age-appropriate; admit uncertainty. Do not request unnecessary personal information such as full name, school, address, or passwords. Be concise, encouraging, and interactive.`;
function json(res,status,obj){res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"});res.end(JSON.stringify(obj))}
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,`http://${req.headers.host||"localhost"}`);
 if(req.method==="GET"&&url.pathname==="/api/health")return json(res,200,{ok:true,aiConfigured:Boolean(API_KEY),model:MODEL});
 if(req.method==="GET"&&(url.pathname==="/"||url.pathname==="/index.html")){
  try{const page=await readFile(path.join(process.cwd(),"public","index.html"),"utf8");res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","X-Content-Type-Options":"nosniff"});return res.end(page)}catch{return json(res,500,{error:"public/index.html is missing"})}
 }
 if(req.method==="POST"&&url.pathname==="/api/chat"){
  let raw="";for await(const chunk of req){raw+=chunk;if(raw.length>16000)return json(res,413,{error:"Message too long"})}
  let body;try{body=JSON.parse(raw)}catch{return json(res,400,{error:"Invalid request"})}
  const message=typeof body.message==="string"?body.message.trim():"";
  const mode=["student","parent","teacher","curious"].includes(body.mode)?body.mode:"student";
  if(!message)return json(res,400,{error:"Type a question first"});
  if(message.length>3500)return json(res,413,{error:"Please shorten your question"});
  if(!API_KEY)return json(res,503,{error:"Live AI is not configured"});
  const modeHint={student:"Coach the student rather than giving final homework answers.",parent:"Help a parent support a child's learning.",teacher:"Help a teacher plan learning activities.",curious:"Teach the topic step by step."}[mode];
  try{
   const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,instructions:tutorRules+"\\nCurrent mode: "+mode+". "+modeHint,input:message,max_output_tokens:650})});
   const data=await upstream.json();
   if(!upstream.ok){console.error("AI service error",upstream.status);return json(res,502,{error:"AI service unavailable"})}
   const reply=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\\n").trim();
   return json(res,200,{reply:reply||"Let's try again. What part would you like to understand first?"});
  }catch(err){console.error("AI request failed",err.message);return json(res,502,{error:"Could not reach AI service"})}
 }
 return json(res,404,{error:"Not found"});
});
server.listen(PORT,()=>console.log(`The Boissss at http://localhost:${PORT}`));
