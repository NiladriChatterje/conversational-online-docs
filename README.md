## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
what I have done is basically pulled an AI image (mistral for my case) through 
```bash Ollama pull mistral``` 
You can pull your AI model according to your choice. A lot of model is available including llama 2, llama 3 and many more.
after pulling the image, make sure that the image is running otherwise server won't able to accept queries through endpoints.

# Simple Workflow :
![WorkFlow](https://github.com/NiladriChatterje/conversational-online-docs/assets/107443816/7f50dbfa-88a6-4a90-82d4-aa9a058d9d94)

# Issue :
Creation of embeddings and storing in Memory and treating as a vectorStore requires a descent hardware. And currently such hardware
is unavailable to me. :)
thus, A static context is provided which is a direct document providing some infos about me. One can test with the provided context
and play with it.

# Demo:
![Demo-Project](https://github.com/NiladriChatterje/conversational-online-docs/assets/107443816/512f78ef-2501-4067-8fb0-ded70a337367)
