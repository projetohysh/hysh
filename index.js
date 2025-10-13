import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Conexão com Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Rota teste
app.get("/", (req, res) => {
  res.send("API Hysh rodando 🚀");
});

// ---- ROTAS ---- //

// Criar usuário
app.post("/usuarios", async (req, res) => {
  const { nome, email, senha_hash, biografia, foto_url } = req.body;

  const { data, error } = await supabase
    .from("usuarios")
    .insert([
      {
        usuario_nome: nome,
        usuario_email: email,
        usuario_senha_hash: senha_hash,
        usuario_biografia: biografia,
        usuario_foto_url: foto_url,
      },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Criar comunidade
app.post("/comunidades", async (req, res) => {
  const { nome, descricao, criado_por } = req.body;

  const { data, error } = await supabase
    .from("comunidades")
    .insert([
      {
        comunidade_nome: nome,
        comunidade_descricao: descricao,
        comunidade_criado_por: criado_por,
      },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Criar postagem
app.post("/postagens", async (req, res) => {
  const { usuario_id, comunidade_id, conteudo } = req.body;

  const { data, error } = await supabase
    .from("postagens")
    .insert([
      {
        usuario_id,
        comunidade_id,
        postagem_conteudo: conteudo,
      },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
