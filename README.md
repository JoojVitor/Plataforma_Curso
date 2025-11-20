# 📚 PLATAFORMA CURSO  
*Empoderando o aprendizado por meio de experiências seguras e intuitivas.*

<div align="center">

![last-commit](https://img.shields.io/github/last-commit/JoojVitor/Plataforma_Curso?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/JoojVitor/Plataforma_Curso?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/JoojVitor/Plataforma_Curso?style=flat&color=0080ff)

**Tecnologias utilizadas:**

![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white)

</div>

---

# Documentação Técnica da Plataforma de Cursos Online

## 1. Arquitetura da Solução
A plataforma adota uma arquitetura distribuída composta por frontend (Next.js), backend (Node.js/Express), banco de dados MongoDB e serviço de armazenamento Amazon S3. A comunicação segue o padrão REST.

### Visão Geral da Arquitetura
- Frontend → Next.js (App Router, React)
- Backend → Express + JWT + Cookies HttpOnly
- Banco de Dados → MongoDB com Mongoose
- Armazenamento de Vídeos → AWS S3
- Distribuição de Conteúdo → CloudFront (opcional)
- Controle de Acesso → RBAC (admin, instrutor, aluno)

```
Frontend ───> Backend ───> MongoDB
     │             │
     │             └──> AWS S3 (upload/remove/get URL)
     └──────────────────> CloudFront (vídeos públicos ou assinados)
```

---

## 2. Estrutura do Backend
A estrutura atual do backend é:

```
backend/
  src/
    middleware/
      authMiddleware.ts
    models/
      Course.ts
      Enrollment.ts
      User.ts
    routes/
      admin.ts
      auth.ts
      courses.ts
      enrollments.ts
      health.ts
      profile.ts
      upload.ts
    utils/
      env.ts
      s3.ts
    db.ts
    index.ts
```

### 2.1 Middleware de Autenticação

O arquivo `authMiddleware.ts` valida tokens JWT enviados via cookie HttpOnly.

```ts
const token = req.cookies?.authToken;
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
```

Se o usuário não possuir token ou o token for inválido → 401 Unauthorized.

### 2.2 Modelo User

```ts
role: "aluno" | "instrutor" | "admin"
```

Controla autorização nas rotas de cursos e upload.

### 2.3 Modelos Course e Enrollment
Os cursos possuem aulas em formato:

```ts
aulas: [
  { id: string, titulo: string, url: string }
]
```

As matrículas relacionam aluno ↔ curso.

---

## 3. Sistema de Upload (AWS S3)

### 3.1 Rota `/upload` — Geração de URL Assinada
Apenas instrutores podem requisitar URLs assinadas.

```ts
router.post("/", authMiddleware, async (req, res) => {
  const command = new PutObjectCommand({...});
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  res.json({ uploadUrl, key });
});
```

### 3.2 Utilitário `s3.ts`

```ts
export async function getSignedVideoUrl(key: string)
export async function deleteFromS3(key: string)
```

O sistema usa:
- **Upload** com URL assinada (PUT)
- **Download** com URL assinada (GET)
- **Exclusão definitiva** com DeleteObjectCommand

### 3.3 Evitando Arquivos Órfãos
O vídeo só é enviado ao S3 **após o usuário confirmar a criação ou edição do curso**, garantindo consistência entre banco e S3.

---

## 4. Rotas da API

### 4.1 `/auth`
| Método | Rota | Descrição |
|--------|-------|------------|
| POST | `/auth/register` | Registra novo usuário |
| POST | `/auth/login` | Realiza login e retorna cookie HttpOnly |
| POST | `/auth/logout` | Remove cookie |

---

### 4.2 `/courses`
| Método | Rota | Permissão | Descrição |
|--------|-------|------------|------------|
| GET | `/courses` | público | Lista cursos |
| GET | `/courses/:id` | público | Detalhes de um curso |
| POST | `/courses` | instrutor | Criar curso |
| PUT | `/courses/:id` | instrutor dono | Editar curso |
| DELETE | `/courses/:id` | instrutor dono | Excluir curso + vídeos |

---

### 4.3 `/upload`
| POST | `/upload` | instrutor | Retorna URL assinada para upload |

---

### 4.4 `/profile`
| GET | `/profile/me` | autenticado | Retorna usuário logado |

---

### 4.5 `/enrollments`
| Método | Rota | Descrição |
|--------|-------|------------|
| POST | `/enrollments/:courseId` | Inscreve aluno |
| GET | `/enrollments/me` | Lista cursos matriculados |

---

## 5. Segurança da Plataforma

### 5.1 Autenticação com JWT + Cookies HttpOnly
- Evita acesso via JavaScript
- Protege contra XSS
- Renova sessões de forma segura

### 5.2 Controle de Acesso (RBAC)
- **Admin**: acesso total  
- **Instrutor**: gerencia somente seus cursos  
- **Aluno**: acesso apenas a cursos inscritos  

### 5.3 Proteção de Vídeos
- URLs assinadas expiram em 1h
- Vídeos nunca ficam públicos no S3
- Exclusão automática ao remover cursos

---

## 6. Fluxos Técnicos

### 6.1 Fluxo de Upload
```
Instrutor → Escolhe arquivo
Frontend → Solicita URL assinada (/upload)
Backend → AWS S3 → retorna signedURL
Frontend → Envia PUT diretamente ao S3
Backend → Salva chave do vídeo ao publicar curso
```

### 6.2 Fluxo de Criação do Curso
```
Instrutor preenche formulário
↓
Gera URLs assinadas para vídeos
↓
Envia vídeos para S3
↓
Confirma publicação
↓
Backend salva curso no MongoDB
```

### 6.3 Fluxo de Exclusão de Curso
```
Instrutor exclui curso
↓
Backend busca todas as aulas
↓
Chama deleteFromS3(key) para cada vídeo
↓
Remove curso do MongoDB
```

---

## 7. Diagrama ER (Texto)

```
Usuário (1) ----- (N) Curso
Curso (1) ------- (N) Aula
Usuário (1) ----- (N) Enrollment ----- (1) Curso
```

---

## 8. Diagrama de Caso de Uso

- **Administrador**
  - Gerenciar usuários
  - Administrar plataforma

- **Instrutor**
  - Criar curso
  - Editar curso
  - Excluir curso
  - Enviar vídeos

- **Aluno**
  - Inscrever-se em curso
  - Assistir aulas

---

## 9. Instalação e Deploy

### Backend
```
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Pré-requisitos AWS
- S3 Bucket
- Credenciais IAM com permissões:
  - s3:PutObject
  - s3:GetObject
  - s3:DeleteObject

---

# Fim da Documentação Técnica


## ⬆ Retornar ao topo  
[Voltar ao início](#plataforma_curso)
